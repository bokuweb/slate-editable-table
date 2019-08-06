import { Editor } from 'slate';
import { createRow } from '../create-row';
import { TableMap } from '../table-map';
import { Option, defaultOptions } from '../option';

export function insertRow(opts: Option = defaultOptions, editor: Editor, at?: number) {
  const table = TableMap.create(editor);
  if (!table) return editor;
  const rowIndex = typeof at !== 'undefined' ? at : table.rowIndex + 1;

  table.table[table.rowIndex]
    .filter(cell => cell.rowspan > 1)
    .forEach(cell => {
      editor.setNodeByKey(cell.key, {
        type: cell.block.type,
        data: { ...cell.block.data.toObject(), rowspan: cell.rowspan + 1 },
      });
    });
  const newRowLength = table.table[table.rowIndex].filter(cell => cell.rowspan === 1).length;
  const newRow = createRow(opts, newRowLength);

  return editor
    .insertNodeByKey(table.currentTable.key, rowIndex, newRow)
    .moveToEndOfNode(newRow.nodes.get(table.columnIndex));
}
