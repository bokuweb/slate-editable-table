import { Editor } from 'slate';

import { mergeCells } from './merge';
import { Option } from '../option';
import { Store } from '../store';

export function mergeSelection(opts: Required<Option>, editor: Editor, store: Store) {
  const anchorCellBlock = store.getAnchorCellBlock();
  const focusCellBlock = store.getFocusCellBlock();
  if (!anchorCellBlock || !focusCellBlock) return;
  if (anchorCellBlock.key === focusCellBlock.key) return;
  mergeCells(editor, anchorCellBlock.key, focusCellBlock.key, opts);
  return editor;
}
