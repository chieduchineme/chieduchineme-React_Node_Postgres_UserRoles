// src/middleware/authorizeMiddleware.scala

import cats.effect.Sync
import org.http4s.{Request, Response}
import org.http4s.dsl.Http4sDsl
import org.http4s.HttpRoutes
import scala.concurrent.ExecutionContext.Implicits.global

object AuthorizeMiddleware {
  def authorizeMiddleware[F[_]: Sync](requiredPermissions: List[String])(routes: HttpRoutes[F]): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}
    import dsl._

    HttpRoutes.of[F] {
      case req =>
        // Retrieve the role from the session
        val userRole = req.attributes.get(UserSessionAttr).map(_.role) // Assume UserSessionAttr holds the role

        userRole match {
          case Some(role) if role == "admin" =>
            routes(req) // Allow access for admin role
          
          case Some(role) =>
            // Logic to fetch permissions for the user's role (assume getRolePermissions is defined)
            val rolePermissions = getRolePermissions(role) // Function to get permissions from database

            // Check if the role has the required permission(s)
            val hasPermission = requiredPermissions.exists(rolePermissions.contains)

            if (hasPermission) {
              routes(req) // Proceed to the next route if permission is granted
            } else {
              Forbidden("Forbidden: You do not have access to this resource")
            }

          case None => Forbidden("Role not found in session")
        }
    }
  }

  // Placeholder for the function that gets role permissions
  def getRolePermissions(role: String): List[String] = {
    // Logic to fetch role permissions from the database
    // This is a placeholder; replace with actual DB call
    List("view", "edit") // Example permissions
  }
}
