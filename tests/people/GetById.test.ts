import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe("People - GetById", () => {

  let cityId: number | undefined = undefined
  beforeAll(async () => {
    const resCity = await testServer
      .post('/city')
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