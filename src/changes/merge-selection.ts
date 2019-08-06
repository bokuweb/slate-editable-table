import { Editor } from 'slate';

import { findAnchorCell, findFocusCell } from '../table-map';
import { mergeCells } from './merge';
import { Option } from '../option';

export function mergeSelection(opts: Option, editor: Editor) {
  const anchorBlock = findAnchorCell(editor, opts);
  const focusCellBlock = findFocusCell(editor, opts);
  if (!anchorBlock || !focusCellBlock) return;
  if (anchorBlock.key === focusCellBlock.key) return;
  mergeCells(editor, anchorBlock.key, focusCellBlock.key, opts);
  return editor;
}
