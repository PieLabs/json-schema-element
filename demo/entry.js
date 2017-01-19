//entry.js

import { define } from '../src/index';
import sample from './sample-schema';

define();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('json-schema').schema = sample;
});