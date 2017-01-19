export let addSelectMethods = (context) => {
  context.select = select(context);
  context.selectAll = selectAll(context);
}

export let selectAll = (context) => {
  return function (selector) {
    return this.shadowRoot.querySelectorAll(selector);
  }.bind(context);
}

export let select = (context) => {
  return function (selector) {
    return this.shadowRoot.querySelector(selector);
  }.bind(context);
}
