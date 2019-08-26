import { Editor } from 'slate';
import { TableLayout } from '../layout';

import { createCell } from '../create-cell';
import { Option, defaultOptions } from '../option';

export function insertRight(opts: Option = defaultOptions, editor: Editor, at?: number) {
  const table = TableLayout.create(editor);
  if (!table) return editor;
  const columnIndex = (typeof at !== 'undefined' ? at : table.columnIndex) + 1;

  const added: { [k: string]: boolean } = {};
  if (table.table[0].length === columnIndex) {
    table.table.forEach(row => {
      const cell = row[columnIndex - 1];
      const newCell = createCell(opts, '');
      editor.insertNodeByKey(cell.rowKey, columnIndex, newCell);
    });
  } else {
    table.table.forEach(row => {
      const cell = row[columnIndex];
      if (cell.colspan === 1 || table.table.length === 1) {
        if (added[cell.rowKey]) return;
        const newCell = createCell(opts, '', { rowspan: `${cell.rowspan}` });
        editor.insertNodeByKey(cell.rowKey, columnIndex, newCell);
        added[cell.rowKey] = true;
      } else {
        editor.setNodeByKey(cell.key, {
          type: cell.block.type,
          data: { ...cell.block.data.toObject(), colspan: cell.colspan + 1 },
        });
      }
    });
  }
}
