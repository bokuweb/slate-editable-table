import * as React from 'react';
import { Editor, Block } from 'slate';
import { Option } from './option';
import { ComponentStore } from './store';
import { useResizableTable, ResizeValue } from './use-resizable';
import { removeSelection, addSelectionStyle } from './selection';
import * as table from './layout';

export type Props = {
  node: Block;
  attributes: { [key: string]: any };
  children: React.ReactNode;
};

const tableStyle = {
  borderSpacing: 0,
  borderRight: `solid 1px #000`,
  Layout: 'fixed' as const,
  wordBreak: 'break-word' as const,
};

type TableProps = {
  children: React.ReactNode;
  maxWidth?: string;
  store: ComponentStore;
  editor: Editor;
  onInit: (editor: Editor, data: ResizeValue) => void;
  onUpdate: (editor: Editor, data: ResizeValue) => void;
  onResize: (editor: Editor, data: ResizeValue) => void;
  onHandleMouseOver?: () => void;
};

export interface TableHandler {
  update: () => void;
}

export const InnerTable = React.forwardRef<TableHandler, TableProps & { attributes: any; style?: React.CSSProperties }>(
  (props, tableRef) => {
    const [disableResizing, forceUpdate] = React.useState(false);
    const maxWidth = typeof props.maxWidth === 'undefined' ? 'auto' : props.maxWidth + 'px';

    const onInit = React.useCallback(
      (values: ResizeValue) => {
        props.onInit(props.editor, values);
      },
      [props.editor],
    );

    const onUpdate = React.useCallback(
      (values: ResizeValue) => {
        props.onUpdate(props.editor, values);
      },
      [props.editor],
    );

    const onResize = React.useCallback(
      (e: Event, values: ResizeValue) => {
        props.editor.blur();
        props.onResize(props.editor, values);
      },
      [props.editor],
    );

    const { ref, update } = useResizableTable({
      disableResizing,
      maxWidth: props.maxWidth,
      onResize,
      onInit,
      onUpdate,
      onHandleHover: props.onHandleMouseOver,
    });

    React.useEffect(() => {
      props.store.subscribeDisableResizing(props.editor, v => {
        forceUpdate(v);
      });
    }, []);

    React.useImperativeHandle(tableRef, () => ({
      update: () => {
        update();
      },
    }));

    const onDragStart = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
    }, []);

    return (
      <table
        style={{ ...props.style, ...tableStyle, maxWidth }}
        ref={ref}
        {...props.attributes}
        onDragStart={onDragStart}
      >
        {props.children}
      </table>
    );
  },
);

const Table = React.memo(InnerTable);

function updateWidth(editor: Editor, value: ResizeValue) {
  Object.keys(value).forEach(k => {
    const n = editor.value.document.getNode(k);
    if (!Block.isBlock(n)) return;
    editor.setNodeByKey(k, {
      type: n.type,
      data: { ...n.data.toObject(), width: value[k] },
    });
  });
}

const contentStyle = {
  margin: 0,
};

const Content = React.memo((props: { attributes: any; children: React.ReactNode }) => {
  return (
    <p style={contentStyle} {...props.attributes}>
      {props.children}
    </p>
  );
});

type CellProps = {
  attributes: any;
  node: Block;
  store: ComponentStore;
  editor: Editor;
  opts: Required<Option>;
  children: React.ReactNode;
};

