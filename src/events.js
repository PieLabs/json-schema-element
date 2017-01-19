export class GetEnvEvent extends CustomEvent {
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
