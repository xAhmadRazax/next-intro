import { PublicUserType } from "@/db/schema"

export type AuthReqType = Request & { user: PublicUserType }
