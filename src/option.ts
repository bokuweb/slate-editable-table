import * as React from 'react';

export type Option = {
  typeCell?: string;
  typeRow?: string;
  typeTable?: string;
  typeContent?: string;
  selectionColor?: string;
  minimumCellWidth?: number;
  cellStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
  defaultColumnWidth?: number;
};

export const defaultOptions: Required<Option> = {
  typeCell: 'table_cell',
  typeRow: 'table_row',
  typeTable: 'table',
  typeContent: 'table_content',
  selectionColor: '#B9D3FC',
  minimumCellWidth: 32,
  cellStyle: { padding: '3px' },
  rowStyle: {},
  tableStyle: {},
  defaultColumnWidth: 15,
};
