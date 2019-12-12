## :rotating_light: :rotating_light: :rotating_light: This Plugin Support `slate`: <= 0.4x. This is because there is a huge change in slatejs 0.50 and this plugin can not follow it. :rotating_light: :rotating_light: :rotating_light:


# slate-editable-table

[![CircleCI](https://circleci.com/gh/bokuweb/slate-editable-table/tree/master.svg?style=svg)](https://circleci.com/gh/bokuweb/slate-editable-table/tree/master) [![Netlify Status](https://api.netlify.com/api/v1/badges/38cf0525-13bf-4e03-827b-5cd3d9d452a3/deploy-status)](https://app.netlify.com/sites/jolly-fermi-6a0c28/deploys)
[![GitHub Actions Status](https://github.com/bokuweb/slate-editable-table/workflows/Node%20CI/badge.svg)](https://github.com/bokuweb/slate-editable-table/actions)

:pen: An editable table plugin for Slate.js


## Table of Contents

* [Screenshot](#Screenshot)
* [Live Demo](#live-demo)
  * [Storybook](#storybook)
* [Install](#install)
* [Usage](#usage)
* [Commands](#commands)
* [Test](#test)
* [Changelog](#changelog)
* [License](#license)


## Screenshot

<img src="https://github.com/bokuweb/slate-editable-table/blob/master/example/screenshot.gif?raw=true" />

## Live Demo

### Storybook

[Storybook](https://jolly-fermi-6a0c28.netlify.com/)

## Install

- use npm

```sh
npm i -S slate-editable-table
```

- use yarn

```sh
yarn add slate-editable-table
```

## Usage

``` typescript
import { Editor } from 'slate-react';
import { ValueJSON, Value } from 'slate';

import React from 'react';
import { EditTable, EditTableCommands, hasTablePlugin } from 'slate-editable-table';

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

  removeTable = () => this.editor.removeTable();
  insertTable = () => this.editor.insertTable(3, 3, { columnWidth: 200, maxWidth: 500 });
  insertLeft = () => this.editor.insertLeft();
  insertRight = () => this.editor.insertRight();
  insertAbove = () => this.editor.insertAbove();
  insertBelow = () => this.editor.insertBelow();
  removeColumn = () => this.editor.removeColumn();
  removeRow = () => this.editor.removeRow();
  mergeSelection = () => this.editor.mergeSelection();
  splitCell = () => this.editor.splitCell();
  enableResizing = () => this.editor.enableResizing();
  disableResizing = () => this.editor.disableResizing();

render() {
    return (
      <>
        <button onMouseDown={this.insertTable}>Insert Table</button>
        <button onMouseDown={this.insertAbove}>Insert Above</button>
        <button onMouseDown={this.insertBelow}>Insert Below</button>
        <button onMouseDown={this.insertLeft}>Insert Left</button>
        <button onMouseDown={this.insertRight}>Insert Right</button>
        <button onMouseDown={this.mergeSelection}>merge selection</button>
        <button onMouseDown={this.splitCell}>split cell</button>
        <button onMouseDown={this.removeColumn}>Remove Column</button>
        <button onMouseDown={this.removeRow}>Remove Row</button>
        <button onMouseDown={this.removeTable}>Remove Table</button>
        <button onMouseDown={this.disableResizing}>disable resizing</button>
        <button onMouseDown={this.enableResizing}>enable resizing</button>
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
```

Please see also https://github.com/bokuweb/slate-editable-table/blob/master/example/index.tsx

## Commands


| Command           | Description                                                       |
|:------------------|:------------------------------------------------------------------|
| `insertTable`     | create and insert new table                                       |
| `removeTable`     | remove table                                                      |
| `insertLeft`      | insert new column to left of current anchor cell                  |
| `insertRight`     | insert new column to right of current anchor cell                 |
| `insertAbove`     | insert new row to above of current anchor cell                    |
| `insertBelow`     | insert new row to below of current anchor cell                    |
| `removeColumn`    | remove selected column                                            |
| `removeRow`       | remove selected row                                               |
| `mergeSelection`  | merge current selection                                           |
| `splitCell`       | split current cell                                                |
| `enableResizing`  | enable cell resizing                                              |
| `enableResizing`  | disable cell resizing                                             |

## Query

| Query                    | Description                                                       |
|:-------------------------|:------------------------------------------------------------------|
| `isSelectionInTable`     | If selection is in current table, return true                     |
| `canSelectedCellsMerge`  | If selection is able to merge, return true                        |
| `findCurrentTable`       | find current table block                                          |
      

## Test

``` sh
npm t
```

## TODO

- [ ] support mobile
- [ ] vertical resizing
- [ ] custom renderer

## Contribute

If you have a feature request, please add it as an issue or make a pull request.

## Changelog

#### v0.1.0

- Initial release

## License

The MIT License (MIT)

Copyright (c) 2019 bokuweb

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
