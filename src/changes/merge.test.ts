import { Editor, Value, ValueJSON, Block } from 'slate';
import { EditTable } from '../index';
import { findCurrentTable, TableLayout } from '../layout';
import { mergeCells } from './merge';
import { createHtml } from './test-helper';

import twoByTow from '../../mocks/two-by-two';
import fourByThreeRowspan3 from '../../mocks/four-by-three-rowspan-3';

describe('merge', function() {
  const plugin = EditTable();
  it('merge 0 and 1 in 2X2 table', function() {
    const editor = new Editor({ value: Value.fromJSON(twoByTow), plugins: [plugin] });
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
    const editor = new Editor({ value: Value.fromJSON(twoByTow), plugins: [plugin] });
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
    const editor = new Editor({ value: Value.fromJSON(twoByTow), plugins: [plugin] });
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

  it('merge 2 column at 4X3 rowspan3 table', function() {
    const editor = new Editor({ value: Value.fromJSON(fourByThreeRowspan3), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('0');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    const t = findCurrentTable(editor);
    if (!t) throw new Error('Failed to find block');
    const newEditor = mergeCells(editor, '3', '9');
    if (!newEditor) throw new Error('Failed to find editor');
    expect(newEditor.value.toJSON()).toMatchSnapshot();
    expect(createHtml(newEditor.value)).toMatchSnapshot();

    const table = TableLayout.create(editor);
    if (!table) throw new Error('Failed to split cell');
    expect(table.currentTable.nodes.size).toBe(3);
    const expectLength = [3, 2, 2];
    table.currentTable.nodes.forEach((row, i) => {
      if (!Block.isBlock(row) || typeof i === 'undefined') throw new Error('Failed to split cell');
      expect(row.nodes.size).toBe(expectLength[i]);
    });
  });
});
