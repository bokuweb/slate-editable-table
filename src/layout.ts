import { Block, Node, Text, Inline } from 'slate';
import { Editor } from 'slate';
import { List } from 'immutable';

import { defaultOptions, Option } from './option';

type CellPosition = {
  row: number;
  col: number;
};

export type Cell = {
  key: string;
  rowKey: string;
  colspan: number;
  rowspan: number;
  block: Block;
  rowBlock: Block;
  nodeIndex: number;
  isLeftOfMergedCell: boolean;
  isTopOfMergedCell: boolean;
} & CellPosition;

export interface CellDict {
  [key: string]: Cell;
}

export type Layout = Cell[][];

// INFO: Deprecated.
//       Use createLayout and create new function to create cell's Dictionary
function buildTableLayout(nodes: List<Block>) {
  const layout = createLayout(nodes);
  const keyDict = layout.reduce(
    (acc, row) => {
      row.forEach(cell => {
        if (acc[cell.key]) return;
        acc[cell.key] = cell;
      });
      return acc;
    },
    {} as CellDict,
  );
  return { layout, keyDict };
}

// Deprecated
export class TableLayout {
  table: Cell[][] = [];
  keyDict: CellDict;
  currentTable: Block;
  row: Block;
  cell: Block;

  constructor(TableLayout: Cell[][], dict: CellDict, table: Block, row: Block, cell: Block) {
    this.table = TableLayout;
    this.keyDict = dict;
    this.currentTable = table;
    this.row = row;
    this.cell = cell;
  }

  get col() {
    return this.table[0].length;
  }

  get firstRow() {
    return this.table[0];
  }

  get firstColumn() {
    return this.table.map(row => {
      return row[0];
    });
  }

  get lastRow(): Cell[] {
    return this.table[this.table.length - 1];
  }

  get lastColumn() {
    return this.table.map(row => {
      return row[row.length - 1];
    });
  }

  get rowIndex() {
    const { currentTable, row } = this;
    const rows = currentTable.nodes;
    return rows.findIndex(x => x === row);
  }

  get width() {
    const { table } = this;
    return table[0].length;
  }

  get height() {
    const { currentTable } = this;
    const rows = currentTable.nodes;

    return rows.size;
  }

  get columnIndex() {
    const { row, cell } = this;
    const cells = row.nodes;
    const r = cells.reduce(
      (acc = { has: false, pos: 0, prevColspan: 0 }, x: Block | Text | Inline | undefined) => {
        if (!Block.isBlock(x)) return acc;
        const colspan = Number(x.data.get('colspan') || 1);
        const pos = acc.has ? acc.pos : acc.pos + acc.prevColspan;
        return {
          has: acc.has || x === cell,
          pos,
          prevColspan: colspan,
        };
      },
      { has: false, pos: 0, prevColspan: 0 } as { has: boolean; pos: number; prevColspan: number },
    );
    return r.has ? r.pos : -1;
  }

  isTopOfMergedCell() {}

  findCellBy(key: string): Cell | undefined {
    for (let row of this.table) {
      for (let cell of row) {
        if (cell.key === key) return cell;
      }
    }
  }

  findNextRowKey(): string | undefined {
    const next = this.table[this.rowIndex + 1];
    return next[0].rowKey;
  }

  filterHorizontalMergedCellsBy(columnIndex: number): Cell[] {
    const cells: Cell[] = [];
    this.table.forEach(row => {
      const cell = row[columnIndex];
      if (cell.colspan > 1) {
        cells.push(cell);
      }
    });

    return cells;
  }

  filterVerticalMergedCellsBy(rowIndex: number): Cell[] {
    return this.table[rowIndex].filter(cell => cell.rowspan > 1);
  }

  getRows(rowIndex: number): Cell[] {
    return this.table[rowIndex];
  }

  findBelow(key: string): Cell | undefined {
    const cell = this.findCellBy(key);
    if (!cell) return;
    let y = 0;
    let t = this.table[cell.row][cell.col];
    while (t && t.key === key) {
      y++;
      if (!this.table[cell.row + y] || !this.table[cell.row + y][cell.col]) return;
      t = this.table[cell.row + y][cell.col];
    }
    return t;
  }

  getNextRowSize(key: string): number {
    const cell = this.findCellBy(key);
    if (!cell) return 0;
    let y = 0;
    let l = 0;
    let t = this.table[cell.row][cell.col];
    while (t && t.key === key) {
      y++;
      l = this.table[cell.row + y].length;
      t = this.table[cell.row + y][cell.col];
    }
    return l;
  }

  getRight(key: string) {
    const cell = this.findCellBy(key);
    if (!cell) return;
    let x = 0;
    let t = this.table[cell.row][cell.col + x];
    while (t && t.key === key) {
      x++;
      t = this.table[cell.row][cell.col + x];
    }
    return t;
  }

  isLastColumn(key: string): boolean {
    return this.lastColumn.some(c => c.key === key);
  }

