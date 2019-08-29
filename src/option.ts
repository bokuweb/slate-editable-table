export type Option = {
  typeCell?: string;
  typeRow?: string;
  typeTable?: string;
  typeContent?: string;
  selectionColor?: string;
};

export const defaultOptions = {
  typeCell: 'table_cell',
  typeRow: 'table_row',
  typeTable: 'table',
  typeContent: 'table_content',
  selectionColor: '#B9D3FC',
};
