import { Editor } from 'slate';
import { TableMap } from '../table-map';

import { createCell } from '../create-cell';
import { Option, defaultOptions } from '../option';

export function insertColumn(opts: Option = defaultOptions, editor: Editor, at?: number) {
  const table = TableMap.create(editor);
  if (!table) return editor;
  table.table.forEach(row => {
    const cell = row[table.columnIndex];
    if (cell.colspan === 1 || table.table.length === 1) {
      const newCell = createCell(opts);
      editor.insertNodeByKey(cell.rowKey, at || 0, newCell);
    } else {
      editor.setNodeByKey(cell.key, {
        type: cell.block.type,
        data: { ...cell.block.data.toObject(), colspan: cell.colspan + 1 },
      });
    }
  });
}
