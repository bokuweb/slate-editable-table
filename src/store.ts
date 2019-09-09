import { Block, Editor } from 'slate';

export class ComponentStore {
  disableMap = new Map<Editor, boolean>();
  emitterMap = new Map<Editor, Array<(v: boolean) => void>>();
  anchorCellBlock: Block | null = null;
  focusCellBlock: Block | null = null;

  subscribeDisableResizing = (editor: Editor, f: (v: boolean) => void) => {
    const emitters = this.emitterMap.get(editor) || [];
    this.emitterMap.set(editor, [...emitters, f]);
    f(this.disableMap.get(editor) || false);
  };
  setDisableResizing = (editor: Editor, v: boolean) => {
    this.disableMap.set(editor, v);
    const emittters = this.emitterMap.get(editor) || [];
    emittters.forEach(e => {
      e(v);
    });
  };
  setAnchorCellBlock = (b: Block | null) => (this.anchorCellBlock = b);
  getAnchorCellBlock = () => this.anchorCellBlock;
  setFocusCellBlock = (b: Block | null) => (this.focusCellBlock = b);
  getFocusCellBlock = () => this.focusCellBlock;
}
