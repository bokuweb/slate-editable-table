import { Editor } from 'slate-react';
import { ValueJSON, Value } from 'slate';

import React from 'react';
import { EditTable, EditTableCommands, hasTablePlugin } from '../src/';

const tablePlugin = EditTable();

const plugins = [tablePlugin];

export type Props = {
  initialValue: ValueJSON;
  onChange: ({ value: Value }) => void;
};

export class ExampleEditor extends React.Component<Props> {
  editor!: Editor & EditTableCommands;
  state: {
    value: Value;
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: Value.fromJSON(props.initialValue),
    };
  }

  onChange = ({ value }) => {
    this.setState({ value });
    this.props.onChange({ value });
  };

  removeTable = () => {
    this.editor.removeTable();
  };

  insertTable = () => {
    this.editor.insertTable(3, 3, { columnWidth: 200, maxWidth: 500 });
  };

  insertLeft = () => {
    this.editor.insertLeft();
  };

  insertRight = () => {
    this.editor.insertRight();
  };

  insertAbove = () => {
    this.editor.insertAbove();
  };

  insertBelow = () => {
    this.editor.insertBelow();
  };

  removeColumn = () => {
    this.editor.removeColumn();
  };

  removeRow = () => {
    this.editor.removeRow();
  };

  mergeRight = () => {
    this.editor.mergeRight();
  };

  mergeBelow = () => {
    this.editor.mergeBelow();
  };

  mergeSelection = () => {
    this.editor.mergeSelection();
  };

  splitCell = () => {
    this.editor.splitCell();
  };

  enableResizing = () => {
    this.editor.enableResizing();
  };

  disableResizing = () => {
    this.editor.disableResizing();
  };

  redo = () => {
    this.editor.redo();
  };

  undo = () => {
    this.editor.undo();
  };

  render() {
    return (
      <>
        <button onMouseDown={this.insertTable}>Insert Table</button>
        <button onMouseDown={this.insertAbove}>Insert Above</button>
        <button onMouseDown={this.insertBelow}>Insert Below</button>
        <button onMouseDown={this.insertLeft}>Insert Left</button>
        <button onMouseDown={this.insertRight}>Insert Right</button>
        <button onMouseDown={this.mergeRight}>merge right</button>
        <button onMouseDown={this.mergeBelow}>merge bottom</button>
        <button onMouseDown={this.mergeSelection}>merge selection</button>
        <button onMouseDown={this.splitCell}>split cell</button>
        <button onMouseDown={this.removeColumn}>Remove Column</button>
        <button onMouseDown={this.removeRow}>Remove Row</button>
        <button onMouseDown={this.removeTable}>Remove Table</button>
        <button onMouseDown={this.disableResizing}>disable resizing</button>
        <button onMouseDown={this.enableResizing}>enable resizing</button>
        <button onMouseDown={this.redo}>redo</button>
        <button onMouseDown={this.undo}>undo</button>
        <Editor
          ref={e => {
            if (hasTablePlugin(e)) {
              this.editor = e;
            }
          }}
          plugins={plugins}
          placeholder="Enter some text..."
          value={this.state.value}
          onChange={this.onChange}
        />
      </>
    );
  }
}
