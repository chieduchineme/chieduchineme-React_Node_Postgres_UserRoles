// tests/controllers/UserControllerSpec.scala

import cats.effect.IO
import org.http4s._
import org.http4s.dsl.Http4sDsl
import org.http4s.implicits._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.mockito.scalatest.MockitoSugar
import org.mockito.ArgumentMatchers.any

class UserControllerSpec extends AnyFlatSpec with Matchers with MockitoSugar {

  val mockUserService: UserService[IO] = mock[UserService[IO]]

  // Define the routes using the mocked UserService
  val userRoutes: HttpRoutes[IO] = UserController.routes(mockUserService)

  "UserController" should "create a new user" in {
    val createUserRequest = CreateUserRequest("test@example.com", "Test User", "regular")
    val expectedUser = User(Some(1), "Test User", "test@example.com", "regular")

    // Set up mock behavior
    when(mockUserService.addUser(any[String], any[String], any[String])).thenReturn(IO.pure(expectedUser))

    // Create a POST request
    val request = Request[IO](Method.POST, uri"/users").withEntity(createUserRequest)

    // Execute the request against the routes
    val response = userRoutes.run(request).value.unsafeRunSync().getOrElse(fail("No response returned"))

    response.status should be(Status.Ok)
    response.as[User].unsafeRunSync() should be(expectedUser)
  }

  it should "delete users successfully" in {
    val userIdsRequest = UserIdsRequest(List(1, 2, 3))

    // Set up mock behavior
    when(mockUserService.deleteUsers(any[List[Int]])).thenReturn(IO.unit)

    // Create a DELETE request
    val request = Request[IO](Method.DELETE, uri"/users").withEntity(userIdsRequest)

    // Execute the request against the routes
    val response = userRoutes.run(request).value.unsafeRunSync().getOrElse(fail("No response returned"))

    response.status should be(Status.Ok)
    response.as[String].unsafeRunSync() should be("Users deleted successfully")
  }

  it should "get user by email" in {
    val expectedUser = User(Some(1), "Test User", "test@example.com", "regular")

    // Set up mock behavior
    when(mockUserService.findUserByEmail(any[String])).thenReturn(IO.pure(Some(expectedUser)))

    // Create a GET request
    val request = Request[IO](Method.GET, uri"/users/test@example.com")

    // Execute the request against the routes
    val response = userRoutes.run(request).value.unsafeRunSync().getOrElse(fail("No response returned"))

    response.status should be(Status.Ok)
    response.as[Option[User]].unsafeRunSync() should be(Some(expectedUser))
  }

  it should "change user role" in {
    val changeUserRoleRequest = ChangeUserRoleRequest("admin")

    // Set up mock behavior
    when(mockUserService.assignRoleToUser(any[Int], any[String])).thenReturn(IO.unit)

    // Create a PUT request
    val request = Request[IO](Method.PUT, uri"/users/1").withEntity(changeUserRoleRequest)

    // Execute the request against the routes
    val response = userRoutes.run(request).value.unsafeRunSync().getOrElse(fail("No response returned"))

    response.status should be(Status.Ok)
    response.as[String].unsafeRunSync() should be("Role updated successfully")
  }

  it should "fetch all users" in {
    val users = List(User(Some(1), "User One", "user1@example.com", "regular"), User(Some(2), "User Two", "user2@example.com", "admin"))

    // Set up mock behavior
    when(mockUserService.getUsers()).thenReturn(IO.pure(users))

    // Create a GET request
    val request = Request[IO](Method.GET, uri"/users")

    // Execute the request against the routes
    val response = userRoutes.run(request).value.unsafeRunSync().getOrElse(fail("No response returned"))

    response.status should be(Status.Ok)
    response.as[List[User]].unsafeRunSync() should be(users)
  }
}
