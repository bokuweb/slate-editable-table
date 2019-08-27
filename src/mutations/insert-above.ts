import { Editor } from 'slate';
import { getRowIndex, TableLayout } from '../layout';
import { Option, defaultOptions } from '../option';
import { createRow } from '../create-row';

export function insertAbove(opts: Option = defaultOptions, editor: Editor) {
  const rowIndex = getRowIndex(editor, opts);
  if (rowIndex === null) return editor;
  const table = TableLayout.create(editor);
  if (!table) return editor;

  if (rowIndex === 0) {
    const newRow = createRow(opts, table.table[table.rowIndex].length);
    return editor
      .insertNodeByKey(table.currentTable.key, rowIndex, newRow)
      .moveToEndOfNode(newRow.nodes.get(table.columnIndex));
  } else {
    let len = 0;
    table.table[table.rowIndex].forEach(cell => {
      if (cell.rowspan > 1 && !cell.isTopOfMergedCell) {
        editor.setNodeByKey(cell.key, {
          type: cell.block.type,
          data: { ...cell.block.data.toObject(), rowspan: cell.rowspan + 1 },
        });
      } else {
        len++;
      }
    });
    const newRow = createRow(opts, len);
    return editor
      .insertNodeByKey(table.currentTable.key, rowIndex, newRow)
      .moveToEndOfNode(newRow.nodes.get(table.columnIndex));
  }
}
