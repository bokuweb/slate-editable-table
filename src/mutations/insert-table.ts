import { Editor, Text, Block, BlockJSON } from 'slate';
import { createTable, TableOption } from '../create-table';
import { Option } from '../option';

export function insertTable(opts: Required<Option>, editor: Editor, columns = 2, rows = 2, tableOption?: TableOption) {
  const { value } = editor;

  if (!value.selection.start.key) return false;
  const table = createTable(opts, columns, rows, tableOption);
  const text = {
    object: 'block',
    type: 'paragraph',
    nodes: [Text.create('').toJSON()],
  } as BlockJSON;
  return editor
    .insertBlock(Block.fromJSON(text))
    .moveToStartOfPreviousBlock()
    .insertBlock(Block.fromJSON(text))
    .insertBlock(table);
}
