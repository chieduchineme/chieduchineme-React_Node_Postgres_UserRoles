// src/config/DbConfig.scala
package config

import cats.effect._
import doobie._
import doobie.hikari._
import doobie.implicits._
import scala.concurrent.ExecutionContext
import com.typesafe.config.ConfigFactory
import org.log4s.getLogger

object DbConfig {
  private val logger = getLogger

  private val config = ConfigFactory.load() // Load from application.conf (similar to dotenv)

  // Load environment variables
  private val dbName = config.getString("DB_NAME")
  private val dbUser = config.getString("DB_USER")
  private val dbPass = config.getString("DB_PASS")
  private val dbHost = config.getString("DB_HOST")
  private val dbPort = config.getInt("DB_PORT")

  // Create a transactor that manages the PostgreSQL connection
  def transactor[F[_]: Async: ContextShift]: Resource[F, HikariTransactor[F]] = {
    HikariTransactor.newHikariTransactor[F](
      "org.postgresql.Driver",              // Driver class name
      s"jdbc:postgresql://$dbHost:$dbPort/$dbName", // JDBC URL
      dbUser,                               // Username
      dbPass,                               // Password
      ExecutionContext.global               // Execution Context
    )
  }

  // Test the connection
  def testConnection[F[_]: Async: ContextShift](xa: HikariTransactor[F]): F[Unit] = {
    val query = sql"SELECT 1".query[Int].unique.transact(xa)
    query.attempt.flatMap {
      case Right(_) => Sync[F].delay(logger.info("Connected to the PostgreSQL database with Doobie"))
      case Left(e)  => Sync[F].delay(logger.error(e)("Unable to connect to the database"))
    }
  }
}
