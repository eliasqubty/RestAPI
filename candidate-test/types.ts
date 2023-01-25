export interface ConfigProvider {
  baseUrl: string;
  defaultTimeout: number;
}

export interface NetworkResponse<T> {
  serverError?: string;
  data?: T;
  status: number;
}


export enum HttpMethod {
  GET = 'GET',
  DELETE = 'DELETE',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
}

export interface NetworkOptions {
  timeout?: number;
}

export interface RequestOptions extends NetworkOptions {
  url: string;
  method: HttpMethod;
  data?: object;
  queryParams?: object;
  headers?: object;
}
