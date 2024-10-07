// src/services/RoleService.scala

import cats.effect.IO

object RoleService {

  def createRole(name: String, permissions: List[String]): IO[Role] = {
    for {
      _ <- IO.raiseError(new Exception("Invalid input: name and permissions must be provided"))
      existingRoleOpt <- RoleRepository.findByName(name)
      _ <- IO.fromOption(existingRoleOpt)(new Exception(s"Role with name $name already exists"))
      newRole <- RoleRepository.create(Role(None, name, permissions))
    } yield newRole
  }

  def deleteRoles(roleIds: List[Int]): IO[Int] = {
    RoleRepository.delete(roleIds)
  }

  def changeRoleName(roleId: Int, newName: String): IO[Option[Role]] = {
    RoleRepository.changeName(roleId, newName)
  }

  def changeRolePermissions(roleId: Int, newPermissions: List[String]): IO[Option[Role]] = {
    RoleRepository.changePermissions(roleId, newPermissions)
  }

  def getAllRoles(): IO[List[Role]] = {
    RoleRepository.findAll()
  }
}
