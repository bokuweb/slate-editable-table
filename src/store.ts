export type Store = {
  subscribeDisableResizing: (f: (v: boolean) => void) => void;
  setDisableResizing: (v: boolean) => void;
};

export const createPropsStore = () => {
  // eslint-disable-next-line
  let emitter = (v: boolean) => {};
  return {
    subscribeDisableResizing: (f: (v: boolean) => void) => (emitter = f),
    setDisableResizing: (v: boolean) => {
      emitter(v);
    },
  };
};
