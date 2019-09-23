/* eslint-disable */
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      // useTsconfigDeclarationDir: true,
    }),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  ],
  output: {
    sourcemap: true,
    exports: 'named',
    name: 'slate-editable-table',
    globals: {
      react: 'React',
    },
  },
  external: ['react', 'slate', 'immutable'],
};
