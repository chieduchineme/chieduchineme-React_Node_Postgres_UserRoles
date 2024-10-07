// src/controllers/UserController.scala

import cats.effect.Sync
import org.http4s.{Request, Response}
import org.http4s.dsl.Http4sDsl
import org.http4s.HttpRoutes
import io.circe.generic.auto._
import io.circe.syntax._
import services.UserService

case class CreateUserRequest(email: String, name: String, role: String)
case class UserIdsRequest(userIds: List[Int])
case class ChangeUserRoleRequest(role: String)

object UserController {
  def routes[F[_]: Sync](userService: UserService[F]): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}
    import dsl._

    HttpRoutes.of[F] {
      // Create user handler
      case req @ POST -> Root / "users" =>
        for {
          createUserRequest <- req.as[CreateUserRequest]
          user <- userService.addUser(createUserRequest.email, createUserRequest.name, createUserRequest.role)
          resp <- Ok(user.asJson)
        } yield resp

      // Remove users handler
      case req @ DELETE -> Root / "users" =>
        for {
          userIdsRequest <- req.as[UserIdsRequest]
          _ <- userService.deleteUsers(userIdsRequest.userIds)
          resp <- Ok("Users deleted successfully")
        } yield resp

      // Get user by email handler
      case req @ GET -> Root / "users" / email =>
        for {
          user <- userService.findUserByEmail(email)
          resp <- Ok(user.asJson)
        } yield resp

      // Change user role handler
      case req @ PUT -> Root / "users" / IntVar(userId) =>
        for {
          changeUserRoleRequest <- req.as[ChangeUserRoleRequest]
          _ <- userService.assignRoleToUser(userId, changeUserRoleRequest.role)
          resp <- Ok("Role updated successfully")
        } yield resp

      // Fetch all users handler
      case GET -> Root / "users" =>
        for {
          users <- userService.getUsers()
          resp <- Ok(users.asJson)
        } yield resp
    }
  }
}
