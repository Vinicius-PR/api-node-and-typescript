import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("People - GetAll", () => {

  let accessToken = ''
  beforeAll(async () => {
    const userEmail = "getall-people@gmail.com"
    await testServer.post("/cadastrar").send({
      name: "getallpeople",
      email: userEmail,
      password: "123456"
    })

    const loginResult = await testServer.post("/entrar").send({
      email: userEmail,
      password: "123456"
    })
    accessToken = loginResult.body.accessToken
  })

  let cityId: number | undefined = undefined
  beforeAll(async () => {
    const resCity = await testServer
      .post("/city")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ name: "City test" })

    cityId = resCity.body
  })

  it("Try to list all people without an authentication token", async () => {
    const res = await testServer
      .get("/people")
      .send()

    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(res.body).toHaveProperty("errors.default")
  })

  it("Search for all the people", async () => {
    const res1 = await testServer
      .post("/people")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        name: "Rafael Santos",
        email: "rafaelgetall@gmail.com",
        cityId
      })

    expect(res1.statusCode).toEqual(StatusCodes.CREATED)

    const resGetAll = await testServer
      .get("/people")
      .set({ authorization: `Bearer ${accessToken}` })
      .send()

    expect(Number(resGetAll.header["x-total-count"])).toBeGreaterThan(0)
    expect(resGetAll.statusCode).toBe(StatusCodes.OK)
    expect(resGetAll.body.length).toBeGreaterThan(0)
  })
})