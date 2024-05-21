import { ErrorHandler } from "./ErrorHandler";

export class BadRequestError extends ErrorHandler {
  status: number = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serialize(): { message: string } {
    return { message: this.message };
  }
}
