import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

import io.gatling.core.structure.ScenarioBuilder
import io.gatling.core.structure.ChainBuilder

class LoginSimulation extends Simulation {
  object Login {
    private var header = Map(
      "Accept"                    -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "Origin"                    -> "https://9.30.161.12:9444",
      "Sec-Fetch-Mode"            -> "navigate",
      "Sec-Fetch-Site"            -> "same-origin",
      "Sec-Fetch-User"            -> "?1",
      "Upgrade-Insecure-Requests" -> "1"
    )

    def login(username: String, password: String): ChainBuilder = {
      exec(
        http("Home")
          .get("/")
      ).pause(1)
        .exec(
          http("Login")
            .post("/ida/login")
            .headers(header)
            .formParam("username", username)
            .formParam("password", password)
        )
        .pause(1)
    }
  }
  val httpProtocol = http
    .baseUrl("https://9.30.161.12:9444")
    .inferHtmlResources()
    .acceptHeader("*/*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("en,en-US;q=0.9,zh-CN;q=0.8,zh;q=0.7,de;q=0.6")
    .doNotTrackHeader("1")
    .userAgentHeader(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    )
  val scn = scenario("IDASimulation").exec(Login.login("idaAdmin", "idaAdmin"))
  setUp(scn.inject(atOnceUsers(1)).protocols(httpProtocol))
}
