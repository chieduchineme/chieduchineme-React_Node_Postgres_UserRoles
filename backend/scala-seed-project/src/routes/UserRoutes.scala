// src/routes/UserRoutes.scala

import cats.effect._
import org.http4s._
import org.http4s.dsl.Http4sDsl
import org.http4s.HttpRoutes
import org.http4s.circe._
import io.circe.generic.auto._
import services.UserService
import middleware.AuthMiddleware

class UserRoutes(userService: UserService)(implicit F: Sync[IO]) extends Http4sDsl[IO] {
  // Middleware for authentication and authorization
  private val authMiddleware = new AuthMiddleware()

  // Define the routes
  val routes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case req @ POST -> Root as user if authMiddleware.isAuthenticated(user) && authMiddleware.authorize(user, "createUser") =>
      for {
        userData <- req.as[User] // Assuming User case class exists
        user <- userService.addUser(userData.email, userData.name, userData.role)
        response <- Ok(user)
      } yield response

    case DELETE -> Root as user if authMiddleware.isAuthenticated(user) && authMiddleware.authorize(user, "deleteUsers") =>
      // Assuming userIds is a list of IDs sent in the request body
      for {
        userIds <- req.as[List[Int]]
        deletedCount <- userService.deleteUsers(userIds)
        response <- Ok(s"Deleted $deletedCount users.")
      } yield response

    case PATCH -> Root / "role" / userId as user if authMiddleware.isAuthenticated(user) && authMiddleware.authorize(user, "changeUserRole") =>
      for {
        newRole <- req.as[String] // Assuming newRole is sent in the request body
        _ <- userService.assignRoleToUser(userId.toInt, newRole)
        response <- Ok(s"User $userId role changed to $newRole.")
      } yield response

    case GET -> Root as user if authMiddleware.isAuthenticated(user) && authMiddleware.authorize(user, "viewUsers") =>
      for {
        users <- userService.getUsers
        response <- Ok(users)
      } yield response

    case GET -> Root / email as user if authMiddleware.isAuthenticated(user) && authMiddleware.authorize(user, "viewUserByEmail") =>
      for {
        userOpt <- userService.findUserByEmail(email)
        response <- userOpt match {
          case Some(u) => Ok(u)
          case None => NotFound(s"User with email $email not found.")
        }
      } yield response
  }
}
