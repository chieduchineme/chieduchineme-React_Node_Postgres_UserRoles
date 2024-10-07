// build.sbt

ThisBuild / scalaVersion     := "2.13.12"
ThisBuild / version          := "0.1.0-SNAPSHOT"
ThisBuild / organization     := "com.example"
ThisBuild / scalaVersion     := "2.13.12"
ThisBuild / version          := "0.1.0-SNAPSHOT"
ThisBuild / organization     := "com.example"
ThisBuild / organizationName := "example"

lazy val root = (project in file("."))
  .settings(
    name := "Scala Seed Project",
    libraryDependencies ++= Seq(
      "org.http4s" %% "http4s-dsl" % "0.23.14",
      "org.http4s" %% "http4s-blaze-server" % "0.23.14",
      "org.http4s" %% "http4s-blaze-client" % "0.23.14",
      "org.http4s" %% "http4s-circe" % "0.23.14",
      "io.circe" %% "circe-generic" % "0.14.1",
      "io.circe" %% "circe-parser" % "0.14.1",
      "org.scalatest" %% "scalatest" % "3.2.9" % Test,
      "org.scalikejdbc" %% "scalikejdbc" % "4.0.0",
      "org.scalikejdbc" %% "scalikejdbc-config" % "4.0.0",
      "com.typesafe" % "config" % "1.4.0"
    )
  )
