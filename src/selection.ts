import { Editor, Block } from 'slate';

const insertStyleId = '__slate__table__id';

export function removeSelection(editor: Editor) {
  const editors = document.querySelectorAll('[data-slate-editor]');
  Array.from(editors).forEach(e => {
    const tables = e.querySelectorAll('table');
    tables.forEach(table => {
      const { key } = table.dataset;
      if (!key) return;
      const tableBlock = editor.value.document.getNode(key);
      if (!Block.isBlock(tableBlock)) return;
      tableBlock.nodes.forEach(row => {
        if (!Block.isBlock(row)) return;
        row.nodes.forEach(cell => {
          if (!Block.isBlock(cell)) return;
          editor.setNodeByKey(cell.key, {
            type: cell.type,
            data: { ...cell.data.toObject(), selectionColor: null },
          });
        });
      });
    });
  });
  removeSelectionStyle();
}

export function removeSelectionStyle() {
  const style = document.querySelector(`style#${insertStyleId}`);
  if (style) {
    const head = document.getElementsByTagName('head');
    const first = head && head.item(0);
    first && first.removeChild(style);
  }
}

export function addSelectionStyle() {
  // HACK: Add ::selection style when greater than 1 cells selected.
  if (!document.querySelector(`style#${insertStyleId}`)) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = insertStyleId;
    const head = document.getElementsByTagName('head');
    const first = head && head.item(0);
    if (first) {
      first.appendChild(style);
      const stylesheet = style.sheet as CSSStyleSheet;
      if (stylesheet) {
        stylesheet.insertRule(`table span::selection { background: none; }`, stylesheet.cssRules.length);
      }
    }
  }
}
