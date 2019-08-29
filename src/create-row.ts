import { Range } from 'immutable';
import { Block } from 'slate';
import { createCell } from './create-cell';
import { Option, defaultOptions } from './option';

export function createRow(opts: Required<Option> = defaultOptions, columns: number, cellWidth: number = 120) {
  const cellNodes = Range(0, columns)
    .map(() => createCell(opts, ' ', { width: `${cellWidth}` }).toJSON())
    .toArray();
  return Block.fromJSON({
    object: 'block',
    type: opts.typeRow,
    nodes: cellNodes,
    data: {},
  });
}
