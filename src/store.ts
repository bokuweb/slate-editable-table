import { Block, Editor } from 'slate';

export class ComponentStore {
  // INFO: Use MAP with editor as key
  //       This is needed to support multi editor and singleton plugin.
  resizeDisableMap = new Map<Editor, boolean>();
  resizeDisableEmitterMap = new Map<Editor, Array<(v: boolean) => void>>();
  anchorCellBlock: Block | null = null;
  focusCellBlock: Block | null = null;
  isCellSelecting = false;

  subscribeDisableResizing = (editor: Editor, f: (v: boolean) => void) => {
    const emitters = this.resizeDisableEmitterMap.get(editor) || [];
    this.resizeDisableEmitterMap.set(editor, [...emitters, f]);
    f(this.resizeDisableMap.get(editor) || false);
  };
  setDisableResizing = (editor: Editor, v: boolean) => {
    this.resizeDisableMap.set(editor, v);
    const emitters = this.resizeDisableEmitterMap.get(editor) || [];
    emitters.forEach(e => {
      e(v);
    });
  };
  setAnchorCellBlock = (b: Block | null) => (this.anchorCellBlock = b);
  getAnchorCellBlock = () => this.anchorCellBlock;
  setFocusCellBlock = (b: Block | null) => (this.focusCellBlock = b);
  getFocusCellBlock = () => this.focusCellBlock;
  setCellSelecting = (editor: Editor) => {
    this.isCellSelecting = true;
    // Disable resizing when cell selection started
    const emitters = this.resizeDisableEmitterMap.get(editor) || [];
    emitters.forEach(e => {
      e(true);
    });
  };
  clearCellSelecting = (editor: Editor) => {
    this.isCellSelecting = false;
    const v = this.resizeDisableMap.get(editor);
    const emitters = this.resizeDisableEmitterMap.get(editor) || [];
    emitters.forEach(e => {
      e(!!v);
    });
  };
  getCellSelecting = () => this.isCellSelecting;

  dispose = () => {
    this.resizeDisableMap.clear();
    this.resizeDisableEmitterMap.clear();
  };
}
