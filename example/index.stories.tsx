import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ExampleEditor } from '.';

import oneByOne from '../mocks/one-by-one';
import twoByTwo from '../mocks/two-by-two';
import threeByThree from '../mocks/three-by-three';

import initialValue2 from '../mocks/value2';
import initialValue6 from '../mocks/value6';

storiesOf('table', module)
  .add('1 x 1', () => {
    return <ExampleEditor initialValue={oneByOne} onChange={({ value }) => {}} />;
  })
  .add('2 x 2', () => {
    return <ExampleEditor initialValue={twoByTwo} onChange={({ value }) => {}} />;
  })
  .add('3 x 3', () => {
    return <ExampleEditor initialValue={threeByThree} onChange={({ value }) => {}} />;
  })
  .add('2', () => {
    return <ExampleEditor initialValue={initialValue2} onChange={({ value }) => {}} />;
  })
  .add('6', () => {
    return <ExampleEditor initialValue={initialValue6} onChange={({ value }) => {}} />;
  });
