import { Editor, Value, ValueJSON } from 'slate';

import { EditTable } from '../index';
import { findCurrentTable } from '../layout';
import { mergeCells } from './merge';
import { createHtml } from './test-helper';
import value from '../../mocks/two-by-two';

describe('merge', function() {
  const plugin = EditTable();
  it('merge 0 and 1 in 2X2 table', function() {
    const editor = new Editor({ value: Value.fromJSON(value as ValueJSON), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('0');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    const t = findCurrentTable(editor);
    if (!t) throw new Error('Failed to find block');
    const newEditor = mergeCells(editor, '0', '1');
    if (!newEditor) throw new Error('Failed to find editor');
    expect(newEditor.value.toJSON()).toMatchSnapshot();
    expect(createHtml(newEditor.value)).toMatchSnapshot();
  });

  it('merge 0 and 2 in 2X2 table', function() {
    const editor = new Editor({ value: Value.fromJSON(value as ValueJSON), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('0');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    const t = findCurrentTable(editor);
    if (!t) throw new Error('Failed to find block');
    const newEditor = mergeCells(editor, '0', '2');
    if (!newEditor) throw new Error('Failed to find editor');
    expect(newEditor.value.toJSON()).toMatchSnapshot();
    expect(createHtml(newEditor.value)).toMatchSnapshot();
  });

  it('merge all in 2X2 table', function() {
    const editor = new Editor({ value: Value.fromJSON(value as ValueJSON), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('0');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    const t = findCurrentTable(editor);
    if (!t) throw new Error('Failed to find block');
    const newEditor = mergeCells(editor, '0', '3');
    if (!newEditor) throw new Error('Failed to find editor');
    expect(newEditor.value.toJSON()).toMatchSnapshot();
    expect(createHtml(newEditor.value)).toMatchSnapshot();
  });
});
