// src/models/Role.scala

import slick.jdbc.PostgresProfile.api._
import slick.lifted.{ProvenShape, Tag}

case class Role(id: Option[Int], name: String, permissions: List[String])

class Roles(tag: Tag) extends Table[Role](tag, "roles") {
  def id: Rep[Int] = column[Int]("id", O.PrimaryKey, O.AutoInc)
  def name: Rep[String] = column[String]("name")
  def permissions: Rep[List[String]] = column[List[String]]("permissions")

  // Mapping the shape of the Role
  def * : ProvenShape[Role] = (id.?, name, permissions) <> ((Role.apply _).tupled, Role.unapply)
}

object Role {
  val roles = TableQuery[Roles]
}
