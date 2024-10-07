// src/test/scala/services/AuthServiceSpec.scala

import cats.effect.IO
import org.scalatest.matchers.should.Matchers
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.BeforeAndAfterAll

class AuthServiceSpec extends AnyFlatSpec with Matchers with BeforeAndAfterAll {

  // Mocking UserRepository and RoleRepository
  object MockUserRepository extends UserRepository {
    private var users = List.empty[User]

    override def findByEmail(email: String): IO[Option[User]] = IO {
      users.find(_.email == email)
    }

    override def create(user: User): IO[User] = IO {
      users = users :+ user
      user
    }
  }

  object MockRoleRepository extends RoleRepository {
    private val roles = List(Role(Some(1), "regular", List("read", "write")))

    override def findById(id: Int): IO[Option[Role]] = IO {
      roles.find(_.id.contains(id))
    }
  }

  "AuthService" should "create a new user if they don't exist" in {
    val result = AuthService.handleOAuthLogin("test@example.com", "Test User")(MockUserRepository, MockRoleRepository).unsafeRunSync()
    result.email should be("test@example.com")
    result.name should be("Test User")
  }

  it should "return existing user if they exist" in {
    MockUserRepository.create(User(None, "Existing User", "existing@example.com", "regular")).unsafeRunSync()

    val result = AuthService.handleOAuthLogin("existing@example.com", "Existing User")(MockUserRepository, MockRoleRepository).unsafeRunSync()
    result.email should be("existing@example.com")
  }
}
