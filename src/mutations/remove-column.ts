import { Editor } from 'slate';
import { TableLayout } from '../layout';
import { Option } from '../option';

export function removeColumn(opts: Required<Option>, editor: Editor, at?: number) {
  const table = TableLayout.create(editor, opts);
  if (!table) return editor;
  const columnIndex = typeof at === 'undefined' ? table.columnIndex : at;

  editor.withoutNormalizing(() => {
    table.filterHorizontalMergedCellsBy(columnIndex).forEach(cell => {
      editor.setNodeByKey(cell.key, {
        type: cell.block.type,
        data: { ...cell.block.data.toObject(), colspan: cell.colspan - 1 },
      });
    });

    // Remove the cell from every row
    if (table.width > 1) {
      table.table.forEach((row, index) => {
        const cell = row[columnIndex];
        if (cell.colspan === 1) {
          editor.removeNodeByKey(cell.key);
        }
        if (cell.rowBlock.nodes.size === 1 && cell.colspan === 1) {
          table.getRows(index).forEach(cell => {
            if (cell.rowspan > 1) {
              editor.setNodeByKey(cell.key, {
                type: cell.block.type,
                data: { ...cell.block.data.toObject(), rowspan: cell.rowspan - 1 },
              });
            }
          });
          editor.removeNodeByKey(cell.rowBlock.key);
        }
      });
    } else {
      // If last column, clear text in cells instead
      editor.removeNodeByKey(table.currentTable.key);
    }
  });
}
