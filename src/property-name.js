import { select, selectAll, addSelectMethods } from './utils';
import { GetEnvEvent } from './events';

export default class PropertyName extends HTMLElement {
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
    if (this._expandable) {
      this.select('.content').style.display = 'block';
      this.arrow.state('open');
    }
  }

  connectedCallback() {
    this.select('#name').textContent = this.getAttribute('name');
    this.select('#type').textContent = this.getAttribute('type');
    let required = this.getBooleanAttr('required');
    if (!required) {
      this.select('.required').style.display = 'none';
    }

    this._expandable = this.getBooleanAttr('expandable');
    if (this._expandable) {
      this.select('open-close-arrow').removeAttribute('hidden');
    } else {
      this.select('.content').setAttribute('hidden', '');
    }


    this.arrow = this.select('open-close-arrow');
    this.arrow.addEventListener('arrow-close', this.onClose.bind(this));
    this.arrow.addEventListener('arrow-open', this.onOpen.bind(this));

    this.dispatchEvent(new GetEnvEvent((e) => {
      e.addEventListener('expand', this.onOpen.bind(this));
      e.addEventListener('collapse', this.onClose.bind(this));
    }));
  }
}
