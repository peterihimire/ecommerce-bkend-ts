class BaseError extends Error {
  constructor(
    public message: string,
    public errorCode: number
  ) // public code: number
  {
    super(message);
    this.errorCode = errorCode;
    Error.captureStackTrace(this);
  }
}
export default BaseError;