const Cell = React.memo((props: CellProps) => {
  const width = typeof props.node.data.get('width') === 'undefined' ? 'auto' : props.node.data.get('width') + 'px';
  const onMouseUp = React.useCallback((e: Event) => {
    props.store.clearCellSelecting();
    window.removeEventListener('mouseup', onMouseUp);
  }, []);
  const onWindowClick = React.useCallback(
    (e: Event) => {
      if (!table.findCurrentTable(props.editor, props.opts)) {
        removeSelection(props.editor);
        props.store.setAnchorCellBlock(null);
        props.store.setFocusCellBlock(null);
        window.removeEventListener('click', onWindowClick);
      }
    },
    [props.editor, props.opts],
  );

  React.useEffect(() => {
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('click', onWindowClick);
    };
  }, [onMouseUp, onWindowClick]);

  return (
    <td
      {...props.attributes}
      onMouseDown={e => {
        if (!(e.target instanceof HTMLElement)) return;
        props.store.setAnchorCellBlock(null);
        props.store.setFocusCellBlock(null);
        removeSelection(props.editor);
        props.store.setCellSelecting();
        const anchorCellBlock = table.findCellBlockByElement(props.editor, e.target, props.opts);
        props.store.setAnchorCellBlock(anchorCellBlock);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('click', onWindowClick);
      }}
      onMouseOver={e => {
        const anchorCellBlock = props.store.getAnchorCellBlock();
        if (anchorCellBlock === null) return;
        if (!(e.target instanceof HTMLElement)) return;
        if (!props.store.getCellSelecting()) return;
        const focusCellBlock = table.findCellBlockByElement(props.editor, e.target, props.opts);
        if (!focusCellBlock) return;
        const prevFocusBlock = props.store.getFocusCellBlock();
        if (focusCellBlock.key === (prevFocusBlock && prevFocusBlock.key)) return;
        const t = table.TableLayout.create(props.editor, props.opts);
        if (!t) {
          removeSelection(props.editor);
          props.store.setAnchorCellBlock(null);
          props.store.setFocusCellBlock(null);
          return;
        }
        props.store.setFocusCellBlock(focusCellBlock);
        // HACK: Add ::selection style when greater than 1 cells selected.
        addSelectionStyle();
        const blocks = table.createSelectedBlockMap(props.editor, anchorCellBlock.key, focusCellBlock.key, props.opts);
        t.table.forEach(row => {
          row.forEach(cell => {
            if (blocks[cell.key]) {
              props.editor.setNodeByKey(cell.key, {
                type: cell.block.type,
                data: { ...cell.block.data.toObject(), selectionColor: props.opts.selectionColor },
              });
            } else {
              props.editor.setNodeByKey(cell.key, {
                type: cell.block.type,
                data: { ...cell.block.data.toObject(), selectionColor: null },
              });
            }
          });
        });
      }}
      colSpan={props.node.data.get('colspan')}
      rowSpan={props.node.data.get('rowspan')}
      style={{
        ...props.opts.cellStyle,
        width,
        borderBottom: `solid 1px #000`,
        verticalAlign: 'baseline',
        backgroundColor: props.node.data.get('selectionColor'),
      }}
    >
      {props.children}
    </td>
  );
});

const preventDefault = (e: Event) => e.preventDefault();

export function createRenderers(opts: Required<Option>, ref: any, store: ComponentStore) {
  return (props: any, editor: any, next: () => void): any => {
    switch (props.node.type) {
      case opts.typeContent:
        return <Content attributes={props.attributes}> {props.children}</Content>;
      case opts.typeTable:
        const maxWidth = props.node.data.get('maxWidth') as string | undefined;
        return (
          <Table
            ref={ref}
            editor={editor}
            store={store}
            onInit={updateWidth}
            onUpdate={updateWidth}
            onResize={updateWidth}
            maxWidth={maxWidth}
            style={opts.tableStyle}
            attributes={props.attributes}
          >
            <tbody {...props.attributes}>{props.children}</tbody>
          </Table>
        );
      case opts.typeRow:
        return (
          <tr {...props.attributes} style={opts.rowStyle} onDrag={preventDefault}>
            {props.children}
          </tr>
        );
      case opts.typeCell:
        return (
          <Cell editor={editor} store={store} node={props.node} attributes={props.attributes} opts={opts}>
            {props.children}
          </Cell>
        );
      default:
        return next();
    }
  };
}
