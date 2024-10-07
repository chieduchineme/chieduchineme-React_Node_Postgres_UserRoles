// src/Main.scala

import cats.effect._
import org.http4s.blaze.server.BlazeServerBuilder
import org.http4s.implicits._
import services.{UserService, AuthService, RoleService}
import routes.{UserRoutes, AuthRoutes, RoleRoutes}
import scala.concurrent.ExecutionContext.global

object Main extends IOApp {
  def run(args: List[String]): IO[ExitCode] = {
    val userService = new UserService()
    val authService = new AuthService()
    val roleService = new RoleService()

    val userRoutes = new UserRoutes(userService).routes
    val authRoutes = new AuthRoutes(authService).routes
    val roleRoutes = new RoleRoutes(roleService).routes

    val httpApp = (userRoutes <+> authRoutes <+> roleRoutes).orNotFound

    BlazeServerBuilder[IO](global)
      .bindHttp(8080, "localhost")
      .withHttpApp(httpApp)
      .serve
      .compile
      .drain
      .as(ExitCode.Success)
  }
}