  isLastRow(key: string): boolean {
    return this.lastRow.some(r => r.key === key);
  }

  static create(editor: Editor, opts: Required<Option>) {
    if (!editor) return null;
    const table = findCurrentTable(editor, opts);
    if (!table) return null;
    const nodes = table && ((table as any).getNode(table.key).nodes as List<Block>);
    if (!nodes) return null;
    const { layout, keyDict } = buildTableLayout(nodes);

    const currentCell = TableLayout.currentCell(editor, opts);
    const currentRow = TableLayout.currentRow(editor, opts);
    const currentTable = TableLayout.currentTable(editor, opts);

    if (!currentCell) return null;

    return new TableLayout(layout, keyDict, currentTable, currentRow, currentCell);
  }

  static currentCell(editor: Editor, opts: Required<Option>) {
    return findStartCell(editor, opts);
  }

  static findBlock(editor: Editor, type: string) {
    const { value } = editor;
    return value.document.getClosest(value.startBlock.key, p => {
      if (!Block.isBlock(p)) return false;
      return p.type === type;
    }) as Block;
  }

  static findRowBlock(editor: Editor, index: number, opts: Required<Option>): Block | undefined {
    const table = TableLayout.currentTable(editor, opts);
    if (!table) return;
    const block = table.nodes.get(index);
    return Block.isBlock(block) ? block : undefined;
  }

  static currentRow(editor: Editor, opts: Required<Option>) {
    return TableLayout.findBlock(editor, opts.typeRow);
  }

  static currentTable(editor: Editor, opts: Required<Option>) {
    return TableLayout.findBlock(editor, opts.typeTable);
  }

  static isInCell(editor: Editor, opts = defaultOptions) {
    const { value } = editor;
    const { startBlock } = value;
    return startBlock.type === opts.typeCell ||
      value.document.getClosest(startBlock.key, p => {
        if (!Block.isBlock(p)) return false;
        return p.type === opts.typeCell;
      })
      ? true
      : false;
  }
}
export function findCurrentTable(editor: Editor, opts = defaultOptions): Block | null {
  if (!editor) return null;
  const { value } = editor;
  const { startBlock } = value;
  if (!startBlock) return null;
  const table = value.document.getClosest(startBlock.key, (p: Node) => (p as any).type === opts.typeTable);
  if (!table) return null;
  if (!Block.isBlock(table)) return null;
  return table;
}

export function findCurrentRow(editor: Editor, opts = defaultOptions): Block | null {
  const { value } = editor;
  return (
    (value.document.getClosest(value.startBlock.key, p => {
      if (!Block.isBlock(p)) return false;
      return p.type === opts.typeRow;
    }) as Block) || null
  );
}

export function findBlock(editor: Editor, type: string): Block | null {
  const { value } = editor;
  const b = value.document.getClosest(value.startBlock.key, p => {
    if (!Block.isBlock(p)) return false;
    return p.type === type;
  }) as Block;
  return b ? b : null;
}

// INFO: We can not get expected block with Value.focusBlock.
//       We need to do some investigation about it.
//       For now find focus cell with window.getSelection.
export function findFocusCell(editor: Editor, opts = defaultOptions): Block | null {
  const selection = window.getSelection();
  if (!selection) return null;
  const focused = selection.focusNode as HTMLElement;
  if (!focused) return null;
  return findCellBlockByElement(editor, focused, opts);
}

// INFO: We can not get expected block with Value.anchorBlock.
//       We need to do some investigation about it.
//       For now find anchor cell with window.getSelection.
export function findAnchorCell(editor: Editor, opts: Required<Option>): Block | null {
  const selection = window.getSelection();
  if (!selection) return null;
  const anchored = selection.anchorNode as HTMLElement;
  if (!anchored) return null;
  return findCellBlockByElement(editor, anchored, opts);
}

export function findStartCell(editor: Editor, opts: Required<Option>): Block | null {
  const { startBlock } = editor.value;
  return startBlock.type === opts.typeCell ? startBlock : TableLayout.findBlock(editor, opts.typeCell);
}

export function findClosestKey(el: HTMLElement): string | null {
  if (el.dataset && el.dataset.key) {
    return el.dataset.key;
  }
  if (!el.parentElement) {
    return null;
  }
  return findClosestKey(el.parentElement);
}

export function findCellBlockByElement(editor: Editor, el: HTMLElement, opts = defaultOptions): Block | null {
  const { value } = editor;
  const key = findClosestKey(el);
  if (!key) {
    return null;
  }
  return value.document.getClosest(key, p => {
    if (!Block.isBlock(p)) return false;
    return p.type === opts.typeCell;
  }) as Block;
}

export function findLeftTopPosition(anchor: Cell, focus: Cell) {
  return [Math.min(anchor.row, focus.row), Math.min(anchor.col, focus.col)];
}

