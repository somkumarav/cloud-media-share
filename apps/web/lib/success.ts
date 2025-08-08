class SuccessResponse<T = unknown> {
  status: true;
  code: number;
  data?: T;
  message: string;
  constructor(message: string, code: number, data?: T) {
    this.message = message;
    this.status = true;
    this.code = code;
    this.data = data;
  }
  serialize() {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      data: this.data as T,
    };
  }
}
export type SuccessResponseType<T = unknown> = {
  status: true;
  code: number;
  message: string;
  data?: T;
};
export { SuccessResponse };
