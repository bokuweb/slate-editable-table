import { Range } from 'immutable';
import { Block } from 'slate';
import { createCell } from './create-cell';
import { Option } from './option';

export function createRow(opts: Required<Option>, columns: number, columnWidth: number = opts.defaultColumnWidth) {
  const cellNodes = Range(0, columns)
    .map(() => createCell(opts, '', { width: `${columnWidth}` }).toJSON())
    .toArray();
  return Block.fromJSON({
    object: 'block',
    type: opts.typeRow,
    nodes: cellNodes,
    data: {},
  });
}
