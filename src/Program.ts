/*
import * as Effect from "effect/Effect"

Effect.runPromise(Effect.log("Hello, World!"))
*/
import { SqlClient } from "@effect/sql"
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite"
import { SqliteClient } from "@effect/sql-sqlite-node"
import * as D from "drizzle-orm/sqlite-core"
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy"
import { type Context, Effect, Layer } from "effect"

// setup

const SqlLive = SqliteClient.layer({
  filename: "test.db"
})
const DrizzleLive = SqliteDrizzle.layer.pipe(
  Layer.provide(SqlLive)
)
const DatabaseLive = Layer.mergeAll(SqlLive, DrizzleLive)

// usage

const users = D.sqliteTable("users", {
  id: D.integer("id").primaryKey(),
  name: D.text("name")
})

export const DB = SqliteDrizzle.SqliteDrizzle as unknown as Context.Tag<
  SqliteDrizzle.SqliteDrizzle,
  SqliteRemoteDatabase
>

Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient
  const db = yield* DB
  yield* sql`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)`
  yield* db.delete(users)
  yield* db.insert(users).values({ id: 1, name: "Alice" })
  const results = yield* db.select().from(users)
  console.log(results)
}).pipe(
  Effect.provide(DatabaseLive),
  Effect.runPromise
)
