// src/utils/TokenUtils.scala

import pdi.jwt.{Jwt, JwtAlgorithm}
import scala.util.Try
import scala.concurrent.duration._

object TokenUtils {

  private val secretKey = "your-secret-key" // Replace with your secret key
  private val expirationTime = 1.hour.toSeconds // Token expiration time

  // Generate a JWT token
  def generateToken(userId: Int, role: String): String = {
    val claims = JwtClaim(
      content = s"""{"userId": $userId, "role": "$role"}""",
      expiration = Some(System.currentTimeMillis() / 1000 + expirationTime)
    )
    Jwt.encode(claims, secretKey, JwtAlgorithm.HS256)
  }

  // Verify a JWT token
  def verifyToken(token: String): Option[Map[String, Any]] = {
    Jwt.decode(token, secretKey, Seq(JwtAlgorithm.HS256)).toOption.map { claim =>
      claim.content
    }.flatMap(content => Try(io.circe.parser.parse(content)).toOption).map(_.asObject.get.toMap)
  }
}
