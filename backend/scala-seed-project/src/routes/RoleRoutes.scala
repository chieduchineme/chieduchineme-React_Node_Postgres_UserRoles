// src/routes/RoleRoutes.scala

import cats.effect._
import org.http4s._
import org.http4s.dsl.Http4sDsl
import org.http4s.HttpRoutes
import services.RoleService
import middleware.AuthMiddleware

class RoleRoutes(roleService: RoleService)(implicit F: Sync[IO]) extends Http4sDsl[IO] {
  private val authMiddleware = new AuthMiddleware()

  val routes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case req @ POST -> Root as user if authMiddleware.isAuthenticated(user) && authMiddleware.authorize(user, "createRole") =>
      for {
        roleData <- req.as[Role] // Assuming Role case class exists
        role <- roleService.createRole(roleData.name, roleData.permissions)
        response <- Ok(role)
      } yield response

    case DELETE -> Root / roleId as user if authMiddleware.isAuthenticated(user) && authMiddleware.authorize(user, "deleteRole") =>
      for {
        deletedCount <- roleService.deleteRoles(List(roleId.toInt))
        response <- Ok(s"Deleted $deletedCount roles.")
      } yield response

    case PATCH -> Root / roleId / "name" as user if authMiddleware.isAuthenticated(user) && authMiddleware.authorize(user, "changeRoleName") =>
      for {
        newName <- req.as[String] // Assuming new name is sent in the request body
        role <- roleService.changeRoleName(roleId.toInt, newName)
        response <- Ok(role)
      } yield response

    case PATCH -> Root / roleId / "permissions" as user if authMiddleware.isAuthenticated(user) && authMiddleware.authorize(user, "changeRolePermissions") =>
      for {
        newPermissions <- req.as[List[String]] // Assuming new permissions are sent in the request body
        role <- roleService.changeRolePermissions(roleId.toInt, newPermissions)
        response <- Ok(role)
      } yield response

    case GET -> Root as user if authMiddleware.isAuthenticated(user) && authMiddleware.authorize(user, "viewRoles") =>
      for {
        roles <- roleService.getAllRoles
        response <- Ok(roles)
      } yield response
  }
}
