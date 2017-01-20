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


    let getTypeProps = (v) => {
      if (v.type === 'array') {
        let subtype = v.items.type;
        let type = `array[${subtype}]`;
        let expandable = subtype === 'object';
        return { type, expandable }
      } else {
        return { type: v.type, expandable: v.type === 'object' };
      }
    }


    if (s.properties) {

      let keys = Object.keys(s.properties);

      let markup = keys.map((key, index) => {
        let value = s.properties[key];
        let tag = `schema-${value.type}`;
        tag = tag === 'schema-undefined' ? 'div' : tag;
        let {type, expandable} = getTypeProps(value);
        return `
        <property-comment key="${key}"></property-comment>
        <property-name
          expandable="${expandable}" 
          required="${(s.required || []).indexOf(key) !== -1}"
          name="${key}" 
          type="${type}">
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
