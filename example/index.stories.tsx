import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ExampleEditor } from '.';

import oneByOne from '../mocks/one-by-one';
import twoByTwo from '../mocks/two-by-two';
import threeByThree from '../mocks/three-by-three';
import threeByThreeColRowspan2 from '../mocks/three-by-three-colspan-rowspan-2';
import FourByThreeRowspan3 from '../mocks/four-by-three-rowspan-3';
import FourByFourRowspan3AndColspan4 from '../mocks/four-by-four-rowspan-3-and-colspan4';
import twoByTwoNested from '../mocks/two-by-two-nested';

storiesOf('table', module)
  .add('Simple 1 x 1', () => {
    return <ExampleEditor initialValue={oneByOne} onChange={({ value }) => {}} />;
  })
  .add('Simple 2 x 2', () => {
    return <ExampleEditor initialValue={twoByTwo} onChange={({ value }) => {}} />;
  })
  .add('Simple 3 x 3', () => {
    return <ExampleEditor initialValue={threeByThree} onChange={({ value }) => {}} />;
  })
  .add('Merged 3 x 3 colspan/rowspan=2', () => {
    return (
      <ExampleEditor
        initialValue={threeByThreeColRowspan2}
        onChange={({ value }) => {
          console.log('ssss', value.toJSON());
        }}
      />
    );
  })
  .add('Merged 4 x 3 rowspan3', () => {
    return <ExampleEditor initialValue={FourByThreeRowspan3} onChange={({ value }) => {}} />;
  })
  .add('Merged 4 x 4 rowspan3 and colspan4', () => {
    return <ExampleEditor initialValue={FourByFourRowspan3AndColspan4} onChange={({ value }) => {}} />;
  })
  .add('Nested 2 x 2', () => {
    return <ExampleEditor initialValue={twoByTwoNested} onChange={({ value }) => {}} />;
  });
