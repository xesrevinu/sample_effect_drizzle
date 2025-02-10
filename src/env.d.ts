/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { SqlError } from "@effect/sql/SqlError"
import type * as Effect from "effect/Effect"

declare module "drizzle-orm" {
  export interface QueryPromise<T> extends Effect.Effect<T, SqlError> {}
}
