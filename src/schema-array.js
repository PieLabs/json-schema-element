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
          margin-left: 1px;
          padding-left: 0px;
          display: block; 
          border-left: solid 2px grey;
        }

        schema-object {
          --schema-object-left-margin: 0px;
        }

        .primitive{
          padding-left: 25px;
        }


      </style>
      <span class="object-holder"> </span>
    `
  }

  set schema(s) {

    if (s && s.items && typeof (s.items) === 'object') {

      if (s.items.type === 'object') {
        this.select('.object-holder').innerHTML = '<schema-object></schema-object>';
        this.select('schema-object').schema = s.items;
      } else {
        this.select('.object-holder').innerHTML = `<span class="primitive ${s.items.type}">${s.items.type}</span>`;
      }
    } else {
      throw new Error('support for non object `items` types not ready yet');
    }
  }
}
