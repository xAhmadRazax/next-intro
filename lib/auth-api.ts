import { BASEURL } from "@/constants/constants"
import { ApiError } from "./apiError"

export async function loginApi({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const res = await fetch(`${BASEURL}/auth/login`, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }

  return await res.json()
}

export async function changePasswordApi({
  currentPassword,
  password,
}: {
  currentPassword: string
  password: string
}) {
  const res = await fetch(`${BASEURL}/auth/change-password`, {
    headers: {
      "content-type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({ currentPassword, password }),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }

  return await res.json()
}

export async function logoutApi() {
  const res = await fetch(`${BASEURL}/auth/logout`, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  })

  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }
}

export async function forgotPasswordApi({ email }: { email: string }) {
  const res = await fetch(`${BASEURL}/auth/forgot-password`, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }
}

export async function isResetPasswordTokenValid(token: string) {
  const res = await fetch(`${BASEURL}/auth/reset-password/${token}`, {
    headers: {
      "content-type": "application/json",
    },
    method: "GET",
  })
  if (!res.ok) {
    // const data = await res.json()
    // throw data // throw the actual error object from the server
    return { isTokenValid: false }
  }
  return { isTokenValid: true }
}

export async function isSetupAccountPasswordTokenValid(token: string) {
  const res = await fetch(`${BASEURL}/auth/set-password/${token}`, {
    headers: {
      "content-type": "application/json",
    },
    method: "GET",
  })

  // console.log(res, "response")
  if (!res.ok) {
    // const data = await res.json()
    // throw data // throw the actual error object from the server
    return { isTokenValid: false }
  }
  return { isTokenValid: true }
}

export async function meApi() {
  const res = await fetch(`${BASEURL}/users/me`, {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  })

  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }

  return await res.json()
}
