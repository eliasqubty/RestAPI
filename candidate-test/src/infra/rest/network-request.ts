import qs from 'qs'
import _ from 'lodash'
import fetch from 'cross-fetch'
import urljoin from 'url-join'
import { v4 as uuidv4 } from 'uuid'
import { ApiError, ApiErrorCode } from './api-errors'
import { StatusCodes } from 'http-status-codes'
import { isJson } from './rest-utils'
import { convertAllDatesInObjectRecursive } from './rest-utils'
import { ApiResponse } from './api-response'

enum HttpMethod {
  GET = 'GET',
  DELETE = 'DELETE',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
}



interface RequestConfig {
  url: string
  method: HttpMethod
  body?: object
  queryParams?: object
  headers?: Record<string, string>
  timeout?: number
  autoRefreshToken?: boolean,
}

const defaultConfig: RequestConfig = {
  method: HttpMethod.GET,
  url: null as any,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  autoRefreshToken: true,
}

const networkRequest = async<T>(config: RequestConfig): Promise<ApiResponse<T>> => {
  config = mergeConfigs(config)
  let headers = config.headers ?? {}
  // Correlation id is used inside services to follow the request when it passes inside the system
  headers['X-Correlation-Id'] = uuidv4()

  const url = config.queryParams ? urljoin(config.url, `?${qs.stringify(config.queryParams)}`) : config.url
  const body = config.body ? JSON.stringify(config.body) : undefined
  const abortController = new AbortController()
  const response: Response = await Promise.race([
    fetch(url, {
      method: config.method,
      headers,
      body,
      signal: abortController.signal,
    }),
    new Promise<Response>((_, reject) =>
      setTimeout(() => {
        abortController.abort()
        return reject(new ApiError({ errorMessage: `request to ${config.url} has timed out`, status: StatusCodes.REQUEST_TIMEOUT }))
      }, config.timeout),
    ),
  ])

  const responseText = await response.text()
  const isResponseJson = isJson(responseText)

  // fetch throws error only upon actual network error, 4xx & 5xx responses do not throw
  if (!response.ok) {
    if (isResponseJson) {
      const errorResponse = JSON.parse(responseText) as ApiResponse<any>
      return errorResponse
    } else {
      const errorResponse: ApiResponse<any> = {
        success: false,
        error: `An unknown error with status code ${response.status} has occured`,
        status: response.status
      }
      return errorResponse
    }
  }

  if (isResponseJson) {
    const responseJson = convertAllDatesInObjectRecursive(JSON.parse(responseText))
    responseJson.status = response.status
    return responseJson
  }
  return null as any
  // return isResponseJson ? JSON.parse(responseText) : null
}

const mergeConfigs = (requestConfig: RequestConfig): RequestConfig => {
  let defaultConfigForMerge = defaultConfig
  if ('headers' in requestConfig && requestConfig.headers && 'Content-Type' in requestConfig.headers) {
    defaultConfigForMerge = _.cloneDeep(defaultConfig)
    if (defaultConfigForMerge && defaultConfigForMerge.headers) {
      delete defaultConfigForMerge.headers['Content-Type']
    }
  }
  return _.merge({}, defaultConfigForMerge, requestConfig)
}

export default { networkRequest, HttpMethod }
