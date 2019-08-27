import { Editor, Value, ValueJSON, Block } from 'slate';
import { EditTable, hasTablePlugin } from '../index';
import { createHtml } from './test-helper';
import { TableLayout } from '../layout';

import mock1 from '../../mocks/three-by-three-colspan-rowspan-2';
import mock2 from '../../mocks/four-by-three-rowspan-3';

describe('split-cell', function() {
  const plugin = EditTable();
  it('split 2X2 cell at 3x3 table', function() {
    const editor = new Editor({ value: Value.fromJSON(mock1), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('0');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    if (!hasTablePlugin(editor)) return;
    const actual = editor.splitCell().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();
    const table = TableLayout.create(editor);
    if (!table) throw new Error('Failed to split cell');
    expect(table.currentTable.nodes.size).toBe(3);
    table.currentTable.nodes.forEach(row => {
      if (!Block.isBlock(row)) throw new Error('Failed to split cell');
      expect(row.nodes.size).toBe(3);
    });
  });

  it('split 1x3 cell at 3x4 table', function() {
    const editor = new Editor({ value: Value.fromJSON(mock2), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('3');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    if (!hasTablePlugin(editor)) return;
    const actual = editor.splitCell().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();
    const table = TableLayout.create(editor);
    if (!table) throw new Error('Failed to split cell');
    expect(table.currentTable.nodes.size).toBe(3);
    table.currentTable.nodes.forEach(row => {
      if (!Block.isBlock(row)) throw new Error('Failed to split cell');
      expect(row.nodes.size).toBe(4);
    });
  });
});
