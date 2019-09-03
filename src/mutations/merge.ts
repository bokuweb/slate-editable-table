import { Editor, Text, Block, Inline } from 'slate';

import {
  TableLayout,
  findLeftTopPosition,
  calculateSelectedCellSize,
  collectSelectionBlocks,
  createSelectedBlockMap,
  Cell,
} from '../layout';
import { Option } from '../option';
import { removeSelection } from '../selection';

export function mergeCells(editor: Editor, anchorKey: string, focusKey: string, opts: Required<Option>) {
  const table = TableLayout.create(editor);
  if (!table) return;
  const anchorCell = table.findCellBy(anchorKey);
  const focusCell = table.findCellBy(focusKey);

  if (!anchorCell || !focusCell) return;
  const size = calculateSelectedCellSize(anchorCell, focusCell);

  const [row, col] = findLeftTopPosition(anchorCell, focusCell);
  const leftTopCell = table.table[row][col];
  if (!canMerge(editor, anchorCell.key, focusCell.key, opts)) {
    return editor;
  }

  // INFO: Count deleted row number
  //       We use it to calculate rowspan
  let deletedRowNumber = 0;

  // INFO: To store content blocks in loop and insertBlock later.
  //       This is because it does not work properly when insertBlock in loop..
  //       I'll do some investigation later... :sob:
  editor.withoutNormalizing(() => {
    const blocks = createSelectedBlockMap(editor, anchorCell.key, focusCell.key);
    const contentNodes: Block[] = [];
    let firstRow: number | null = null;
    let newWidth = 0;
    table.table.forEach(row => {
      row.forEach(cell => {
        if (!blocks[cell.key]) return;
        // calculate new width
        const n = editor.value.document.getNode(cell.key);
        if (Block.isBlock(n)) {
          if (firstRow === null) {
            firstRow = cell.row;
          }
          // Calculate only first row.
          if (firstRow === cell.row) {
            newWidth = newWidth + ~~cell.block.data.get('width') / (cell.block.data.get('colspan') || 1);
          }
        }

        if (cell.key === leftTopCell.key) return;
        // INFO: Collect all content and remove cells
        cell.block.nodes.forEach((content: Block | Inline | Text | undefined, i) => {
          const newLeftTopCell = editor.value.document.getNode(leftTopCell.key);
          if (!Block.isBlock(newLeftTopCell) || !Block.isBlock(content)) return;
          const tempContent = editor.value.document.getNode(content.key);
          const newContentBlock = tempContent && tempContent.regenerateKey();
          if (!Block.isBlock(newContentBlock)) return;
          contentNodes.push(newContentBlock);
          if (i != cell.block.nodes.size - 1) return;
          editor = editor.removeNodeByKey(cell.key);
        });

        // INFO: Remove unnecessary row.
        // After removing some cells, If row is empty delete row and reduce related cell's rowspan.
        const newRow = editor.value.document.getNode(cell.rowBlock.key);
        if (!Block.isBlock(newRow)) return;
        if ((newRow.nodes.size === 1 && Text.isText(newRow.nodes.get(0))) || newRow.nodes.size === 0) {
          deletedRowNumber++;
          editor = editor.removeNodeByKey(newRow.key);
          row.forEach(cell => {
            if (cell.rowspan === 1) return;
            const newCell = editor.value.document.getNode(cell.key);
            if (Block.isBlock(newCell)) {
              editor.setNodeByKey(newCell.key, {
                type: newCell.type,
                data: { ...newCell.data.toObject(), rowspan: String(cell.rowspan - deletedRowNumber) },
              });
            }
          });
        }
      });
    });
    // INFO: Set merged cell's rowspan and colspan
    editor = editor.setNodeByKey(leftTopCell.key, {
      type: leftTopCell.block.type,
      data: {
        ...leftTopCell.block.data.toObject(),
        width: String(newWidth),
        colspan: String(size.width),
        rowspan: String(size.height - deletedRowNumber),
      },
    });

    // INFO: Insert contents to merged cell.
    contentNodes.forEach(node => {
      const newLeftTopCell = editor.value.document.getNode(leftTopCell.key);
      if (Block.isBlock(newLeftTopCell)) {
        editor = editor.moveToEndOfNode(newLeftTopCell).insertBlock(node);
      }
    });
    removeSelection(editor);
  });
  return editor;
}

function isValidHeight(selectedBlocks: Cell[][]) {
  const stored: { [k: string]: boolean } = {};
  const verticalLayout = selectedBlocks.reduce(
    (acc, row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (stored[cell.key + cell.col]) return;
        if (rowIndex === 0) {
          acc[colIndex] = { y: cell.row, height: cell.rowspan };
        } else {
          acc[colIndex] = { ...acc[colIndex], height: ((acc[colIndex] && acc[colIndex].height) || 0) + cell.rowspan };
        }
        stored[cell.key + cell.col] = true;
      });
      return acc;
    },
    {} as { [key: string]: { y: number; height: number } },
  );
  const { isHeightValid } = Object.keys(verticalLayout).reduce(
    (acc, key, i) => {
      if (!acc.isHeightValid) return { isHeightValid: false, prev: verticalLayout[key] };
      if (i === 0) return { isHeightValid: true, prev: verticalLayout[key] };
      if (acc.prev.y === verticalLayout[key].y && acc.prev.height === verticalLayout[key].height) return acc;
      return { isHeightValid: false, prev: verticalLayout[key] };
    },
    { isHeightValid: true, prev: {} as { y: number; height: number } },
  );
  return isHeightValid;
}

export function canMerge(editor: Editor, anchorKey: string, focusKey: string, opts: Required<Option>) {
  const selectedBlocks = collectSelectionBlocks(editor, anchorKey, focusKey, opts);
  const a = selectedBlocks.map(row => {
    const x = row[0].col;
    const { width } = row.reduce(
      (acc, cell) => {
        if (acc.stored[cell.key]) return acc;
        return { width: acc.width + cell.colspan, stored: { ...acc.stored, [cell.key]: true } };
      },
      { width: 0, stored: {} as { [k: string]: boolean } },
    );
    return { x, width };
  });
  const isWidthValid = a.every((c, _, arr) => c.x === arr[0].x && c.width === arr[0].width);

  if (!isWidthValid) return false;
  return isValidHeight(selectedBlocks);
}
