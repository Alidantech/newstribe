import { Response } from "express";

export class ApiResponse {
  private statusCode: number;
  private message: string;
  private data: any;

  constructor(statusCode: number, message: string = "", data: any = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  /**
   * Set the status code
   */
  setStatusCode(statusCode: number): this {
    this.statusCode = statusCode;
    return this;
  }

  /**
   * Set the message
   */
  setMessage(message: string): this {
    this.message = message;
    return this;
  }

  /**
   * Set the data
   */
  setData(data: any): this {
    this.data = data;
    return this;
  }

  /**
   * Send the response
   */
  send(res: Response): void {
    let response: any = {
      success: this.statusCode >= 200 && this.statusCode < 300,
    };

    if (this.message) {
      response.message = this.message;
    }

    // spread the data into response
    if (this.data !== null) {
      response = {
        ...response,
        ...this.data,
      };
    }

    res.status(this.statusCode).json(response);
  }

  /**
   * Success response
   */
  static success(
    res: Response,
    data: any = null,
    message: string = "Operation successful",
    statusCode: number = 200
  ): void {
    new ApiResponse(statusCode, message, data).send(res);
  }

  /**
   * Error response
   */
  static error(
    res: Response,
    message: string = "Operation failed",
    statusCode: number = 400,
    data: any = null
  ): void {
    new ApiResponse(statusCode, message, data).send(res);
  }

  /**
   * Created response
   */
  static created(
    res: Response,
    data: any,
    message: string = "Resource created successfully"
  ): void {
    new ApiResponse(201, message, data).send(res);
  }

  /**
   * Not found response
   */
  static notFound(
    res: Response,
    message: string = "Resource not found",
    data: any = null
  ): void {
    new ApiResponse(404, message, data).send(res);
  }

  /**
   * Bad request response
   */
  static badRequest(
    res: Response,
    message: string = "Bad request",
    data: any = null
  ): void {
    new ApiResponse(400, message, data).send(res);
  }

  /**
   * Unauthorized response
   */
  static unauthorized(
    res: Response,
    message: string = "Unauthorized",
    data: any = null
  ): void {
    new ApiResponse(401, message, data).send(res);
  }

  /**
   * Forbidden response
   */
  static forbidden(
    res: Response,
    message: string = "Forbidden",
    data: any = null
  ): void {
    new ApiResponse(403, message, data).send(res);
  }

  /**
   * Server error response
   */
  static serverError(
    res: Response,
    message: string = "Internal server error",
    data: any = null
  ): void {
    new ApiResponse(500, message, data).send(res);
  }
}
