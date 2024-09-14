import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("Cities - UpdateById", () => {

  it("Update a city", async () => {
    const res1 = await testServer
      .post('/city')
      .send({ name: "Resende Costa" })

    expect(res1.statusCode).toEqual(StatusCodes.CREATED)

    const updateById = await testServer
      .put(`/city/${res1.body}`)
      .send({
        name: "Tiradentes"
      })

    expect(updateById.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it("Update a city that does not exist", async () => {
    const res1 = await testServer
      .put('/city/99999')
      .send({
        name: "Tiradentes"
      })
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res1.body).toHaveProperty('errors.default')
  })
})