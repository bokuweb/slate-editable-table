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
            nodes: [
              {
                key: '0',
                object: 'block',
                type: 'table_cell',
                data: {
                  width: '200',
                  rowspan: '2',
                  colspan: '2',
                },
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('0').toJSON()],
                  },
                ],
              },
              {
                key: '1',
                object: 'block',
                type: 'table_cell',
                data: {
                  width: '200',
                },
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('1').toJSON()],
                  },
                ],
              },
            ],
          },
          {
            object: 'block',
            type: 'table_row',
            nodes: [
              {
                key: '2',
                object: 'block',
                type: 'table_cell',
                data: {
                  width: '200',
                },
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('2').toJSON()],
                  },
                ],
              },
            ],
          },
          {
            object: 'block',
            type: 'table_row',
            nodes: [
              {
                key: `6`,
                object: 'block',
                type: 'table_cell',
                data: {
                  width: '200',
                },
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create(`6`).toJSON()],
                  },
                ],
              },
              {
                key: `7`,
                object: 'block',
                type: 'table_cell',
                data: {
                  width: '200',
                },
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create(`7`).toJSON()],
                  },
                ],
              },
              {
                key: `8`,
                object: 'block',
                type: 'table_cell',
                data: {
                  width: '200',
                },
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create(`8`).toJSON()],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
} as ValueJSON;
