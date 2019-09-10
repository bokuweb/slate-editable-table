// import * as Immutable from 'immutable';
// import { Block, Editor, Text, Inline } from 'slate';
// import { createCell } from './create-cell';
import { Option } from './option';

export function createSchema(opts: Required<Option>) {
  const schema = {
    blocks: {
      [opts.typeCell]: {
        parent: {
          type: opts.typeRow,
        },
        nodes: [
          {
            match: { object: 'block' },
            min: 1,
          },
        ],
      },
      [opts.typeRow]: {
        parent: { type: opts.typeTable },
        nodes: [
          {
            match: { object: 'block', type: opts.typeCell },
            min: 1,
          },
        ],
      },
      [opts.typeTable]: {
        nodes: [
          {
            match: { object: 'block', type: opts.typeRow },
            min: 1,
          },
        ],
      },
    },
  };

  /*
  const isRow = (node: Block | Text | Inline) => Block.isBlock(node) && node.type === opts.typeRow;
  const isCell = (node: Block) => node.type === opts.typeCell;
  const countCells = (row: Block) =>
    row.nodes.toArray().reduce((acc: number, cell: Block | Text | Inline) => {
      return Block.isBlock(cell) ? acc + (Number(cell.data.get('colspan')) || 1) : acc;
    }, 0);
  const normalizeNode = (node: Block, editor: Editor, next: () => any) => {
    if (node.object != 'block') return next();
    if (node.type !== opts.typeTable) return next();

    const table = node as Block;
    const rows = table.nodes.filter(n => !!n && isRow(n));

    // The number of column this table has
    const columns = rows.reduce((count: number, row) => {
      return Math.max(count, countCells(row));
    }, 1); // Min 1 column

    const invalidRows = rows
      .map(row => {
        const cells = countCells(row);
        const invalids = row.nodes.filterNot(isCell);

        if (invalids.isEmpty() && cells === columns) {
          return null;
        }

        // Otherwise, remove the invalids and append the missing cells
        return {
          row,
          invalids,
          add: columns - cells,
        };
      })
      .filter(Boolean);

    if (invalidRows.size === 0) return next();
    return next();
    return editor =>
      invalidRows.reduce((tr, { row, invalids, add }) => {
        tr = invalids.reduce((t, child) => {
          return t.removeNodeByKey(child.key);
        }, tr);

        tr = Immutable.Range(0, add).reduce(t => {
          const cell = createCell(opts);
          return t.insertNodeByKey(row.key, 0, cell);
        }, tr);

        return tr;
      }, editor);
  };
*/
  return { schema };
}
