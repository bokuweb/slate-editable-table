import { Editor } from 'slate';
import { TableMap } from '../table-map';
import { Option, defaultOptions } from '../option';

export function removeTable(opts: Option = defaultOptions, editor: Editor) {
  const table = TableMap.currentTable(editor, opts);
  if (!table) return editor;
  return editor.deselect().removeNodeByKey(table.key);
}