export function createSelectedCellRange(anchor: Cell, focus: Cell): { start: CellPosition; end: CellPosition } {
  const start = {
    row: Math.min(anchor.row, focus.row),
    col: Math.min(anchor.col, focus.col),
  };
  const end = {
    row: Math.max(anchor.row, focus.row),
    col: Math.max(anchor.col, focus.col),
  };
  return { start, end };
}

export function calculateSelectedCellSize(anchor: Cell, focus: Cell): { width: number; height: number } {
  const height = Math.abs(anchor.row - focus.row) + (anchor.row < focus.row ? focus.rowspan : anchor.rowspan);
  const width = Math.abs(anchor.col - focus.col) + (anchor.col < focus.col ? focus.colspan : anchor.colspan);
  return { width, height };
}

export function createSelectedBlockMap(
  editor: Editor,
  anchorKey: string,
  focusKey: string,
  opts: Required<Option>,
): { [key: string]: Cell } {
  const t = TableLayout.create(editor, opts);
  if (!t) return {};
  const anchor = t.keyDict[anchorKey];
  const focus = t.keyDict[focusKey];
  if (!anchor || !focus) return {};
  const { start, end } = createSelectedCellRange(anchor, focus);
  return t.table.reduce(
    (acc, row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (rowIndex >= start.row && rowIndex <= end.row && columnIndex >= start.col && columnIndex <= end.col) {
          acc[cell.key] = cell;
        }
      });
      return acc;
    },
    {} as { [key: string]: Cell },
  );
}

export function getRowIndex(editor: Editor, opts: Required<Option>): number | null {
  const t = findCurrentTable(editor, opts);
  const row = findCurrentRow(editor, opts);
  if (!t) return null;
  const rows = t.nodes;
  const i = rows.findIndex(x => x === row);
  if (i < 0) return null;
  return i;
}

export function collectSelectionBlocks(
  editor: Editor,
  anchorKey: string,
  focusKey: string,
  opts: Required<Option>,
): Cell[][] {
  const t = TableLayout.create(editor, opts);
  if (!t) return [];
  const anchor = t.keyDict[anchorKey];
  const focus = t.keyDict[focusKey];
  const { start, end } = createSelectedCellRange(anchor, focus);
  return t.table
    .map((row, rowIndex) => {
      const newRow = row.filter((cell, columnIndex) => {
        return rowIndex >= start.row && rowIndex <= end.row && columnIndex >= start.col && columnIndex <= end.col;
      });
      return newRow.length ? newRow : null;
    })
    .filter(notNull);
}

export function createLayout(rows: List<Block | Text | Inline>): Layout {
  const rowLength = rows.size;
  const colLength = Math.max(
    ...Array.from(
      rows.map(node => {
        if (!Block.isBlock(node)) return 0;
        return node.nodes.reduce((acc: number = 0, n: Block | Text | Inline | undefined) => {
          if (!Block.isBlock(n)) return acc;
          return acc + ((n.data && Number(n.data.get('colspan'))) || 1);
        }, 0);
      }),
    ),
  );

  const layout: Layout = [];
  for (let row = 0, cellY = 0; row < rowLength; row++, cellY++) {
    let nodeIndex = 0;
    let cellX = 0;
    for (let col = 0; col < colLength; col++) {
      if (layout[row] && layout[row][col]) {
        continue;
      }
      if (!layout[row]) {
        layout[row] = [];
      }
      const rowBlock = rows.get(cellY);
      if (!Block.isBlock(rowBlock)) continue;
      const cell = rowBlock && ((rowBlock as Block).nodes.get(nodeIndex) as Block);
      const rowKey = rowBlock.key;
      if (!cell) {
        throw new Error('[slate-editable-table-plugin]: Should cell exist');
      }
      const key = cell.key as string;
      const colspan = Number((cell && cell.data.get('colspan')) || 1);
      const rowspan = Number((cell && cell.data.get('rowspan')) || 1);
      layout[row][col] = {
        key,
        row,
        col,
        colspan,
        rowspan,
        block: cell,
        rowKey,
        rowBlock,
        nodeIndex,
        isLeftOfMergedCell: cellX === 0,
        isTopOfMergedCell: rowspan > 1,
      };
      if (rowspan > 1) {
        for (let r = 0; r < rowspan - 1; r++) {
          if (!layout[row + r + 1]) {
            layout[row + r + 1] = [];
          }
          layout[row + r + 1][col] = {
            key,
            row: row + r + 1,
            col,
            colspan,
            rowspan,
            block: cell,
            rowKey,
            nodeIndex,
            rowBlock: rowBlock,
            isLeftOfMergedCell: cellX === 0,
            isTopOfMergedCell: false,
          };
        }
      }
      if (cellX === colspan - 1) {
        cellX = 0;
        nodeIndex++;
      } else {
        cellX++;
      }
    }
  }
  return layout;
}

function notNull<T>(item: T | null): item is T {
  return item !== null;
}
