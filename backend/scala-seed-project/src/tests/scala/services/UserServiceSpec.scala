// src/test/scala/services/UserServiceSpec.scala

import cats.effect.IO
import org.scalatest.matchers.should.Matchers
import org.scalatest.flatspec.AnyFlatSpec

class UserServiceSpec extends AnyFlatSpec with Matchers {

  object MockUserRepository extends UserRepository {
    private var users = List.empty[User]

    override def findByEmail(email: String): IO[Option[User]] = IO {
      users.find(_.email == email)
    }

    override def create(user: User): IO[User] = IO {
      users = users :+ user
      user
    }

    override def delete(ids: List[Int]): IO[Int] = IO {
      val initialSize = users.size
      users = users.filterNot(u => ids.contains(u.id.getOrElse(-1)))
      initialSize - users.size
    }
  }

  "UserService" should "add a new user" in {
    val newUser = User(None, "New User", "new@example.com", "regular")
    val result = UserService.addUser("new@example.com", "New User", "regular")(MockUserRepository).unsafeRunSync()
    result.email should be("new@example.com")
    result.name should be("New User")
  }

  it should "delete existing users" in {
    val existingUser = User(None, "Existing User", "existing@example.com", "regular")
    MockUserRepository.create(existingUser).unsafeRunSync()
    
    val deletedCount = UserService.deleteUsers(List(1))(MockUserRepository).unsafeRunSync()
    deletedCount should be(1)
  }
}
