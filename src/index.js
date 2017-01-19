import * as icons from './icons';
import EventTarget from './event-target';

let addSelectMethods = (context) => {
  context.select = select(context);
  context.selectAll = selectAll(context);
}

let selectAll = (context) => {
  return function (selector) {
    return this.shadowRoot.querySelectorAll(selector);
  }.bind(context);
}

let select = (context) => {
  return function (selector) {
    return this.shadowRoot.querySelector(selector);
  }.bind(context);
}

class SchemaControls extends HTMLElement {
  constructor() {
    super();
    addSelectMethods(this);
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `

    <style>
       * {
        user-select: none; 
       } 
    </style>
    <label>
    <input type="checkbox"></input> Show Comments
    </label>
    <button>Expand All</button>
    <button>Collapse All</button>
    `;
  }

  updateUi() {
    if (!this._env) {
      return;
    }
    if (this._env.showComments) {
      this.select('[type="checkbox"]').setAttribute('checked', '');
    } else {
      this.select('[type="checkbox"]').removeAttribute('checked');
    }
  }

  set env(e) {

    this._env = e;

    if (e) {
      this.updateUi();
      e.addEventListener('updated', (event) => {
        this.updateUi.bind(this);
      });
    }
  }

  connectedCallback() {
    this.select('[type="checkbox"]').addEventListener('click', e => {
      if (this._env) {
        this._env.showComments = e.target.checked;
      }
    });
  }
}

export default class JsonSchemaRoot extends HTMLElement {
  constructor() {
    super();

    this.select = select(this);
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `

      <style>
        * {
          font-family: 'Roboto Mono', monospace;
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


    Object.defineProperty(this.env, 'showComments', {
      set: (s) => {
        this._showComments = s;
        this.env.dispatchEvent({ type: 'updated', target: this.env });
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

class JsonSchemaArray extends HTMLElement {
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

class OpenCloseArrow extends HTMLElement {
  constructor() {
    super();
    this.select = select(this);
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <style>
        :host{
          user-select: none;
        }
        svg[hidden]{
          display: none;
        } 
        svg{
          cursor: pointer;
        }
      </style>
      ${icons.downArrow()}
      ${icons.rightArrow()} 
    `;
  }

  state(s) {
    if (s === 'closed') {
      this.select('.down-arrow').setAttribute('hidden', '');
      this.select('.right-arrow').removeAttribute('hidden');

    } else {
      this.select('.right-arrow').setAttribute('hidden', '');
      this.select('.down-arrow').removeAttribute('hidden');
    }
  }

  closeEvent() {
    return new CustomEvent('arrow-close', {
      bubbles: true, composed: true
    });
  }

  openEvent() {
    return new CustomEvent('arrow-open', {
      bubbles: true, composed: true
    });
  }

  connectedCallback() {
    this.select('.right-arrow').setAttribute('hidden', '');

    this.select('.right-arrow').addEventListener('click', () => {
      this.dispatchEvent(this.openEvent());
    });

    this.select('.down-arrow').addEventListener('click', () => {
      this.dispatchEvent(this.closeEvent());
    });
  }
}

class GetEnvEvent extends CustomEvent {
  constructor(handler) {
    super(GetEnvEvent.TYPE, {
      bubbles: true,
      composed: true,
      detail: {
        handler: handler
      }
    });
  }
}
GetEnvEvent.TYPE = 'get-env';


class PropertyComment extends HTMLElement {
  constructor() {
    super();
    addSelectMethods(this);
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
    <style> 
      :host{
        display: block;
        color: green;
        padding-left: 20px;
      }

      :host([hidden]){
        display: none;
      }
      pre{
        font-size: 16px;
        margin: 0;
        padding: 0; 
      }
    </style>
    <div id="root"></div>
    <pre>/**</pre>
    <pre id="contents">comment</pre>
    <pre>*/</pre>
`
  }

  set schema(s) {
    let text = this.select('#contents').textContent = s.description;
  }

  updateUi() {
    if (!this._env) {
      return;
    }

    if (this._env.showComments) {
      this.removeAttribute('hidden');
    } else {
      this.setAttribute('hidden', '');
    }
  }

  setEnv(e) {
    this._env = e;
    e.addEventListener('updated', this.updateUi.bind(this));
    this.updateUi();
  }

  connectedCallback() {
    this.dispatchEvent(new GetEnvEvent(this.setEnv.bind(this)));
  }
}

class PropertyName extends HTMLElement {
  constructor() {
    super();
    this.select = select(this);
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .required{
          color: red; 
          padding-left: 4px;
        }

        .content{
          padding-left: 10px;
        }

        open-close-arrow[hidden]{
          opacity: 0.0;
          display: inline-block;
        }
        
        open-close-arrow{
          display: inline-block;
          opacity: 1.0;
        }
        
        label, span{
          vertical-align: top;
        }
        
        .holder{
          display: flex;
        }
      </style>
      <div>
        <open-close-arrow hidden></open-close-arrow>
        <label id="name"></label><label>:</label><label id="type"></label><span class="required">*</span>
      </div>
      <div class="content">
        <slot></slot> 
      </div>
    `
  }

  getBooleanAttr(name) {
    let out = this.getAttribute(name);
    return out === 'true' || out === true;
  }

  onClose() {
    this.select('.content').style.display = 'none';
    this.arrow.state('closed');
  }

  onOpen() {
    this.select('.content').style.display = 'block';
    this.arrow.state('open');
  }

  connectedCallback() {
    this.select('#name').textContent = this.getAttribute('name');
    this.select('#type').textContent = this.getAttribute('type');
    let required = this.getBooleanAttr('required');
    if (!required) {
      this.select('.required').style.display = 'none';
    }

    let expandable = this.getBooleanAttr('expandable');
    if (expandable) {
      this.select('open-close-arrow').removeAttribute('hidden');
    }


    this.arrow = this.select('open-close-arrow');
    this.arrow.addEventListener('arrow-close', this.onClose.bind(this));
    this.arrow.addEventListener('arrow-open', this.onOpen.bind(this));
  }
}

class JsonSchemaObject extends HTMLElement {
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

  connectedCallback() {
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