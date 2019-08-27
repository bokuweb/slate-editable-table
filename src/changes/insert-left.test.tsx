import { Editor, Value, Block } from 'slate';
import { EditTable, hasTablePlugin } from '../index';
import { createHtml } from './test-helper';
import { TableLayout } from '../layout';

import twoByTwo from '../../mocks/two-by-two';
import threeByThreeMerged from '../../mocks/three-by-three-colspan-rowspan-2';

describe('insert-left', function() {
  const plugin = EditTable();
  it('insert column at the left end of the table', function() {
    const editor = new Editor({ value: Value.fromJSON(twoByTwo), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('0');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    if (!hasTablePlugin(editor)) return;
    const actual = editor.insertLeft().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();
  });

  it('insert column at the right end of the table', function() {
    const editor = new Editor({ value: Value.fromJSON(twoByTwo), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('1');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    if (!hasTablePlugin(editor)) return;
    const actual = editor.insertLeft().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();
  });

  it('insert column at the left end of the 3x3 table', function() {
    const editor = new Editor({ value: Value.fromJSON(threeByThreeMerged), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('0');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    if (!hasTablePlugin(editor)) return;
    const actual = editor.insertLeft().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();

    const table = TableLayout.create(editor);
    if (!table) throw new Error('Failed to split cell');
    expect(table.currentTable.nodes.size).toBe(3);
    const expectLength = [2, 1, 4];
    table.currentTable.nodes.forEach((row, i) => {
      if (!Block.isBlock(row)) throw new Error('Failed to split cell');
      expect(row.nodes.size).toBe(expectLength[i]);
    });
  });

  it('insert column at the right end of the 3x3 table', function() {
    const editor = new Editor({ value: Value.fromJSON(threeByThreeMerged), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('1');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    if (!hasTablePlugin(editor)) return;
    const actual = editor.insertLeft().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();

    const table = TableLayout.create(editor);
    if (!table) throw new Error('Failed to split cell');
    expect(table.currentTable.nodes.size).toBe(3);
    const expectLength = [3, 2, 4];
    table.currentTable.nodes.forEach((row, i) => {
      if (!Block.isBlock(row)) throw new Error('Failed to split cell');
      expect(row.nodes.size).toBe(expectLength[i]);
    });
  });
});
