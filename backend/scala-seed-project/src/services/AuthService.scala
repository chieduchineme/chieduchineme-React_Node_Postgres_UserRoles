// src/services/AuthService.scala

import cats.effect.IO
import scalikejdbc._
import scala.util.Try

case class OAuthUser(email: String, name: String)

object AuthService {

  // Find user by email or create a new user if they don't exist
  def handleOAuthLogin(email: String, name: String): IO[User] = {
    for {
      maybeUser <- UserRepository.findByEmail(email)
      user <- maybeUser match {
        case Some(existingUser) => IO.pure(existingUser)
        case None => for {
          defaultRoleOpt <- RoleRepository.findById(1) // Assume 1 is the ID for "regular" role
          defaultRole <- IO.fromOption(defaultRoleOpt)(new Exception("Default role not found"))
          newUser <- UserRepository.create(User(None, name, email, defaultRole.name))
        } yield newUser
      }
    } yield user
  }
}
