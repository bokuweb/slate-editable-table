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
            object: 'block',
            type: 'table_row',
            nodes: [
              {
                object: 'block',
                key: '0',
                type: 'table_cell',
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('0').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                key: '1',
                type: 'table_cell',
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
                object: 'block',
                key: '2',
                type: 'table_cell',
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('2').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                key: '3',
                type: 'table_cell',
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('3').toJSON()],
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
