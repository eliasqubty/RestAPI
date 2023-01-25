import { StatusCodes } from 'http-status-codes'

// TODO: collect all diffrent ApiErrorCode to an API
enum ApiErrorCode {
  // Common
  Unspecified = 1000,
  Misconfiguration = 1001,
  ActionIsNotAllowed = 1002,
  InternalServerError = 1003,
  BadRequest = 1004,
  InvalidQuery = 1005,
  InvalidAuthToken = 1006,

  // Auth
  InvalidEmailOrPassword = 2001,
  InvalidLoginRequest = 2002,
  InvalidLoginToken = 2003,
  CannotRefreshToken = 2004,
  InvalidResetToken = 2005,
  AdminAlreadyExists = 2006,
}

interface ApiErrorMessage {
  errorMessage?: string
  errorCode?: ApiErrorCode
  status?: StatusCodes
  stackTrace?: string
}

class ApiError extends Error {
  public status: StatusCodes
  public errorCode: ApiErrorCode
  public stackTrace?: string

  constructor({ errorMessage, errorCode = ApiErrorCode.Unspecified, status = StatusCodes.INTERNAL_SERVER_ERROR, stackTrace }: ApiErrorMessage = {}) {
    super(errorMessage)
    this.errorCode = errorCode
    this.status = status
    this.stackTrace = stackTrace
  }
}

export { ApiError, ApiErrorCode }
