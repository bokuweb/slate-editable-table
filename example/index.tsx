import { Editor } from 'slate-react';
import { Editor as CoreEditor, ValueJSON, Value } from 'slate';
import { RenderBlockProps } from 'slate-react';

import React from 'react';
import { EditTable, TableEditor } from '../src/';

const tablePlugin = EditTable();

const plugins = [tablePlugin];

export type Props = {
  initialValue: ValueJSON;
  onChange: ({ value: Value }) => void;
};

export class ExampleEditor extends React.Component<Props> {
  editor!: TableEditor;
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

  insertColumn = () => {
    this.onChange(this.editor.insertColumn());
  };

  insertRow = () => {
    this.onChange(this.editor.insertRow());
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

  render() {
    return (
      <>
        <button onClick={this.insertColumn}>Insert Column</button>
        <button onClick={this.insertRow}>Insert Row</button>
        <button onClick={this.removeColumn}>Remove Column</button>
        <button onClick={this.removeRow}>Remove Row</button>
        <button onClick={this.removeTable}>Remove Table</button>
        <button onClick={this.mergeRight}>merge right</button>
        <button onClick={this.mergeBelow}>merge bottom</button>
        <button onClick={this.mergeSelection}>merge selection</button>
        {/* 
  // @ts-ignore */}
        <Editor
          ref={e => {
            if (e) {
              this.editor = (e as any) as TableEditor;
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
