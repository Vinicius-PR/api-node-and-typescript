import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("Cities - GetAll", () => {

  let accessToken = ''
  beforeAll(async () => {
    const userEmail = "getall-city@gmail.com"
    await testServer.post("/cadastrar").send({
      name: "getallcity",
      email: userEmail,
      password: "123456"
    })

    const loginResult = await testServer.post("/entrar").send({
      email: userEmail,
      password: "123456"
    })
    accessToken = loginResult.body.accessToken
  })

  it("Search for all cities", async () => {
    const res1 = await testServer
      .post('/city')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ name: "Resende Costa" })

    expect(res1.statusCode).toEqual(StatusCodes.CREATED)

    const resGetAll = await testServer
      .get('/city')
      .send()

    expect(Number(resGetAll.header['x-total-count'])).toBeGreaterThan(0)
    expect(resGetAll.statusCode).toBe(StatusCodes.OK)
    expect(resGetAll.body.length).toBeGreaterThan(0)
  })
})