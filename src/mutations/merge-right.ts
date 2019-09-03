import { Editor } from 'slate';

import { TableLayout } from '../layout';
import { Option } from '../option';
import { mergeCells } from './merge';

export function mergeRight(opts: Required<Option>, editor: Editor) {
  const currentCell = TableLayout.currentCell(editor, opts);
  if (!currentCell) return;
  const { key } = currentCell;
  const table = TableLayout.create(editor, opts);
  if (!table) return;
  if (table.isLastColumn(key)) return;

  const current = table.findCellBy(key);
  const right = table.getRight(key);

  if (!right || !current) return;

  mergeCells(editor, current.key, right.key, opts);
}
