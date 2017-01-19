import { select, selectAll, addSelectMethods } from './utils';

export default class JsonSchemaArray extends HTMLElement {
  constructor() {
    super();
    this.select = select(this);
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .object-holder{
          margin: 5px;
          border: solid 1px red;
        }

      </style>
      <div class="object-holder">
      </div>
    `
  }

  set schema(s) {

    if (s && s.items && typeof (s.items) === 'object') {

      if (s.items.type === 'object') {
        this.select('.object-holder').innerHTML = '<schema-object></schema-object>';
        this.select('schema-object').schema = s.items;
      } else {
        this.select('.object-holder').textContent = s.items.type;
      }
    } else {
      throw new Error('support for non object `items` types not ready yet');
    }
  }
}
