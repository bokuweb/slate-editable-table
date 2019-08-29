import { Editor, Value, Block } from 'slate';
import { EditTable, hasTablePlugin } from '../index';
import { createHtml } from './test-helper';
import { TableLayout } from '../layout';

import twoByTwo from '../../mocks/two-by-two';
import fourByFourMerged from '../../mocks/four-by-four-rowspan-3-and-colspan4';

describe('insert-below', function() {
  const plugin = EditTable();
  it('insert row to top of 2X2 table', function() {
    const editor = new Editor({ value: Value.fromJSON(twoByTwo), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('0');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    if (!hasTablePlugin(editor)) return;
    const actual = editor.insertBelow().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();
  });

  it('insert row to bottom of 2X2 table', function() {
    const editor = new Editor({ value: Value.fromJSON(twoByTwo), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('2');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    if (!hasTablePlugin(editor)) return;
    const actual = editor.insertBelow().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();
  });

  it('insert row at the top of the 4x4 table', function() {
    const editor = new Editor({ value: Value.fromJSON(fourByFourMerged), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('0');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    if (!hasTablePlugin(editor)) return;
    const actual = editor.insertBelow().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();

    const table = TableLayout.create(editor);
    if (!table) throw new Error('Failed to split cell');
    expect(table.currentTable.nodes.size).toBe(5);
    const expectLength = [1, 4, 4, 3, 3];
    table.currentTable.nodes.forEach((row, i) => {
      if (!Block.isBlock(row) || typeof i === 'undefined') throw new Error('Failed to split cell');
      expect(row.nodes.size).toBe(expectLength[i]);
    });
  });

  it('insert row at the bottom of the 4x4 table', function() {
    const editor = new Editor({ value: Value.fromJSON(fourByFourMerged), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('8');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    if (!hasTablePlugin(editor)) return;
    const actual = editor.insertBelow().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();

    const table = TableLayout.create(editor);
    if (!table) throw new Error('Failed to split cell');
    expect(table.currentTable.nodes.size).toBe(5);
    const expectLength = [1, 4, 3, 3, 4];
    table.currentTable.nodes.forEach((row, i) => {
      if (!Block.isBlock(row) || typeof i === 'undefined') throw new Error('Failed to split cell');
      expect(row.nodes.size).toBe(expectLength[i]);
    });
  });
});
