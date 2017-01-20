//TEST entry.js

import { define } from '../src/index';
import sample from '../demo/sample-schema';


//define the json schema elements
define();

window.sample = sample;


document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('json-schema').schema = sample;
});