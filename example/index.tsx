import { Editor } from 'slate-react';
import { Editor as CoreEditor, ValueJSON, Value } from 'slate';
import { RenderBlockProps } from 'slate-react';

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

  renderNode = (props: RenderBlockProps, editor: CoreEditor, next: () => any): any => {
    const { attributes, children, node } = props;
    switch (node.type) {
      case 'paragraph':
        return (
          <div {...attributes} style={{ textAlign: node.data.get('align') }}>
            {children}
          </div>
        );
      default:
        next();
    }
  };

  renderBlock = (props: RenderBlockProps, editor: CoreEditor, next: () => any): any => {
    const { attributes, children, node } = props;
    switch (node.type) {
      case 'paragraph':
        return (
          <div {...attributes} style={{ textAlign: node.data.get('align') }}>
            {children}
          </div>
        );
      default:
        next();
    }
  };

  renderMark = (props, editor, next) => {
    return next();
  };

  onBackspace = (event, editor, next) => {
    next();
  };

  onDelete = (event, editor, next) => {
    next();
  };

  onDropOrPaste = (event, editor, next) => {
    next();
  };

  onDrop = (event, editor, next) => {
    next();
  };

  onChange = ({ value }) => {
    this.setState({ value });
    this.props.onChange({ value });
  };

  onKeyDown = (event, editor, next) => {
    next();
  };

  onSelect = (event, editor, next) => {
    next();
  };

  onBlur = (event, editor, next) => {
    next();
  };

  removeTable = () => {
    this.onChange(this.editor.removeTable());
  };

  insertTable = () => {
    this.onChange(this.editor.insertTable(3, 3, { cellWidth: 200, maxWidth: 500 }));
  };

  insertLeft = () => {
    this.onChange(this.editor.insertLeft());
  };

  insertRight = () => {
    this.onChange(this.editor.insertRight());
  };

  insertAbove = () => {
    this.onChange(this.editor.insertAbove());
  };

  insertBelow = () => {
    this.onChange(this.editor.insertBelow());
  };

  removeColumn = () => {
    this.onChange(this.editor.removeColumn());
  };

  removeRow = () => {
    this.onChange(this.editor.removeRow());
  };

  mergeRight = () => {
    this.onChange(this.editor.mergeRight());
  };

  mergeBelow = () => {
    this.onChange(this.editor.mergeBelow());
  };

  mergeSelection = () => {
    this.onChange(this.editor.mergeSelection());
  };

  splitCell = () => {
    this.onChange(this.editor.splitCell());
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
        <Editor
          ref={e => {
            if (hasTablePlugin(e)) {
              this.editor = e;
            }
          }}
          plugins={plugins}
          placeholder="Enter some text..."
          value={this.state.value}
          onKeyDown={this.onKeyDown}
          onDrop={this.onDrop}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onSelect={this.onSelect}
          onPaste={this.onDropOrPaste}
          renderBlock={this.renderBlock}
          // renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
      </>
    );
  }
}
