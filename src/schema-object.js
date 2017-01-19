import { select, selectAll, addSelectMethods } from './utils';

export default class JsonSchemaObject extends HTMLElement {
  constructor() {
    super();
    addSelectMethods(this);
    // this.select = select(this);
    // this.selectAll = selectAll(this);
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <style>
        :host {
          display: block;
        } 
        
        #root{
          display: flex;
        }

      </style>
      <div id="holder"></div>
    `
  }

  set schema(s) {
    this._schema = s;

    if (s.properties) {

      let keys = Object.keys(s.properties);

      let markup = keys.map((key, index) => {
        let value = s.properties[key];
        let tag = `schema-${value.type}`;
        tag = tag === 'schema-undefined' ? 'div' : tag;
        return `
        <property-comment key="${key}"></property-comment>
        <property-name
          expandable="${value.type === 'object' || value.type === 'array'}" 
          required="${(s.required || []).indexOf(key) !== -1}"
          name="${key}" 
          type="${value.type}">
          <${tag} key="${key}"></${tag}>
          </property-name>`;
      });

      this.select('#holder').innerHTML = markup.join('\n');

      keys.forEach((key) => {
        let value = s.properties[key];
        this.selectAll(`[key="${key}"]`).forEach(n => {
          n.schema = value;
        });
      });
    }
  }
}
