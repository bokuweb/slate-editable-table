import * as React from 'react';
import { Editor, Block } from 'slate';
import { Option } from './option';
import { Store } from './store';
import { useResizableTable, ResizeValue } from './use-resizable';

export type Props = {
  node: Block;
  attributes: { [key: string]: any };
  children: React.ReactNode;
};

const tableStyle = {
  // borderCollapse: 'collapse' as const,
  borderSpacing: 0,
  Layout: 'fixed' as const,
  wordBreak: 'break-word' as const,
};

type TableProps = {
  children: React.ReactNode;
  maxWidth?: string;
  disableResizing: boolean;
  store: Store;
  onInit: (data: ResizeValue) => void;
  onUpdate: (data: ResizeValue) => void;
  onResize: (e: MouseEvent, data: ResizeValue) => void;
  onHandleMouseOver?: () => void;
};

export interface TableHandler {
  update: () => void;
}

export const InnerTable = React.forwardRef<TableHandler, TableProps & { attributes: any; style?: React.CSSProperties }>(
  (props, tableRef) => {
    const [disableResizing, forceUpdate] = React.useState(false);
    const maxWidth = typeof props.maxWidth === 'undefined' ? 'auto' : props.maxWidth + 'px';
    const { ref, update } = useResizableTable({
      disableResizing,
      maxWidth: props.maxWidth,
      onResize: props.onResize,
      onInit: props.onInit,
      onUpdate: props.onUpdate,
      onHandleHover: props.onHandleMouseOver,
    });

    props.store.subscribeDisableResizing(v => {
      forceUpdate(v);
    });
    React.useImperativeHandle(tableRef, () => ({
      update: () => {
        update();
      },
    }));
    return (
      <table style={{ ...props.style, ...tableStyle, maxWidth }} {...props.attributes} ref={ref}>
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

export function createRenderers(opts: Required<Option>, ref: any, store: Store) {
  return (props: any, editor: any, next: () => void): any => {
    switch (props.node.type) {
      case opts.typeContent:
        return (
          <p style={{ margin: 0 }} {...props.attributes}>
            {props.children}
          </p>
        );
      case 'heading':
        return <h1 {...props.attributes}>{props.children}</h1>;
      case 'subheading':
        return <h2 {...props.attributes}>{props.children}</h2>;
      case opts.typeTable:
        const maxWidth = props.node.data.get('maxWidth') as string | undefined;
        return (
          <Table
            ref={ref}
            store={store}
            onInit={values => {
              updateWidth(editor, values);
            }}
            onUpdate={values => {
              console.log(values);
              updateWidth(editor, values);
            }}
            onResize={(e, values) => {
              editor.blur();
              updateWidth(editor, values);
            }}
            disableResizing={false}
            maxWidth={maxWidth}
            style={{ borderRight: `solid 1px #000`, ...opts.tableStyle }}
            attributes={props.attributes}
          >
            <tbody {...props.attributes}>{props.children}</tbody>
          </Table>
        );
      case opts.typeRow:
        return (
          <tr {...props.attributes} style={opts.rowStyle}>
            {props.children}
          </tr>
        );
      case opts.typeCell:
        const width =
          typeof props.node.data.get('width') === 'undefined' ? 'auto' : props.node.data.get('width') + 'px';
        return (
          <td
            {...props.attributes}
            colSpan={props.node.data.get('colspan')}
            rowSpan={props.node.data.get('rowspan')}
            style={{
              ...opts.cellStyle,
              borderBottom: `solid 1px #000`,
              width,
              backgroundColor: props.node.data.get('selectionColor'),
            }}
          >
            {props.children}
          </td>
        );
      default:
        return next();
    }
  };
}
