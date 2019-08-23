import { Editor } from 'slate';

import { findAnchorCell, findFocusCell } from '../table-map';
import { mergeCells } from './merge';
import { Option } from '../option';

export function mergeSelection(opts: Option, editor: Editor) {
  const anchorCellBlock = findAnchorCell(editor, opts);
  const focusCellBlock = findFocusCell(editor, opts);
  console.log(anchorCellBlock, focusCellBlock);
  if (!anchorCellBlock || !focusCellBlock) return;
  if (anchorCellBlock.key === focusCellBlock.key) return;
  console.log('aa');
  mergeCells(editor, anchorCellBlock.key, focusCellBlock.key, opts);
  return editor;
}
