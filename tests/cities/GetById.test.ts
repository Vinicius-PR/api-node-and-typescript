import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("Cities - GetById", () => {

  let accessToken = ""
  beforeAll(async () => {
    const userEmail = "getbyid-city@gmail.com"
    await testServer.post("/cadastrar").send({
      name: "getbyidcity",
      email: userEmail,
      password: "123456"
    })

    const loginResult = await testServer.post("/entrar").send({
      email: userEmail,
      password: "123456"
    })
    accessToken = loginResult.body.accessToken
  })

  it("Try search for a city wihout an authentication token", async () => {
    const res = await testServer
      .get("/city/1")
      .send()
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(res.body).toHaveProperty("errors.default")
  })

  it("Search for a city by its ID", async () => {
    const res1 = await testServer
      .post("/city")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ name: "Resende Costa" })

    expect(res1.statusCode).toEqual(StatusCodes.CREATED)

    const resGetById = await testServer
      .get(`/city/${res1.body}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send()

    expect(resGetById.statusCode).toEqual(StatusCodes.OK)
    expect(resGetById.body).toHaveProperty("name")
  })

  it("Search for a city that does not exist", async () => {
    const res1 = await testServer
      .get("/city/99999")
      .set({ authorization: `Bearer ${accessToken}` })
      .send()
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res1.body).toHaveProperty("errors.default")
  })
})