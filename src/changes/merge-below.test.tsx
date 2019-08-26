import { Editor, Value, ValueJSON } from 'slate';
import { EditTable, TableEditor } from '../index';
import value from '../../mocks/two-by-two';
import { createHtml } from './test-helper';

describe('merge-below', function() {
  const plugin = EditTable();
  it('merge below in 2X2 table', function() {
    const editor = new Editor({ value: Value.fromJSON(value as ValueJSON), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('0');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    const actual = (editor as TableEditor).mergeBelow().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();
  });
});