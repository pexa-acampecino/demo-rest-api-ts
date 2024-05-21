import { ErrorHandler } from "./ErrorHandler";

export class AuthenticationError extends ErrorHandler {
  status: number = 401;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }

  serialize(): { message: string } {
    return { message: this.message };
  }
}
