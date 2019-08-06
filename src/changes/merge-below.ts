import { Editor, Text, Block, Inline } from 'slate';

import { TableMap } from '../table-map';
import { Option } from '../option';

export function mergeBelow(opts: Option, editor: Editor) {
  const currentCell = TableMap.currentCell(editor);
  if (!currentCell) return;
  const { key } = currentCell;
  const table = TableMap.create(editor);
  if (!table) return;
  if (table.isLastRow(key) || !currentCell) return;

  const current = table.findCellBy(key);
  const below = table.findBelow(key);

  if (!below || !current) return;
  if (below.colspan !== current.colspan || below.col !== current.col) return;
  const rowspan = currentCell.data.get('rowspan') || 1;
  const nextRowspan = below.rowspan || 1;
  // INFO: Remove below nodes when below nodes size equals 1
  if (below.rowBlock.nodes.size === 1) {
    editor.removeNodeByKey(below.rowKey);
    editor.moveToEndOfNode(currentCell);
    below.block.nodes.forEach((n?: Block | Inline | Text) => {
      if (!Block.isBlock(n)) return;
      editor
        .moveToEndOfNode(currentCell)
        .insertBlock(n)
        .moveToEndOfNode(n);
    });

    editor.setNodeByKey(key, {
      type: currentCell.type,
      data: { ...currentCell.data.toObject(), rowspan: rowspan + nextRowspan },
    });
    current.rowBlock.nodes.forEach((n?: Block | Inline | Text) => {
      if (!Block.isBlock(n)) return;
      const rowspan = n.data.get('rowspan') || 1;
      editor.setNodeByKey(n.key, {
        type: n.type,
        data: { ...n.data.toObject(), rowspan: rowspan > 1 ? rowspan - 1 : rowspan },
      });
    });
  } else {
    editor.removeNodeByKey(below.key).setNodeByKey(key, {
      type: currentCell.type,
      data: { ...currentCell.data.toObject(), rowspan: rowspan + nextRowspan },
    });
    below.block.nodes.forEach((n?: Block | Inline | Text) => {
      if (!Block.isBlock(n)) return;
      editor.insertBlock(n).moveToEndOfNode(n);
    });
  }
  editor.moveToStartOfNode(currentCell);
}
