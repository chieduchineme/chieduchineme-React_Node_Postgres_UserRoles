// tests/middleware/MiddlewareSpec.scala

import cats.effect.IO
import org.http4s._
import org.http4s.dsl.Http4sDsl
import org.http4s.implicits._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.http4s.headers.Authorization
import org.http4s.Response
import org.http4s.Status
import org.http4s.AttributeKey
import org.mockito.scalatest.MockitoSugar

class MiddlewareSpec extends AnyFlatSpec with Matchers with MockitoSugar {
  
  val dsl = new Http4sDsl[IO] {}
  import dsl._

  // Define a simple route for testing
  val testRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case GET -> Root / "test" => Ok("Success")
  }

  "AuthenticateMiddleware" should "return Forbidden if no Authorization header is present" in {
    val authMiddleware = AuthenticateMiddleware.isAuthenticated(testRoutes)
    val request = Request[IO](Method.GET, uri"/test") // No Authorization header

    val response = authMiddleware.run(request).value.unsafeRunSync().getOrElse(fail("No response returned"))
    response.status shouldBe Status.Forbidden
    response.as[String].unsafeRunSync() shouldBe "Unauthorized: Please log in first."
  }

  it should "allow access if the user is authenticated" in {
    val authMiddleware = AuthenticateMiddleware.isAuthenticated(testRoutes)
    val request = Request[IO](Method.GET, uri"/test")
      .putHeaders(Authorization(Credentials.Token(AuthScheme.Bearer, "token")))
    
    // Simulating a user session
    val userSession = UserSession("admin") // Assuming you have a UserSession class defined with a role
    val sessionRequest = request.withAttributes(AttributeKey[UserSession]("UserSessionAttr") -> userSession)

    val response = authMiddleware.run(sessionRequest).value.unsafeRunSync().getOrElse(fail("No response returned"))
    response.status shouldBe Status.Ok
    response.as[String].unsafeRunSync() shouldBe "Success"
  }

  "AuthorizeMiddleware" should "deny access if the user does not have required permissions" in {
    val authorizeMiddleware = AuthorizeMiddleware.authorizeMiddleware(List("admin"))(testRoutes)
    
    // Simulating a request without admin role
    val userSession = UserSession("user") // Normal user role
    val request = Request[IO](Method.GET, uri"/test").withAttributes(AttributeKey[UserSession]("UserSessionAttr") -> userSession)

    val response = authorizeMiddleware.run(request).value.unsafeRunSync().getOrElse(fail("No response returned"))
    response.status shouldBe Status.Forbidden
    response.as[String].unsafeRunSync() shouldBe "Forbidden: You do not have access to this resource"
  }

  it should "allow access if the user has the required permissions" in {
    val authorizeMiddleware = AuthorizeMiddleware.authorizeMiddleware(List("view"))(testRoutes)

    // Simulating a request with a role that has the required permission
    val userSession = UserSession("user") // Assuming this user has the "view" permission
    val request = Request[IO](Method.GET, uri"/test").withAttributes(AttributeKey[UserSession]("UserSessionAttr") -> userSession)

    val response = authorizeMiddleware.run(request).value.unsafeRunSync().getOrElse(fail("No response returned"))
    response.status shouldBe Status.Ok
    response.as[String].unsafeRunSync() shouldBe "Success"
  }

  it should "deny access if the role does not exist in session" in {
    val authorizeMiddleware = AuthorizeMiddleware.authorizeMiddleware(List("admin"))(testRoutes)

    // Simulating a request without any session
    val request = Request[IO](Method.GET, uri"/test")

    val response = authorizeMiddleware.run(request).value.unsafeRunSync().getOrElse(fail("No response returned"))
    response.status shouldBe Status.Forbidden
    response.as[String].unsafeRunSync() shouldBe "Role not found in session"
  }
}
