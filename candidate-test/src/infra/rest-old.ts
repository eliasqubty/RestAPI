import Axios, { AxiosRequestConfig, ResponseType } from 'axios';
import { ConfigProvider, NetworkResponse, RequestOptions } from '../../types';

export class Rest {
  readonly config: ConfigProvider;

  constructor(config: ConfigProvider) {
    this.config = config;
  }

  private async getAxiosOptions(
    config: ConfigProvider,
    {
      method,
      data,
      queryParams,
      timeout,
      headers
    }: RequestOptions,
  ): Promise<AxiosRequestConfig> {
    const options = {
      method,
      headers: headers,
      responseType: 'json' as ResponseType,
      baseURL: config.baseUrl.replace(/\/$/, ''),
      data,
      params: queryParams,
      timeout: timeout || config.defaultTimeout,
    }

    return options;
  }

  private errorAsNetworkResponse<T>(error: any): NetworkResponse<T> {
    
      let networkResponse : NetworkResponse<T> = error;
      if (error.response.data) {
        networkResponse = {
        serverError: error.response.data.error,
              status: error.response.status           
        } 
      }
      return networkResponse;
    
  }

  async request<T>(options: RequestOptions): Promise<NetworkResponse<T>> {
    const axiosOptions = await this.getAxiosOptions(this.config, options);
    const response = Axios(options.url, axiosOptions);

    return new Promise<NetworkResponse<T>>((resolve, reject) => {
      response
        .then((result : any) => {
          const networkResponse = {
            data: result.data,
            status: result.status
          } as NetworkResponse<T>;
          resolve(networkResponse);
        })
        .catch(error => {
          const networkResponse = this.errorAsNetworkResponse<T>(error);
          resolve(networkResponse);
        });
    });
  }
}
