import env from '@/env'
import { prisma } from '@/integrations/database/config.js'
import { betterAuth, type BetterAuthPlugin } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI } from 'better-auth/plugins'

const plugins: BetterAuthPlugin[] = []

if (env.NODE_ENV !== 'production') {
  plugins.push(openAPI({ disableDefaultReference: true }))
}

export const auth = betterAuth({
  basePath: '/auth',
  trustedOrigins: [env.FRONTEND_URL],
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  plugins,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
})
