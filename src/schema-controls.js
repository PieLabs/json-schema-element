import { select, selectAll, addSelectMethods } from './utils';

export default class SchemaControls extends HTMLElement {
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
