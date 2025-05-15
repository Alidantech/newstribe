/**
 * A higher-order function that wraps an asynchronous function and catches any errors that occur during its execution.
 * If an error is caught, it passes the error to the next middleware in the Express.js stack.
 *
 * @param fn - The asynchronous function to be wrapped. It should accept three arguments: req, res, and next.
 * @returns A new function that wraps the provided asynchronous function and handles any errors by passing them to the next middleware.
 */
export let catchAsyncError = (
  fn: (arg0: any, arg1: any, arg2: any) => Promise<any>
) => {
  return (req: any, res: any, next: (arg0: any) => any) => {
    fn(req, res, next).catch((err: any) => {
      console.error(err);
      next(err);
    });
  };
};
