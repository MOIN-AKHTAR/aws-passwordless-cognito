export class HttpException extends Error {
  public status: number;
  public message: string;
  public error: string;

  constructor(status: number, message: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.error = message;
  }
}
