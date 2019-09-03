import { Editor, Block, BlockJSON, Inline, Text } from 'slate';
import { TableLayout } from '../layout';
import { Option, defaultOptions } from '../option';

export function removeRow(opts: Required<Option> = defaultOptions, editor: Editor, at?: number) {
  const table = TableLayout.create(editor, opts);
  if (!table) return editor;
  const below = table.findBelow(table.cell.key);
  const { rowIndex, row } = table;
  const index = typeof at === 'undefined' ? table.rowIndex : at;
  if (table.height === 1 || !below) {
    table.getRows(index).forEach(cell => {
      if (cell.rowspan === 1) return;
      editor.setNodeByKey(cell.key, {
        type: cell.block.type,
        data: { ...cell.block.data.toObject(), rowspan: cell.rowspan - 1 },
      });
    });
    editor.removeNodeByKey(row.key);
    if (table.height === 1) {
      editor.removeNodeByKey(table.currentTable.key);
    }
  } else {
    const newNodes = below.rowBlock.nodes.toArray().map((b?: Block | Inline | Text) => {
      if (!Block.isBlock(b)) return null;
      return b.toJSON();
    });
    const inserted: { [key: string]: boolean } = {};
    table.getRows(index).forEach(cell => {
      if (cell.rowspan === 1) return;
      if (cell.isTopOfMergedCell) {
        const newBlock = Block.create({
          type: cell.block.type,
          data: { ...cell.block.data.toObject(), rowspan: cell.rowspan - 1 },
          nodes: cell.block.nodes,
        });
        if (inserted[cell.key]) return;
        newNodes.splice(cell.nodeIndex, 0, newBlock.toJSON());
        inserted[cell.key] = true;
      } else {
        editor.setNodeByKey(cell.key, {
          type: cell.block.type,
          data: { ...cell.block.data.toObject(), rowspan: cell.rowspan - 1 },
        });
      }
    });
    const newBlock = Block.fromJSON({
      ...below.rowBlock.toJSON(),
      nodes: newNodes as Array<BlockJSON>,
    });
    editor.removeNodeByKey(row.key);
    editor.replaceNodeByKey(below.rowBlock.key, newBlock);
  }

  const newRow = TableLayout.findRowBlock(editor, rowIndex, opts);
  if (!newRow) {
    // TODO: find table when unfocused from table.
    return;
  }
  editor.moveTo(newRow.key);
}
