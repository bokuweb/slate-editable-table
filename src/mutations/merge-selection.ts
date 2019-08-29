import { Editor } from 'slate';

import { findAnchorCell, findFocusCell } from '../layout';
import { mergeCells } from './merge';
import { Option } from '../option';

export function mergeSelection(opts: Required<Option>, editor: Editor) {
  const anchorCellBlock = findAnchorCell(editor, opts);
  const focusCellBlock = findFocusCell(editor, opts);
  if (!anchorCellBlock || !focusCellBlock) return;
  if (anchorCellBlock.key === focusCellBlock.key) return;
  mergeCells(editor, anchorCellBlock.key, focusCellBlock.key, opts);
  return editor;
}
