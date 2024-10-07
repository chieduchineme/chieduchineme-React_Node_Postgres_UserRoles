// src/models/User.scala

import slick.jdbc.PostgresProfile.api._
import slick.lifted.{ProvenShape, Tag}

case class User(id: Option[Int], name: String, email: String, role: String)

class Users(tag: Tag) extends Table[User](tag, "users") {
  def id: Rep[Int] = column[Int]("id", O.PrimaryKey, O.AutoInc)
  def name: Rep[String] = column[String]("name")
  def email: Rep[String] = column[String]("email")
  def role: Rep[String] = column[String]("role")

  // Mapping the shape of the User
  def * : ProvenShape[User] = (id.?, name, email, role) <> ((User.apply _).tupled, User.unapply)
}

object User {
  val users = TableQuery[Users]
}
