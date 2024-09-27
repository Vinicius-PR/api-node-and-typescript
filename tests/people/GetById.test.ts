import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe("People - GetById", () => {

  let accessToken = ''
  beforeAll(async () => {
    const userEmail = "getbyid-people@gmail.com"
    await testServer.post("/cadastrar").send({
      name: "getbyidpeople",
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
      .post('/city')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ name: "City test" })

    cityId = resCity.body
  })

  it("Search for a person by its ID", async () => {
    const res1 = await testServer
      .post('/people')
      .send({
        name: "Rafael Santos",
        email: "rafaelgetbyid@gmail.com",
        cityId
      })

    expect(res1.statusCode).toEqual(StatusCodes.CREATED)

    const resGetById = await testServer
      .get(`/people/${res1.body}`)
      .send()

    expect(resGetById.statusCode).toEqual(StatusCodes.OK)
    expect(resGetById.body).toHaveProperty('name')
  })

  it("Search for a person that does not exist", async () => {
    const res1 = await testServer
      .get('/people/99999')
      .send()
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res1.body).toHaveProperty('errors.default')
  })
})