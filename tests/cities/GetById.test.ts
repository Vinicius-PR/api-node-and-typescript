import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("Cities - GetById", () => {

  it("Search for a city by its ID", async () => {
    const res1 = await testServer
      .post('/city')
      .send({ name: "Resende Costa" })

    expect(res1.statusCode).toEqual(StatusCodes.CREATED)

    const resGetById = await testServer
      .get(`/city/${res1.body}`)
      .send()

    expect(resGetById.statusCode).toEqual(StatusCodes.OK)
    expect(resGetById.body).toHaveProperty('name')
  })

  it("Search for a city that does not exist", async () => {
    const res1 = await testServer
      .get('/city/99999')
      .send()
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res1.body).toHaveProperty('errors.default')
  })
})