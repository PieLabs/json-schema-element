import { select, selectAll, addSelectMethods } from './utils';
import * as icons from './icons';

export default class OpenCloseArrow extends HTMLElement {
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
