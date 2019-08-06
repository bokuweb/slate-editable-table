import { Editor } from 'slate';
import { createTable } from '../create-table';
import { Option, defaultOptions } from '../option';

export function insertTable(opts: Option = defaultOptions, editor: Editor, columns = 2, rows = 2) {
  const { value } = editor;

  if (!value.selection.start.key) return false;
  const table = createTable(opts, columns, rows);
  return editor.insertBlock(table);
}
