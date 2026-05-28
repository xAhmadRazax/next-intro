// lib/drizzle-error-handler.ts
interface PostgresError {
  code: string
  detail: string
  table?: string
  column?: string
  constraint?: string
}

export function handlePostgresError(err: unknown): Response | null {
  const target =
    typeof err === "object" && err !== null && "cause" in err
      ? (err as { cause: unknown }).cause
      : err

  if (typeof target !== "object" || target === null || !("code" in target)) {
    return null
  }
  const error = target as PostgresError

  switch (error.code) {
    case "23505": {
      // Unique violation
      const match = error.detail.match(/Key \((.+)\)=\((.+)\) already exists/)

      return Response.json(
        {
          error: "Duplicate entry",
          details: {
            field: match?.[1] ?? error.constraint ?? "unknown",
            message: match
              ? `"${match[2]}" is already used in the "${match[1]}" field`
              : error.detail,
            code: "DB_UNIQUE_CONSTRAINT_ERROR",
          },
        },
        { status: 409 }
      )
    }

    case "23503": {
      // Foreign key violation
      const match = error.detail.match(
        /Key \((.+)\)=\((.+)\) is not present in table "(.+)"/
      )

      return Response.json(
        {
          error: "Related record not found",
          details: {
            field: match?.[1] ?? "unknown",
            message: match
              ? `Invalid reference: "${match[2]}" does not exist`
              : error.detail,
            code: "DB_FOREIGN_KEY_ERROR",
          },
        },
        { status: 400 }
      )
    }

    case "23502": {
      // Not null violation
      return Response.json(
        {
          error: "Missing required field",
          details: {
            field: error.column ?? "unknown",
            message: `Missing required value in "${error.column ?? "unknown"}" field`,
            code: "DB_MISSING_REQUIRED_FIELD",
          },
        },
        { status: 400 }
      )
    }

    case "22P02": {
      // Invalid data type
      return Response.json(
        {
          error: "Invalid data format",
          details: {
            message: error.detail ?? "Invalid value format provided",
            code: "DB_INVALID_DATA_TYPE",
          },
        },
        { status: 400 }
      )
    }

    default:
      return null
  }
}
