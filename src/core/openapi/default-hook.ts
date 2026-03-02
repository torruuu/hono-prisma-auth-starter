import { httpError } from '@/core/errors/http-error-handler.js'
import type { Hook } from '@hono/zod-openapi'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultHook: Hook<unknown, any, string, unknown> = (result, c) => {
  if (!result.success) {
    return httpError(c, 'validation_error', { issues: result.error.issues })
  }
}

export default defaultHook
