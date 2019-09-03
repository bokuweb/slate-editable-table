import { Editor } from 'slate';
import { TableLayout } from '../layout';

import { createCell } from '../create-cell';
import { Option } from '../option';

export function insertLeft(opts: Required<Option>, editor: Editor, at?: number) {
  const table = TableLayout.create(editor, opts);
  if (!table) return editor;
  const columnIndex = typeof at !== 'undefined' ? at : table.columnIndex;

  const added: { [k: string]: boolean } = {};
  table.table.forEach(row => {
    const cell = row[columnIndex];
    if (cell.colspan === 1 || table.table.length === 1) {
      if (added[cell.rowKey]) return;
      let newCell = createCell(opts, '', { rowspan: `${cell.rowspan}` });
      editor.insertNodeByKey(cell.rowKey, cell.nodeIndex, newCell);
      added[cell.rowKey] = true;
    } else {
      editor.setNodeByKey(cell.key, {
        type: cell.block.type,
        data: { ...cell.block.data.toObject(), colspan: cell.colspan + 1 },
      });
    }
  });
}
