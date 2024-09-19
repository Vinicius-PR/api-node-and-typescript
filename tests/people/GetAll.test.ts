import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("People - GetAll", () => {

  let cityId: number | undefined = undefined

  beforeAll(async () => {
    const resCity = await testServer
      .post('/city')
      .send({ name: "City test" })

    cityId = resCity.body
  })

  it("Search for all the people", async () => {
    const res1 = await testServer
      .post('/people')
      .send({
        name: "Rafael Santos",
        email: "rafaelgetall@gmail.com",
        cityId
      })

    expect(res1.statusCode).toEqual(StatusCodes.CREATED)

    const resGetAll = await testServer
      .get('/people')
      .send()

    expect(Number(resGetAll.header['x-total-count'])).toBeGreaterThan(0)
    expect(resGetAll.statusCode).toBe(StatusCodes.OK)
    expect(resGetAll.body.length).toBeGreaterThan(0)
  })
})