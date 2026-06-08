import { PublicUserType } from "@/db/schema"

export type ScopeTargets = {
  targetCompanyId?: string
  targetUserId?: string
}

export type ScopeExtractor<TContext> = (
  req: Request,
  context: TContext
) => ScopeTargets | Promise<ScopeTargets>
