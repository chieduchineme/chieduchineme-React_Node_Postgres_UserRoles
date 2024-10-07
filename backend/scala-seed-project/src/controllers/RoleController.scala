// src/controllers/RoleController.scala

import cats.effect.Sync
import org.http4s.{Request, Response}
import org.http4s.dsl.Http4sDsl
import org.http4s.HttpRoutes
import io.circe.generic.auto._
import io.circe.syntax._
import services.RoleService

case class CreateRoleRequest(name: String, permissions: List[String])
case class RoleIdsRequest(roleIds: List[Int])
case class ChangeRoleRequest(newName: String)
case class ChangePermissionsRequest(newPermissions: List[String])

object RoleController {
  def routes[F[_]: Sync](roleService: RoleService[F]): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}
    import dsl._

    HttpRoutes.of[F] {
      // Create role handler
      case req @ POST -> Root / "roles" =>
        for {
          createRoleRequest <- req.as[CreateRoleRequest]
          newRole <- roleService.createRole(createRoleRequest.name, createRoleRequest.permissions)
          resp <- Ok(newRole.asJson)
        } yield resp

      // Delete roles handler
      case req @ DELETE -> Root / "roles" =>
        for {
          roleIdsRequest <- req.as[RoleIdsRequest]
          _ <- roleService.deleteRoles(roleIdsRequest.roleIds)
          resp <- Ok("Roles deleted successfully")
        } yield resp

      // Change role name handler
      case req @ PUT -> Root / "roles" / IntVar(roleId) =>
        for {
          changeRoleRequest <- req.as[ChangeRoleRequest]
          updatedRole <- roleService.changeRoleName(roleId, changeRoleRequest.newName)
          resp <- Ok(updatedRole.asJson)
        } yield resp

      // Change role permissions handler
      case req @ PATCH -> Root / "roles" / IntVar(roleId) =>
        for {
          changePermissionsRequest <- req.as[ChangePermissionsRequest]
          updatedRole <- roleService.changeRolePermissions(roleId, changePermissionsRequest.newPermissions)
          resp <- Ok(updatedRole.asJson)
        } yield resp

      // Get all roles handler
      case GET -> Root / "roles" =>
        for {
          roles <- roleService.getAllRoles()
          resp <- Ok(roles.asJson)
        } yield resp
    }
  }
}
