import { Editor, Value, ValueJSON } from 'slate';
import { EditTable, TableEditor } from '../index';
import value from '../../mocks/two-by-two';
import { createHtml } from './test-helper';

describe('insert-row', function() {
  const plugin = EditTable();
  it('insert row to 2X2 table', function() {
    const editor = new Editor({ value: Value.fromJSON(value as ValueJSON), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('0');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    const actual = (editor as TableEditor).insertRow().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();
  });
});
