import { Range } from 'immutable';
import { Block } from 'slate';
import { createCell } from './create-cell';
import { Option, defaultOptions } from './option';

export function createRow(opts: Option = defaultOptions, columns: number) {
  const cellNodes = Range(0, columns)
    .map(() => createCell(opts, '').toJSON())
    .toArray();

  return Block.fromJSON({
    object: 'block',
    type: opts.typeRow,
    nodes: cellNodes,
  });
}
