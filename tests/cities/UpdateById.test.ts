import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("Cities - UpdateById", () => {

  let accessToken = ''
  beforeAll(async () => {
    const userEmail = "update-city@gmail.com"
    await testServer.post("/cadastrar").send({
      name: "updatecity",
      email: userEmail,
      password: "123456"
    })

    const loginResult = await testServer.post("/entrar").send({
      email: userEmail,
      password: "123456"
    })
    accessToken = loginResult.body.accessToken
  })

  it("Try update a city without an authenticantion token", async () => {
    const res = await testServer
      .put("/city/1")
      .send({
        name: "Test City"
      })
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(res.body).toHaveProperty("errors.default")
  })

  it("Update a city", async () => {
    const res1 = await testServer
      .post('/city')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ name: "Resende Costa" })

    expect(res1.statusCode).toEqual(StatusCodes.CREATED)

    const updateById = await testServer
      .put(`/city/${res1.body}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        name: "Tiradentes"
      })

    expect(updateById.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it("Update a city that does not exist", async () => {
    const res1 = await testServer
      .put('/city/99999')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        name: "Tiradentes"
      })
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res1.body).toHaveProperty('errors.default')
  })
})