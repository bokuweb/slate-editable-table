import { Range } from 'immutable';
import { Block } from 'slate';
import { createRow } from './create-row';
import { Option, defaultOptions } from './option';

export type TableOption = {
  columnWidth: number;
  maxWidth: number;
};

export function createTable(opts: Required<Option>, columns: number, rows: number, tableOptions?: TableOption) {
  const rowNodes = Range(0, rows)
    .map(() => createRow(opts, columns, tableOptions && tableOptions.columnWidth).toJSON())
    .toArray();

  return Block.fromJSON({
    object: 'block',
    type: opts.typeTable,
    nodes: rowNodes,
    data: {
      maxWidth: tableOptions && tableOptions.maxWidth,
    },
  });
}
