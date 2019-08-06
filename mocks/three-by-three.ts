import { Text, ValueJSON } from 'slate';

export default {
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [Text.create('Lorem ipsum ...').toJSON()],
      },
      {
        object: 'block',
        type: 'table',
        nodes: [
          {
            key: '_cursor_',
            object: 'block',
            type: 'table_row',
            nodes: [...Array(3).keys()].map(i => {
              return {
                key: `${i}`,
                object: 'block',
                type: 'table_cell',
                data: {
                  width: '200',
                },
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create(`${i}`).toJSON()],
                  },
                ],
              };
            }),
          },
          {
            object: 'block',
            type: 'table_row',
            nodes: [...Array(3).keys()].map(i => {
              return {
                key: `${i + 3}`,
                object: 'block',
                type: 'table_cell',
                data: {
                  width: '200',
                },
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create(`${i + 3}`).toJSON()],
                  },
                ],
              };
            }),
          },
          {
            object: 'block',
            type: 'table_row',
            nodes: [...Array(3).keys()].map(i => {
              return {
                key: `${i + 6}`,
                object: 'block',
                type: 'table_cell',
                data: {
                  width: '200',
                },
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create(`${i + 6}`).toJSON()],
                  },
                ],
              };
            }),
          },
        ],
      },
    ],
  },
} as ValueJSON;
