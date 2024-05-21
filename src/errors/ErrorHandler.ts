export abstract class ErrorHandler extends Error {
  constructor(public message: string) {
    super(message);
  }
  abstract status: number;

  abstract serialize(): { message: string };
}
