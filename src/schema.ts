import { Option } from './option';

export function createSchema(opts: Required<Option>) {
  const schema = {
    blocks: {
      [opts.typeCell]: {
        parent: {
          type: opts.typeRow,
        },
        nodes: [
          {
            match: { object: 'block' },
            min: 1,
          },
        ],
      },
      [opts.typeRow]: {
        parent: { type: opts.typeTable },
        nodes: [
          {
            match: { object: 'block', type: opts.typeCell },
            min: 1,
          },
        ],
      },
      [opts.typeTable]: {
        nodes: [
          {
            match: { object: 'block', type: opts.typeRow },
            min: 1,
          },
        ],
      },
    },
  };
  return { schema };
}
