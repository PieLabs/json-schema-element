import EventTarget from './event-target';
import JsonSchemaArray from './schema-array';
import JsonSchemaObject from './schema-object';
import PropertyComment from './property-comment';
import PropertyName from './property-name';
import { select, selectAll, addSelectMethods } from './utils';
import OpenCloseArrow from './open-close-arrow';
import SchemaControls from './schema-controls';
import { GetEnvEvent } from './events';

export default class JsonSchemaRoot extends HTMLElement {
  constructor() {
    super();

    this.select = select(this);
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `

      <style>
        * {
          font-family: var(--json-schema-font, 'Roboto Mono', monospace);
          color: var(--json-schema-font-color, black);
        }

        hr{
          border: none;
          border-bottom: solid 1px var(--json-schema-hr-color, rgba(0,0,0,0.2));
        }

        schema-controls{
          float: right;
        }

        #title {
          font-size: 20px;
        }

        #description{
          font-style: italic;
        }
      </style>
      <label id="title"></label>    
      <br/>
      <label id="description"></label>    
      <schema-controls></schema-controls>
      <hr/>
      <schema-object></schema-object>
    `;

    this.env = new EventTarget();

    this._showComments = true;

    //TODO: is there a more standard way of setting up a binding?
    Object.defineProperty(this.env, 'showComments', {
      set: (s) => {
        this._showComments = s;
        let event = { type: 'updated', target: this.env };
        this.env.dispatchEvent(event);
      },
      get: () => {
        return this._showComments;
      }
    });

    this.addEventListener(GetEnvEvent.TYPE, (e) => {
      e.detail.handler(this.env);
    });
  }

  set schema(s) {
    this._schema = s;
    if (s) {
      this.select('#title').textContent = s.title;
      this.select('#description').textContent = s.description;
      this.select('schema-object').schema = s;
      this.select('schema-object').env = this.env;
    }
  }

  connectedCallback() {
    this.select('schema-controls').env = this.env;
  }
}


export function define() {
  customElements.define('property-name', PropertyName);
  customElements.define('property-comment', PropertyComment);
  customElements.define('json-schema', JsonSchemaRoot);
  customElements.define('schema-object', JsonSchemaObject);
  customElements.define('schema-controls', SchemaControls);
  customElements.define('schema-array', JsonSchemaArray);
  customElements.define('open-close-arrow', OpenCloseArrow);
}