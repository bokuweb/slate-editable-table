import { Editor } from 'slate';
import { TableLayout } from '../layout';
import { Option, defaultOptions } from '../option';

export function removeTable(opts: Required<Option> = defaultOptions, editor: Editor) {
  const table = TableLayout.currentTable(editor, opts);
  if (!table) return editor;
  return editor.deselect().removeNodeByKey(table.key);
}
