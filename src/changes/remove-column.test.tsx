import { Editor, Value, ValueJSON } from 'slate';
import { EditTable, hasTablePlugin } from '../index';
import value from '../../mocks/two-by-two';
import { createHtml } from './test-helper';

describe('remove-column', function() {
  const plugin = EditTable();
  it('remove column in 2X2 table', function() {
    const editor = new Editor({ value: Value.fromJSON(value as ValueJSON), plugins: [plugin] });
    const cursorBlock = editor.value.document.getDescendant('0');
    if (!cursorBlock) throw new Error('Failed to find block');
    editor.moveTo(cursorBlock.key);
    if (!hasTablePlugin(editor)) return;
    const actual = editor.removeColumn().value;
    expect(actual.toJSON()).toMatchSnapshot();
    expect(createHtml(actual)).toMatchSnapshot();
  });
});
