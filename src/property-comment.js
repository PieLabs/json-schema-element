import { select, selectAll, addSelectMethods } from './utils';
import { GetEnvEvent } from './events';


function comment(template, ...expressions) {
  let result = template.reduce((accumulator, part, i) => {
    return accumulator + expressions[i - 1] + part;
  });
  let out = result.replace(/^/gm, ' * ');
  return `/**
${out}
 */`;
}


export default class PropertyComment extends HTMLElement {
  constructor() {
    super();
    addSelectMethods(this);
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
    <style> 
      :host{
        display: block;
        color: var(--json-schema-comment-color, green);
        padding-left: 20px;
      }

      :host([hidden]){
        display: none;
      }
      pre{
        font-size: 16px;
          font-family: var(--json-schema-font, 'Roboto Mono', monospace);
        margin: 0;
        padding: 0; 
      }
    </style>
    <pre></pre>
`
  }

  set schema(s) {
    let text = s.description;
    if (s.example) {
      text += '\nexample:' + s.example;
    }

    if (text) {
      this.select('pre').textContent = comment`${text}`;
    } else {
      this.select('pre').textContent = '';
    }
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
