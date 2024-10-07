// src/config/SyncWithDb.scala
package config

import cats.effect._
import doobie.implicits._
import doobie.hikari.HikariTransactor
import org.log4s.getLogger

object SyncWithDb {
  private val logger = getLogger

  // SQL for creating tables, similar to Sequelize's sync feature
  private val createUsersTable = sql"""
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      role VARCHAR(50) DEFAULT 'regular'
    );
  """.update.run

  private val createRolesTable = sql"""
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL,
      permissions TEXT[]
    );
  """.update.run

  def syncDatabase[F[_]: Async: ContextShift](xa: HikariTransactor[F]): F[Unit] = {
    (for {
      _ <- createUsersTable.transact(xa)
      _ <- createRolesTable.transact(xa)
    } yield ()).attempt.flatMap {
      case Right(_) => Sync[F].delay(logger.info("Database synchronized successfully"))
      case Left(e)  => Sync[F].delay(logger.error(e)("Database synchronization failed"))
    }
  }
}
