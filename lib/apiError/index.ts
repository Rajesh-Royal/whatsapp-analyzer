class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode || 500;
    //  captureStackTrace returns a string that reperesents the location of that particular error in the call. gives us a stack that helps us to find the location of that error in the code. this will help us to find the exact error in our code.
      Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;