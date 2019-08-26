import { Editor } from 'slate';

import * as table from './layout';
import { removeSelection, addSelectionStyle } from './selection';
import { canMerge } from './changes/merge';

import { removeRow } from './changes/remove-row';
import { removeColumn } from './changes/remove-column';
import { mergeBelow } from './changes/merge-below';
import { mergeRight } from './changes/merge-right';
import { mergeSelection } from './changes/merge-selection';
import { Option, defaultOptions } from './option';

import { insertAbove } from './changes/insert-above';
import { insertBelow } from './changes/insert-below';

import { insertLeft } from './changes/insert-left';
import { insertRight } from './changes/insert-right';

import { insertTable } from './changes/insert-table';
import { removeTable } from './changes/remove-table';
import { splitCell } from './changes/split-cell';

import { createRenderers } from './default-renderers';

export interface EditTableCommands {
  insertTable: () => EditTableCommands & Editor;

  insertRow: () => EditTableCommands & Editor;
  insertAbove: () => EditTableCommands & Editor;
  insertBelow: () => EditTableCommands & Editor;

  insertLeft: () => EditTableCommands & Editor;
  insertRight: () => EditTableCommands & Editor;

  mergeRight: () => EditTableCommands & Editor;
  mergeBelow: () => EditTableCommands & Editor;
  mergeSelection: () => EditTableCommands & Editor;

  splitCell: () => EditTableCommands & Editor;

  removeRow: () => EditTableCommands & Editor;
  removeColumn: () => EditTableCommands & Editor;
  removeTable: () => EditTableCommands & Editor;
}

