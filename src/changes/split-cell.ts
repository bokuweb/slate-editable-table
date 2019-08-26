import { Editor } from 'slate';
import { TableLayout } from '../layout';

import { createCell } from '../create-cell';
import { Option, defaultOptions } from '../option';

export function splitCell(opts: Option = defaultOptions, editor: Editor, at?: number) {
  const table = TableLayout.create(editor);
  if (!table) return editor;
  const current = table.cell;
  const cell = table.findCellBy(current.key);
  if (!cell) return editor;

  if (cell.rowspan === 1 && cell.colspan === 1) return editor;
  for (let y = 0; y < cell.rowspan; y++) {
    let targetIndex = 0;
    let prevCellKey = '';
    for (const c of table.table[cell.row + y]) {
      if (c.key === cell.key) {
        break;
      } else {
        if (prevCellKey !== c.key) {
          targetIndex++;
        }
      }
    }

    for (let x = 0; x < cell.colspan; x++) {
      if (y === 0) {
        if (x === 0) {
          editor.setNodeByKey(cell.key, {
            type: cell.block.type,
            data: { ...cell.block.data.toObject(), colspan: 1, rowspan: 1 },
          });
        } else {
          const newCell = createCell(opts, '');
          editor.insertNodeByKey(cell.rowKey, cell.col + 1, newCell);
        }
      } else {
        const newCell = createCell(opts, '');
        const row = table.currentTable.nodes.get(y + cell.row);
        editor.insertNodeByKey(row.key, targetIndex, newCell);
      }
    }
  }
}
