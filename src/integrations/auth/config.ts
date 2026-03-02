import env from '@/env'
import { prisma } from '@/integrations/database/config.js'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI } from 'better-auth/plugins'

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
  plugins: [
    openAPI({
      disableDefaultReference: true,
    }),
  ],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
})