export function EditTable(opts: Option = defaultOptions) {
  function isSelectionInTable(editor: Editor) {
    const { startBlock } = editor.value;
    if (!startBlock) return false;
    return table.TableLayout.isInCell(editor, opts);
  }

  function canSelectedCellsMerge(editor: Editor): boolean {
    const t = table.TableLayout.create(editor);
    if (!t) return false;
    const anchored = table.findAnchorCell(editor, opts);
    const focused = table.findFocusCell(editor, opts);

    if (!anchored || !focused) return false;

    return canMerge(editor, anchored.key, focused.key, opts);
  }

  function bindEditor(fn: (...args: any) => any) {
    return function(editor: Editor, ...args: any[]) {
      if (!isSelectionInTable(editor)) {
        return editor;
      }
      return fn(...[opts, editor].concat(args));
    };
  }

  function onBackspace(event: KeyboardEvent, editor: Editor, next: () => void) {
    const { value } = editor;
    const { selection } = value;
    const key = editor.value.focusBlock && editor.value.focusBlock.key;
    const cell = table.TableLayout.currentCell(editor);
    if (!cell) return next();
    // INFO: Skip backspace when first node and offset 0
    if (editor.value.focusBlock.type === opts.typeCell) {
      if (selection.start.offset != 0) return next();
    } else {
      if (selection.start.offset != 0 || key !== cell.nodes.get(0).key) return next();
    }
    event.preventDefault();
  }

  function onDelete(event: KeyboardEvent, editor: Editor, next: () => void) {
    const { value } = editor;
    const { selection } = value;
    if (selection.end.offset != value.startText.text.length) return next();
    event.preventDefault();
  }

  let isPrevInTable = false;
  function onSelect(event: any, editor: any, next: () => any): any {
    if (!isSelectionInTable(editor)) {
      if (isPrevInTable) {
        removeSelection(editor);
      }
      isPrevInTable = false;
      return next();
    }
    isPrevInTable = true;

    // HACK: Add ::selection style when more than 2 cells selected.
    const t = table.TableLayout.create(editor, opts);
    if (!t) {
      removeSelection(editor);
      return next();
    }

    const selection = window.getSelection();
    if (!selection) return next();

    const anchored = selection.anchorNode as HTMLElement;
    const focused = selection.focusNode as HTMLElement;
    if (!anchored || !focused) return next();
    if (anchored === focused) {
      removeSelection(editor);
      return next();
    }
    const anchorCellBlock = table.findCellBlockByElement(editor, anchored, opts);
    const focusCellBlock = table.findCellBlockByElement(editor, focused, opts);
    if (!anchorCellBlock) {
      removeSelection(editor);
    }
    if (!anchorCellBlock || !focusCellBlock) return next();

    const range = selection.getRangeAt(0);
    if (range.startContainer === range.endContainer && range.startOffset === range.endOffset) return next();

    if (anchorCellBlock.key === focusCellBlock.key) {
      t.table.forEach(row => {
        row.forEach(cell => {
          editor.setNodeByKey(cell.key, {
            type: cell.block.type,
            data: { ...cell.block.data.toObject(), selectColor: null },
          });
        });
      });
      return next();
    }

    // HACK: Add ::selection style when greater than 1 cells selected.
    addSelectionStyle();

    const blocks = table.createSelectedBlockMap(editor, anchorCellBlock.key, focusCellBlock.key);
    t.table.forEach(row => {
      row.forEach(cell => {
        if (blocks[cell.key]) {
          editor.setNodeByKey(cell.key, {
            type: cell.block.type,
            data: { ...cell.block.data.toObject(), selectionColor: opts.selectionColor },
          });
        } else {
          editor.setNodeByKey(cell.key, {
            type: cell.block.type,
            data: { ...cell.block.data.toObject(), selectionColor: null },
          });
        }
      });
    });
    next();
  }
  /**
   * User is pressing a key in the editor
   */
  function onKeyDown(event: any, editor: any, next: () => any): any {
    if (!isSelectionInTable(editor)) {
      return next();
    }
    const { value } = editor;

    // INFO: It is needed to prevent replace some <td /> s when some cells selected.
    if (value.startBlock !== value.endBlock) {
      event.preventDefault();
      return next();
    }

    const { document, selection } = value;
    const { start, isCollapsed } = selection;
    if (!start || !start.key) return next();
    const startNode = document.getDescendant(start.key);
    if (!startNode) return next();
    if (
      startNode.text === '' &&
      value.startBlock.type === opts.typeCell &&
      ((event.ctrlKey && event.key === 'd') || event.key === 'Delete')
    ) {
      return onDelete(event, editor, next);
    }
    if (isCollapsed && start.isAtStartOfNode(startNode)) {
      const previous = document.getPreviousText(startNode.key);
      if (!previous) return next();
      const prevBlock = document.getClosestBlock(previous.key);
      if (!prevBlock) return next();
      if (prevBlock.type === opts.typeCell) {
        if (['Backspace', 'Delete', 'Enter'].includes(event.key) || (event.ctrlKey && event.key === 'h')) {
          event.preventDefault();
        } else {
          return next();
        }
      }
    }
    if (event.ctrlKey && event.key === 'd') {
      event.preventDefault();
      const { value } = editor;
      const { selection } = value;
      // INFO: Delete forward when it is not end of node
      if (selection.end.offset != value.startText.text.length) {
        editor.deleteForward(1);
        return next();
      }
      return next();
    }

    if (event.ctrlKey && event.key === 'h') {
      const { value } = editor;
      const { selection } = value;
      const key = editor.value.focusBlock && editor.value.focusBlock.key;
      const cell = table.TableLayout.currentCell(editor);
      if (!cell) return next();
      // INFO: Skip backspace when first node and offset 0
      event.preventDefault();
      if (editor.value.focusBlock.type === opts.typeCell) {
        if (selection.start.offset != 0) {
          editor.deleteBackward(1);
          return next();
        }
      } else {
        if (selection.start.offset != 0 || key !== cell.nodes.get(0).key) {
          editor.deleteBackward(1);
          return next();
        }
      }
      return next();
    }

    switch (event.key) {
      case 'Backspace':
        return onBackspace(event, editor, next);
      case 'Delete':
        return onDelete(event, editor, next);
      default:
        return next();
    }
  }

  function onBlur(event: any, editor: any, next: () => void) {
    removeSelection(editor);
    next();
  }

  const renderer = createRenderers(opts);

  return {
    onKeyDown,
    onSelect,
    onBlur,
    // For old version
    renderNode: renderer,
    // For slate-react@0.22.0~
    renderBlock: renderer,
    queries: {
      hasTablePlugin: () => true,
      isSelectionInTable,
      canSelectedCellsMerge,
    },

    commands: {
      insertTable: bindEditor(insertTable),
      // row
      insertAbove: bindEditor(insertAbove),
      insertBelow: bindEditor(insertBelow),
      // column
      insertLeft: bindEditor(insertLeft),
      insertRight: bindEditor(insertRight),

      mergeRight: bindEditor(mergeRight),
      mergeBelow: bindEditor(mergeBelow),
      mergeSelection: bindEditor(mergeSelection),

      splitCell: bindEditor(splitCell),
      removeRow: bindEditor(removeRow),
      removeColumn: bindEditor(removeColumn),
      removeTable: bindEditor(removeTable),
    },
  };
}

export function hasTablePlugin<T extends any>(e: T): e is T & EditTableCommands {
  return e && e.hasTablePlugin && e.hasTablePlugin();
}