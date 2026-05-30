export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public fields?: Record<string, string>
  ) {
    super(message)
    this.name = "ApiError"
    this.fields = fields
  }
}
