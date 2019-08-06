import { Text, ValueJSON } from 'slate';

export default {
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          Text.create(
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
          ).toJSON(),
        ],
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
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create('0').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                type: 'table_cell',
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create('1').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                type: 'table_cell',
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create('2').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                type: 'table_cell',
                data: {
                  rowspan: 3,
                },
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create('3').toJSON()],
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
                data: {},
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create('4').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                type: 'table_cell',
                data: {},
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create('5').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                type: 'table_cell',
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create('6').toJSON()],
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
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create('7').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                type: 'table_cell',
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create('8').toJSON()],
                  },
                ],
              },
              {
                object: 'block',
                type: 'table_cell',
                nodes: [
                  {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [Text.create('9').toJSON()],
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
