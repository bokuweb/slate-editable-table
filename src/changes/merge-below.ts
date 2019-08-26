import { Editor } from 'slate';

import { TableLayout } from '../layout';
import { Option } from '../option';
import { mergeCells } from './merge';

export function mergeBelow(opts: Option, editor: Editor) {
  const currentCell = TableLayout.currentCell(editor);
  if (!currentCell) return;
  const { key } = currentCell;
  const table = TableLayout.create(editor);
  if (!table) return;
  if (table.isLastRow(key) || !currentCell) return;

  const current = table.findCellBy(key);
  const below = table.findBelow(key);

  if (!below || !current) return;

  mergeCells(editor, current.key, below.key, opts);
}
