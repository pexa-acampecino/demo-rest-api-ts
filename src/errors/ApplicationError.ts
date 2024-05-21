import { ErrorHandler } from "./ErrorHandler";

export class ApplicationError extends ErrorHandler {
  status = 500;

  constructor() {
    super("Internal server error");

    Object.setPrototypeOf(this, ApplicationError.prototype);
  }

  serialize(): { message: string } {
    return { message: "Internal server error" };
  }
}
