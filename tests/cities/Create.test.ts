import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("Cities - Create", () => {

  let accessToken = ''
  beforeAll(async () => {
    const userEmail = "create-city@gmail.com"
    await testServer.post("/cadastrar").send({
      name: "createcity",
      email: userEmail,
      password: "123456"
    })

    const loginResult = await testServer.post("/entrar").send({
      email: userEmail,
      password: "123456"
    })
    accessToken = loginResult.body.accessToken
  })

  it("Try create a city without the access token", async () => {
    const res1 = await testServer
      .post("/city")
      .send({ name: "Resende Costa" })
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(res1.body).toHaveProperty("errors.default")
  })

  it("Create function", async () => {
    const res1 = await testServer
      .post("/city")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ name: "Resende Costa" })
    expect(res1.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof res1.body).toEqual("number")
  })


  it("Create with a short name ", async () => {
    const res1 = await testServer
      .post("/city")
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ name: "Re" })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty("errors.body.name")
  })

})