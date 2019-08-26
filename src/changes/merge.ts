import { Editor, Text, Block, Inline } from 'slate';

import {
  TableMap,
  findLeftTopPosition,
  calculateSelectedCellSize,
  collectSelectionBlocks,
  createSelectedBlockMap,
} from '../table-map';
import { Option, defaultOptions } from '../option';
import { removeSelection } from '../selection';

export function mergeCells(editor: Editor, anchorKey: string, focusKey: string, opts: Option = defaultOptions) {
  const table = TableMap.create(editor);
  if (!table) return;
  const anchorCell = table.findCellBy(anchorKey);
  const focusCell = table.findCellBy(focusKey);

  if (!anchorCell || !focusCell) return;
  const size = calculateSelectedCellSize(anchorCell, focusCell);

  const [row, col] = findLeftTopPosition(anchorCell, focusCell);
  const leftTopCell = table.table[row][col];

  if (!canMerge(editor, anchorCell.key, focusCell.key, opts)) {
    return;
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
    table.table.forEach(row => {
      row.forEach(cell => {
        if (!blocks[cell.key]) return;
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
          editor.removeNodeByKey(cell.key);
        });

        // INFO: Remove unnecessary row.
        // After removing some cells, If row is empty delete row and reduce related cell's rowspan.
        const newRow = editor.value.document.getNode(cell.rowBlock.key);
        if (!Block.isBlock(newRow)) return;
        if (newRow.nodes.size === 1 && Text.isText(newRow.nodes.get(0))) {
          deletedRowNumber++;
          editor.removeNodeByKey(newRow.key);
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
    editor.setNodeByKey(leftTopCell.key, {
      type: leftTopCell.block.type,
      data: {
        ...leftTopCell.block.data.toObject(),
        colspan: String(size.width),
        rowspan: String(size.height - deletedRowNumber),
      },
    });

    // INFO: Insert contents to merged cell.
    contentNodes.forEach(node => {
      const newLeftTopCell = editor.value.document.getNode(leftTopCell.key);
      if (Block.isBlock(newLeftTopCell)) {
        editor.moveToEndOfNode(newLeftTopCell).insertBlock(node);
      }
    });

    removeSelection(editor);
  });
  return editor;
}

export function canMerge(editor: Editor, anchorKey: string, focusKey: string, opts: Option) {
  const selectedBlocks = collectSelectionBlocks(editor, anchorKey, focusKey, opts);
  const isWidthValid = selectedBlocks
    .map(row => {
      const x = row[0].col;
      const width = row.reduce((acc, cell) => {
        return acc + cell.colspan;
      }, 0);
      return { x, width };
    })
    .every((c, _, arr) => c.x === arr[0].x && c.width === arr[0].width);

  const verticalLayout = selectedBlocks.reduce(
    (acc, row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (rowIndex === 0) {
          acc[colIndex] = { y: cell.row, height: cell.rowspan };
        } else {
          acc[colIndex] = { ...acc[colIndex], height: (acc[colIndex] && acc[colIndex].height) || 0 + cell.rowspan };
        }
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
  return isWidthValid && isHeightValid;
}
