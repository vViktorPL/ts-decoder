export class DecodeError extends Error {}

export class DecodeTypeError extends Error {}

export class DecodeErrorWithPath extends DecodeError {
  public path: (string|number)[];
  public leafError: DecodeError;

  constructor(message: string, path: (string|number)[], leafError: DecodeError) {
    super(message);
    this.path = path;
    this.leafError = leafError;
  }
}

export class DecodeRefinementError extends DecodeError {
  constructor(message: string, public refinementName?: string) {
    super(message);
  }
}
