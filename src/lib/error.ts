class BaseError {
  constructor (public message: string) {
    Error.call(this, message);
  }
}
BaseError.prototype = new Error();

export class DecodeError extends BaseError {}

export class DecodeErrorWithPath extends DecodeError {
  public path: (string|number)[];
  public leafError: DecodeError;

  constructor(message: string, path: (string|number)[], leafError: DecodeError) {
    super(message);
    this.path = path;
    this.leafError = leafError;
  }
}
