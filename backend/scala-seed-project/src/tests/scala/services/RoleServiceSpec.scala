// src/test/scala/services/RoleServiceSpec.scala

import cats.effect.IO
import org.scalatest.matchers.should.Matchers
import org.scalatest.flatspec.AnyFlatSpec

class RoleServiceSpec extends AnyFlatSpec with Matchers {

  object MockRoleRepository extends RoleRepository {
    private var roles = List.empty[Role]

    override def findByName(name: String): IO[Option[Role]] = IO {
      roles.find(_.name == name)
    }

    override def create(role: Role): IO[Role] = IO {
      roles = roles :+ role
      role
    }

    override def delete(ids: List[Int]): IO[Int] = IO {
      val initialSize = roles.size
      roles = roles.filterNot(r => ids.contains(r.id.getOrElse(-1)))
      initialSize - roles.size
    }
  }

  "RoleService" should "create a new role" in {
    val newRole = Role(None, "admin", List("read", "write", "delete"))
    val result = RoleService.createRole("admin", List("read", "write", "delete"))(MockRoleRepository).unsafeRunSync()
    result.name should be("admin")
  }

  it should "delete existing roles" in {
    val adminRole = Role(Some(1), "admin", List("read", "write", "delete"))
    MockRoleRepository.create(adminRole).unsafeRunSync()
    
    val deletedCount = RoleService.deleteRoles(List(1))(MockRoleRepository).unsafeRunSync()
    deletedCount should be(1)
  }
}
