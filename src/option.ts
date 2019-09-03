import * as React from 'react';

export type Option = {
  typeCell?: string;
  typeRow?: string;
  typeTable?: string;
  typeContent?: string;
  selectionColor?: string;
  cellStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
  defaultColumnWidth?: number;
};

export const defaultOptions: Option = {
  typeCell: 'table_cell',
  typeRow: 'table_row',
  typeTable: 'table',
  typeContent: 'table_content',
  selectionColor: '#B9D3FC',
  cellStyle: { padding: '4px' },
  rowStyle: {},
  tableStyle: {},
  defaultColumnWidth: 15,
};
