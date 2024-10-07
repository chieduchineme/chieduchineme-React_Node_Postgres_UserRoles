// src/controllers/AuthController.scala

import cats.effect.Sync
import org.http4s.{Request, Response}
import org.http4s.dsl.Http4sDsl
import org.http4s.HttpRoutes
import io.circe.generic.auto._
import io.circe.syntax._
import services.{AuthService, TokenService}

case class LoginRequest(token: String)

object AuthController {
  def routes[F[_]: Sync](authService: AuthService[F], tokenService: TokenService[F]): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}
    import dsl._

    HttpRoutes.of[F] {
      // Google login route
      case req @ POST -> Root / "auth" / "google" =>
        for {
          loginRequest <- req.as[LoginRequest]
          userInfo <- tokenService.verifyGoogleToken(loginRequest.token).handleError(_ => None)
          response <- userInfo match {
            case Some((email, name)) =>
              for {
                user <- authService.handleOAuthLogin(email, name)
                _ = req.attributes.insert(UserSessionAttr, user) // Assume UserSessionAttr stores session info
                resp <- Ok(user.asJson)
              } yield resp
            case None => BadRequest("Please sign up with Google")
          }
        } yield response

      // Microsoft login route
      case req @ POST -> Root / "auth" / "microsoft" =>
        for {
          loginRequest <- req.as[LoginRequest]
          userInfo <- tokenService.verifyMicrosoftToken(loginRequest.token).handleError(_ => None)
          response <- userInfo match {
            case Some((email, name)) =>
              for {
                user <- authService.handleOAuthLogin(email, name)
                _ = req.attributes.insert(UserSessionAttr, user) // Assume UserSessionAttr stores session info
                resp <- Ok(user.asJson)
              } yield resp
            case None => BadRequest("Please sign up with Microsoft")
          }
        } yield response

      // Logout route
      case DELETE -> Root / "auth" / "logout" =>
        req.attributes.remove(UserSessionAttr) // Clear the session data
        Ok("Logged out successfully")
    }
  }
}
