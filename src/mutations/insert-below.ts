import { Editor } from 'slate';
import { TableLayout, getRowIndex } from '../layout';
import { Option, defaultOptions } from '../option';
import { createRow } from '../create-row';

export function insertBelow(opts: Option = defaultOptions, editor: Editor) {
  const rowIndex = getRowIndex(editor, opts);
  if (rowIndex === null) return editor;
  const table = TableLayout.create(editor);
  if (!table) return editor;
  if (rowIndex + 1 === table.table.length) {
    const newRow = createRow(opts, table.table[0].length);
    return editor
      .insertNodeByKey(table.currentTable.key, rowIndex + 1, newRow)
      .moveToEndOfNode(newRow.nodes.get(table.columnIndex));
  } else {
    table.table[rowIndex + 1]
      .filter(cell => cell.rowspan > 1 && !cell.isTopOfMergedCell)
      .forEach(cell => {
        editor.setNodeByKey(cell.key, {
          type: cell.block.type,
          data: { ...cell.block.data.toObject(), rowspan: cell.rowspan + 1 },
        });
      });
    const newRowLength = table.table[rowIndex + 1].filter(cell => {
      return cell.rowspan === 1 || cell.isTopOfMergedCell;
    }).length;
    const newRow = createRow(opts, newRowLength);

    return editor
      .insertNodeByKey(table.currentTable.key, rowIndex + 1, newRow)
      .moveToEndOfNode(newRow.nodes.get(table.columnIndex));
  }
}
