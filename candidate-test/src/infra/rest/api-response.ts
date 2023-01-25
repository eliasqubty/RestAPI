interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  status: number
}

export { ApiResponse }
