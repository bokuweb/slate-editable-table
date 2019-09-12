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
                data: {
                  width: '200',
                },
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
                data: {
                  width: '200',
                },
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
                data: {
                  width: '200',
                },
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
                data: {
                  width: '200',
                },
                type: 'table_cell',
                nodes: [
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
                            key: '4',
                            data: {
                              width: '100',
                            },
                            type: 'table_cell',
                            nodes: [
                              {
                                object: 'block',
                                type: 'table_content',
                                nodes: [Text.create('4').toJSON()],
                              },
                            ],
                          },
                          {
                            object: 'block',
                            key: '5',
                            data: {
                              width: '100',
                            },
                            type: 'table_cell',
                            nodes: [
                              {
                                object: 'block',
                                type: 'table_content',
                                nodes: [Text.create('5').toJSON()],
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
                            key: '6',
                            data: {
                              width: '100',
                            },
                            type: 'table_cell',
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
                            key: '7',
                            data: {
                              width: '100',
                            },
                            type: 'table_cell',
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
                    ],
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
