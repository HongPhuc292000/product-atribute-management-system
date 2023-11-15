import { HttpStatus } from '@nestjs/common';

export class ResponseData<D> {
  data: D | D[];
  statusCode: number;
  message: string;

  constructor(data?: D | D[], statusCode?: number, message?: string) {
    this.data = data || ('ok' as D);
    this.statusCode = statusCode || HttpStatus.OK;
    this.message = message || 'Success';

    return this;
  }
}

export class ListResponseData<T> extends ResponseData<T> {
  page: number;
  size: number;
  total?: number;

  constructor(
    data: T[],
    page: number,
    size: number,
    total: number,
    statusCode?: number,
    message?: string,
  ) {
    super(data, statusCode, message);

    this.page = page;
    this.size = size;
    this.total = total;

    return this;
  }
}
