import { Block } from 'slate';

export type Store = {
  subscribeDisableResizing: (f: (v: boolean) => void) => void;
  setDisableResizing: (v: boolean) => void;
  setAnchorCellBlock: (b: Block | null) => void;
  getAnchorCellBlock: () => Block | null;
  setFocusCellBlock: (b: Block | null) => void;
  getFocusCellBlock: () => Block | null;
};

export const createPropsStore = () => {
  // eslint-disable-next-line
  let emitter = (v: boolean) => {};
  let anchorCellBlock: Block | null = null;
  let focusCellBlock: Block | null = null;
  return {
    subscribeDisableResizing: (f: (v: boolean) => void) => (emitter = f),
    setDisableResizing: (v: boolean) => {
      emitter(v);
    },
    setAnchorCellBlock: (b: Block | null) => (anchorCellBlock = b),
    getAnchorCellBlock: () => anchorCellBlock,
    setFocusCellBlock: (b: Block | null) => (focusCellBlock = b),
    getFocusCellBlock: () => focusCellBlock,
  };
};
