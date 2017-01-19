export default function SimpleEventTarget() {

  const _listeners = {};

  this.addEventListener = function (name, handler) {
    _listeners[name] = _listeners[name] || [];
    _listeners[name].push(handler);
  }

  this.removeEventListener = function (name, handler) {
    _listeners[name] = _listeners[name] || [];

    if (!(name in _listeners)) {
      return;
    }

    let stack = _listeners[type];

    for (var i = 0, l = stack.length; i < l; i++) {
      if (stack[i] === handler) {
        stack.splice(i, 1);
        return this.removeEventListener(type, handler);
      }
    }
  }

  this.dispatchEvent = function (event) {
    if (!(event.type in _listeners)) {
      return;
    }

    let stack = _listeners[event.type];


    for (var i = 0, l = stack.length; i < l; i++) {
      stack[i].call(this, event);
    }
  }
}