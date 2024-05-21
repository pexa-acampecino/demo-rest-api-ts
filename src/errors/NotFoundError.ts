import { ErrorHandler } from "./ErrorHandler";

export class NotFoundError extends ErrorHandler {
  status = 404;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialize() {
    return { message: this.message };
  }
}
