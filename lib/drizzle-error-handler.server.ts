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
      const match = error.detail.match(/Key \((.+)\)=\((.+)\) already exists/)
      const field = match?.[1] ?? error.constraint ?? "unknown"
      const message = match
        ? `${match[1]} "${match[2]}" is already used.`
        : error.detail

      return Response.json(
        {
          error: "Duplicate entry",
          fields: { [field]: message }, // ← { email: "email already exists" }
        },
        { status: 409 }
      )
    }

    case "23503": {
      const match = error.detail.match(
        /Key \((.+)\)=\((.+)\) is not present in table "(.+)"/
      )
      const field = match?.[1] ?? "unknown"
      const message = match
        ? `Invalid reference: "${match[2]}" does not exist`
        : error.detail

      return Response.json(
        {
          error: "Related record not found",
          fields: { [field]: message },
        },
        { status: 400 }
      )
    }

    case "23502": {
      const field = error.column ?? "unknown"

      return Response.json(
        {
          error: "Missing required field",
          fields: { [field]: `${field} is required` },
        },
        { status: 400 }
      )
    }

    case "22P02": {
      return Response.json(
        {
          error: "Invalid data format",
        },
        { status: 400 }
      )
    }

    default:
      return null
  }
}
