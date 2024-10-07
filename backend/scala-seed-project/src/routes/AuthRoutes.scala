
// src/routes/AuthRoutes.scala

import cats.effect._
import org.http4s._
import org.http4s.dsl.Http4sDsl
import org.http4s.HttpRoutes
import services.AuthService

class AuthRoutes(authService: AuthService)(implicit F: Sync[IO]) extends Http4sDsl[IO] {
  val routes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case req @ POST -> Root / "login" / "google" =>
      for {
        token <- req.as[String] // Assuming the token is sent in the request body
        user <- authService.googleLogin(token)
        response <- Ok(user)
      } yield response

    case req @ POST -> Root / "login" / "microsoft" =>
      for {
        token <- req.as[String]
        user <- authService.microsoftLogin(token)
        response <- Ok(user)
      } yield response

    case POST -> Root / "logout" =>
      // Handle logout logic here
      Ok("Logged out successfully.")
  }
}