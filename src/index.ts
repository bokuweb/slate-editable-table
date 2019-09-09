import { Editor, Block } from 'slate';
import * as React from 'react';

import * as table from './layout';
import { removeSelection } from './selection';
import { canMerge } from './mutations/merge';
import { TableOption } from './create-table';
import { removeRow } from './mutations/remove-row';
import { removeColumn } from './mutations/remove-column';
import { mergeBelow } from './mutations/merge-below';
import { mergeRight } from './mutations/merge-right';
import { mergeSelection } from './mutations/merge-selection';
import { Option, defaultOptions } from './option';

import { insertAbove } from './mutations/insert-above';
import { insertBelow } from './mutations/insert-below';

import { insertLeft } from './mutations/insert-left';
import { insertRight } from './mutations/insert-right';

import { insertTable } from './mutations/insert-table';
import { removeTable } from './mutations/remove-table';
import { splitCell } from './mutations/split-cell';

import { createPropsStore } from './store';

import { createRenderers, TableHandler } from './renderers';

export interface EditTableCommands {
  isSelectionInTable: () => boolean;
  findCurrentTable: () => Block | null;
  insertTable: (col?: number, row?: number, tableOption?: TableOption) => EditTableCommands & Editor;

  disableResizing: () => void;
  enableResizing: () => void;

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

export function EditTable(options: Option = defaultOptions) {
  const opts = { ...defaultOptions, ...options } as Required<Option>;
  const ref = React.createRef<TableHandler>();
  const store = createPropsStore();

  function isSelectionInTable(editor: Editor) {
    const { startBlock, endBlock } = editor.value;
    if (!startBlock || !endBlock) return false;
    return table.isInCell(editor, startBlock, opts) || table.isInCell(editor, endBlock, opts);
  }

  function canSelectedCellsMerge(editor: Editor): boolean {
    const t = table.TableLayout.create(editor, opts);
    if (!t) return false;
    const anchored = table.findAnchorCell(editor, opts);
    const focused = table.findFocusCell(editor, opts);

    if (!anchored || !focused) return false;

    return canMerge(editor, anchored.key, focused.key, opts);
  }

  function bindEditorWithoutSelectionCheck(fn: (...args: any) => any) {
    return function(editor: Editor, ...args: any[]) {
      return fn(...[opts, editor].concat(args));
    };
  }

  function bindEditorWithStore(fn: (...args: any) => any) {
    return function(editor: Editor, ...args: any[]) {
      if (!isSelectionInTable(editor)) {
        return editor;
      }
      // update table size
      ref.current && ref.current.update();
      return fn(...[opts, editor, store].concat(args));
    };
  }

  function bindEditor(fn: (...args: any) => any) {
    return function(editor: Editor, ...args: any[]) {
      if (!isSelectionInTable(editor)) {
        return editor;
      }
      // update table size
      ref.current && ref.current.update();
      return fn(...[opts, editor].concat(args));
    };
  }

  function onBackspace(event: KeyboardEvent, editor: Editor, next: () => void) {
    const { value } = editor;
    const { selection } = value;
    const key = editor.value.focusBlock && editor.value.focusBlock.key;
    const cell = table.TableLayout.currentCell(editor, opts);
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
      const cell = table.TableLayout.currentCell(editor, opts);
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

  const renderer = createRenderers(opts, ref, store);

  return {
    onKeyDown,
    onBlur,
    // For old version
    renderNode: renderer,
    // For slate-react@0.22.0~
    renderBlock: renderer,
    queries: {
      hasTablePlugin: () => true,
      isSelectionInTable,
      canSelectedCellsMerge,
      findCurrentTable: (editor: Editor) => table.findCurrentTable(editor, opts),
    },

    commands: {
      disableResizing: bindEditorWithoutSelectionCheck(() => store.setDisableResizing(true)),
      enableResizing: bindEditorWithoutSelectionCheck(() => store.setDisableResizing(false)),

      insertTable: bindEditorWithoutSelectionCheck(insertTable),
      // row
      insertAbove: bindEditor(insertAbove),
      insertBelow: bindEditor(insertBelow),
      // column
      insertLeft: bindEditor(insertLeft),
      insertRight: bindEditor(insertRight),

      mergeRight: bindEditor(mergeRight),
      mergeBelow: bindEditor(mergeBelow),
      mergeSelection: bindEditorWithStore(mergeSelection),

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
