import { Block, BlockJSON, Text } from 'slate';
import { Option, defaultOptions } from './option';

export function createCell(opts: Option = defaultOptions, text = ' ', data?: { [k: string]: string }) {
  const { typeCell, typeContent } = opts;
  return Block.fromJSON({
    type: typeCell,
    nodes: [
      {
        object: 'block',
        type: typeContent,
        nodes: [Text.create(text).toJSON()],
      },
    ],
    data: {
      width: opts.defaultColumnWidth,
      ...data,
    },
  } as BlockJSON);
}
