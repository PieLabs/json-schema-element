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
       
       .info{
         font-style: italic;
       }

       .asterisk{
         color: red;
       }

        button {
          font-family: 'Roboto Mono', monospaced;
          text-decoration: none;
          color: var(--json-schema-button-label-color, white);
          background-color: var(--json-schema-button-bg, #7CB342);
          text-align: center;
          letter-spacing: .5px;
          transition: .2s ease-out;
          cursor: pointer;
          outline: 0;
          border: none;
          margin: 0;
          padding: 4px;
          padding-right: 10px;
          padding-left: 10px;

        }       
        
        button:hover {
          background-color: var(--json-schema-bg-hover,#689F38);
        }
    </style>
    <label>
      <input type="checkbox"></input> Show Comments
    </label>
    <button id="expand">Expand All</button>
    <button id="collapse">Collapse All</button>
    <label class="info"><span class="asterisk">*</span> = required</label>
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

    this.select('#expand').addEventListener('click', (e) => {
      this._env.dispatchEvent({ type: 'expand' });
    });

    this.select('#collapse').addEventListener('click', (e) => {
      this._env.dispatchEvent({ type: 'collapse' });
    });
  }
}
