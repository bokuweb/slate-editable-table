import { Text, ValueJSON } from 'slate';

export default {
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [Text.create('Lorem ipsum....').toJSON()],
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
                type: 'table_cell',
                data: {
                  colspan: '4',
                },
                key: '0',
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('0').toJSON()],
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
                type: 'table_cell',
                key: '1',
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
              {
                object: 'block',
                type: 'table_cell',
                key: '2',
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
              {
                object: 'block',
                type: 'table_cell',
                key: '3',
                data: {
                  width: '200',
                },
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('3').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                type: 'table_cell',
                key: '4',
                data: {
                  rowspan: 3,
                  width: '200',
                },
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('4').toJSON()],
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
                type: 'table_cell',
                key: '5',
                data: {},
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('5').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                type: 'table_cell',
                key: '6',
                data: {},
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('6').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                type: 'table_cell',
                key: '7',
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('7').toJSON()],
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
                type: 'table_cell',
                key: '8',
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('8').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                type: 'table_cell',
                key: '9',
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('9').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                type: 'table_cell',
                key: '10',
                nodes: [
                  {
                    object: 'block',
                    type: 'table_content',
                    nodes: [Text.create('10').toJSON()],
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
