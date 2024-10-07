// src/services/UserService.scala

import cats.effect.IO

object UserService {

  def addUser(email: String, name: String, role: String): IO[User] = {
    for {
      _ <- IO.raiseError(new Exception("Missing required fields: email, name, and role must all be provided"))
      existingUserOpt <- UserRepository.findByEmail(email)
      _ <- IO.fromOption(existingUserOpt)(new Exception(s"User with email $email already exists"))
      newUser <- UserRepository.create(User(None, name, email, role))
    } yield newUser
  }

  def deleteUsers(userIds: List[Int]): IO[Int] = {
    UserRepository.delete(userIds)
  }

  def assignRoleToUser(userId: Int, role: String): IO[Option[User]] = {
    UserRepository.assignRole(userId, role)
  }

  def getUsers(): IO[List[User]] = {
    UserRepository.findAll()
  }

  def findUserByEmail(email: String): IO[Option[User]] = {
    UserRepository.findByEmail(email)
  }
}
