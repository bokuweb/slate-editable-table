import * as React from 'react';
import { Editor, Block } from 'slate';
import { Option, defaultOptions } from './option';
import { useResizableTable, ResizeValue } from './use-resizable';

export type Props = {
  node: Block;
  attributes: { [key: string]: any };
  children: React.ReactNode;
};

const tableStyle = {
  borderCollapse: 'collapse' as const,
  tableLayout: 'fixed' as const,
  wordBreak: 'break-all' as const,
  userSelect: 'none' as const,
};

type TableProps = {
  children: React.ReactNode;
  onResize: (e: MouseEvent, data: ResizeValue) => void;
  onHandleMouseOver: () => void;
};

const Table = (props: TableProps & { attributes: any }) => {
  const { ref } = useResizableTable({
    onResize: props.onResize,
    onHandleHover: props.onHandleMouseOver,
  });
  return (
    <table style={tableStyle} {...props.attributes} ref={ref}>
      {props.children}
    </table>
  );
};

export function createRenderers(opts: Option = defaultOptions) {
  return (props: any, editor: any, next: () => void): any => {
    switch (props.node.type) {
      case 'paragraph':
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
        return (
          <Table
            onResize={(e, values) => {
              editor.blur();
              Object.keys(values).forEach(k => {
                const n = editor.value.document.getNode(k);
                if (!Block.isBlock(n)) return;
                editor.setNodeByKey(k, {
                  type: n.type,
                  data: { ...n.data.toObject(), width: values[k] },
                });
              });
            }}
            onHandleMouseOver={() => {
              // editor.blur();
            }}
            attributes={props.attributes}
          >
            <tbody {...props.attributes}>{props.children}</tbody>
          </Table>
        );
      case opts.typeRow:
        return <tr {...props.attributes}>{props.children}</tr>;
      case opts.typeCell:
        const width =
          typeof props.node.data.get('width') === 'undefined' ? 'auto' : props.node.data.get('width') + 'px';
        return (
          <td
            {...props.attributes}
            colSpan={props.node.data.get('colspan')}
            rowSpan={props.node.data.get('rowspan')}
            style={{
              textAlign: props.node.data.get('align'),
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
