// src/repositories/UserRepository.scala

import cats.effect.IO
import scalikejdbc._

case class User(id: Option[Int], name: String, email: String, role: String)

class UserRepository {

  // Create a new user
  def create(user: User): IO[User] = IO {
    DB.localTx { implicit session =>
      val generatedId = sql"""
        INSERT INTO users (name, email, role) VALUES (${user.name}, ${user.email}, ${user.role})
      """.updateAndReturnGeneratedKey().apply()
      user.copy(id = Some(generatedId.toInt))
    }
  }

  // Delete users by their IDs
  def delete(ids: List[Int]): IO[Int] = IO {
    DB.localTx { implicit session =>
      sql"""
        DELETE FROM users WHERE id IN (${ids.mkString(",")})
      """.update().apply()
    }
  }

  // Assign a role to a user
  def assignRole(userId: Int, role: String): IO[Option[User]] = IO {
    DB.localTx { implicit session =>
      sql"""
        UPDATE users SET role = $role WHERE id = $userId
      """.update().apply()
      findById(userId).unsafeRunSync() // Retrieve the updated user
    }
  }

  // Get all users
  def findAll(): IO[List[User]] = IO {
    DB.readOnly { implicit session =>
      sql"""
        SELECT id, name, email, role FROM users
      """.map(rs => User(Some(rs.int("id")), rs.string("name"), rs.string("email"), rs.string("role"))).list.apply()
    }
  }

  // Find a user by email
  def findByEmail(email: String): IO[Option[User]] = IO {
    DB.readOnly { implicit session =>
      sql"""
        SELECT id, name, email, role FROM users WHERE email = $email
      """.map(rs => User(Some(rs.int("id")), rs.string("name"), rs.string("email"), rs.string("role"))).single.apply()
    }
  }

  // Find a user by ID
  def findById(id: Int): IO[Option[User]] = IO {
    DB.readOnly { implicit session =>
      sql"""
        SELECT id, name, email, role FROM users WHERE id = $id
      """.map(rs => User(Some(rs.int("id")), rs.string("name"), rs.string("email"), rs.string("role"))).single.apply()
    }
  }
}