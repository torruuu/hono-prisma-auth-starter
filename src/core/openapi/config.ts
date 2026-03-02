import packageJSON from '@/../package.json' with { type: 'json' }
import type { OpenAPIHono } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import type { Env } from 'hono'

export default function defineOpenAPI<E extends Env>(app: OpenAPIHono<E>) {
  app.doc('/docs', {
    openapi: '3.0.0',
    info: {
      title: 'Hono Template',
      version: packageJSON.version,
    },
  })

  app.get(
    '/reference',
    Scalar({
      url: '/docs',
      theme: 'deepSpace',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
      agent: {
        disabled: true,
      },
      sources: [
        { url: '/docs', title: 'App' },
        { url: '/auth/open-api/generate-schema', title: 'Auth' },
      ],
    }),
  )
}
