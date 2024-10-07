// src/repositories/RoleRepository.scala

import cats.effect.IO
import scalikejdbc._

case class Role(id: Option[Int], name: String, permissions: List[String])

class RoleRepository {

  // Create a new role
  def create(role: Role): IO[Role] = IO {
    DB.localTx { implicit session =>
      val generatedId = sql"""
        INSERT INTO roles (name, permissions) VALUES (${role.name}, ${role.permissions})
      """.updateAndReturnGeneratedKey().apply()
      role.copy(id = Some(generatedId.toInt))
    }
  }

  // Delete roles by their IDs
  def delete(ids: List[Int]): IO[Int] = IO {
    DB.localTx { implicit session =>
      sql"""
        DELETE FROM roles WHERE id IN (${ids.mkString(",")})
      """.update().apply()
    }
  }

  // Change role name
  def changeName(id: Int, newName: String): IO[Option[Role]] = IO {
    DB.localTx { implicit session =>
      sql"""
        UPDATE roles SET name = $newName WHERE id = $id
      """.update().apply()
      findById(id).unsafeRunSync() // Retrieve the updated role
    }
  }

  // Change role permissions
  def changePermissions(id: Int, newPermissions: List[String]): IO[Option[Role]] = IO {
    DB.localTx { implicit session =>
      sql"""
        UPDATE roles SET permissions = ${newPermissions} WHERE id = $id
      """.update().apply()
      findById(id).unsafeRunSync() // Retrieve the updated role
    }
  }

  // Get all roles
  def findAll(): IO[List[Role]] = IO {
    DB.readOnly { implicit session =>
      sql"""
        SELECT id, name, permissions FROM roles
      """.map(rs => Role(Some(rs.int("id")), rs.string("name"), rs.string("permissions").split(",").toList)).list.apply()
    }
  }

  // Find a role by ID
  def findById(id: Int): IO[Option[Role]] = IO {
    DB.readOnly { implicit session =>
      sql"""
        SELECT id, name, permissions FROM roles WHERE id = $id
      """.map(rs => Role(Some(rs.int("id")), rs.string("name"), rs.string("permissions").split(",").toList)).single.apply()
    }
  }
}
