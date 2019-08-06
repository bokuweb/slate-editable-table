import { Range } from 'immutable';
import { Block } from 'slate';
import { createRow } from './create-row';
import { Option, defaultOptions } from './option';

export function createTable(opts: Option = defaultOptions, columns: number, rows: number) {
  const rowNodes = Range(0, rows)
    .map(() => createRow(opts, columns).toJSON())
    .toArray();

  return Block.fromJSON({
    object: 'block',
    type: opts.typeTable,
    nodes: rowNodes,
    data: {},
  });
}
