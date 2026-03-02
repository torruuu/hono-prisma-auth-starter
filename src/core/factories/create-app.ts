import pinoLogger from '@/core/logging/pino-logger.js'
import defaultHook from '@/core/openapi/default-hook.js'
import env from '@/env'
import { auth } from '@/integrations/auth/config.js'
import notFound from '@/shared/middlewares/not-found.js'
import onError from '@/shared/middlewares/on-error.js'
import {
  OpenAPIHono,
  type RouteHandler as HonoRouteHandler,
  type RouteConfig,
} from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { requestId } from 'hono/request-id'

export type AppEnv = {
  Bindings?: object
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}

export type RouteHandler<R extends RouteConfig> = HonoRouteHandler<R, AppEnv>

export function createRouter() {
  return new OpenAPIHono<AppEnv>({ defaultHook })
}

export function createApp() {
  const app = createRouter()

  app
    .use(requestId())
    .use(pinoLogger())
    .use(
      '*',
      cors({
        origin: env.FRONTEND_URL,
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['POST', 'GET', 'OPTIONS'],
        exposeHeaders: ['Content-Length'],
        maxAge: 600,
        credentials: true,
      }),
    )

  app.notFound(notFound)
  app.onError(onError)

  app.use('*', async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    c.set('user', session?.user ?? null)
    c.set('session', session?.session ?? null)
    await next()
  })

  app.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))

  return app
}
