// src/middleware/authenticateMiddleware.scala

import cats.effect.Sync
import org.http4s.{Request, Response}
import org.http4s.dsl.Http4sDsl
import org.http4s.headers.Authorization
import org.http4s.HttpRoutes

object AuthenticateMiddleware {
  def isAuthenticated[F[_]: Sync](routes: HttpRoutes[F]): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}
    import dsl._

    HttpRoutes.of[F] {
      case req if req.headers.get(Authorization).isEmpty =>
        Forbidden("Unauthorized: Please log in first.")

      case req =>
        // Here we would check if the session user exists
        val sessionUser = req.attributes.get(UserSessionAttr) // Assume UserSessionAttr is defined to get session
        sessionUser match {
          case Some(_) => routes(req) // Call the next route if authenticated
          case None => Forbidden("Unauthorized: Please log in first.")
        }
    }
  }
}
