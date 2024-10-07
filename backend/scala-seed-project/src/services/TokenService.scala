// src/services/TokenService.scala

import cats.effect.IO
import sttp.client._
import sttp.client.asynchttpclient.cats._
import io.circe.generic.auto._
import io.circe.parser._

case class GoogleUserInfo(email: String, name: String)

object TokenService {
  
  private implicit val backend = AsyncHttpClientCatsBackend()

  // Verify Google OAuth Access Token by calling Google People API
  def verifyGoogleToken(token: String): IO[GoogleUserInfo] = {
    val request = basicRequest
      .header("Authorization", s"Bearer $token")
      .get(uri"https://www.googleapis.com/oauth2/v3/userinfo")

    for {
      response <- request.send()
      userInfo <- response.body match {
        case Right(body) =>
          decode[GoogleUserInfo](body) match {
            case Right(info) => IO.pure(info)
            case Left(_) => IO.raiseError(new Exception("Failed to decode Google user info."))
          }
        case Left(_) => IO.raiseError(new Exception("Invalid Google OAuth token."))
      }
    } yield userInfo
  }

  // Verify Microsoft Token
  def verifyMicrosoftToken(token: String): IO[GoogleUserInfo] = {
    val request = basicRequest
      .header("Authorization", s"Bearer $token")
      .get(uri"https://graph.microsoft.com/v1.0/me")

    for {
      response <- request.send()
      userInfo <- response.body match {
        case Right(body) =>
          decode[GoogleUserInfo](body) match {
            case Right(info) => IO.pure(info)
            case Left(_) => IO.raiseError(new Exception("Failed to decode Microsoft user info."))
          }
        case Left(_) => IO.raiseError(new Exception("Invalid Microsoft token."))
      }
    } yield userInfo
  }
}
