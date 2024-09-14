import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("Cities - DeleteById", () => {

  it("Deleting a city", async () => {

    const res1 = await testServer
      .post('/city')
      .send({ name: "Resende Costa" })

    expect(res1.statusCode).toEqual(StatusCodes.CREATED)

    const deleteRes = await testServer
      .delete(`/city/${res1.body}`)
      .send()

    expect(deleteRes.statusCode).toEqual(StatusCodes.NO_CONTENT)

  })

  it("Try to delete a city that does not exist ", async () => {
    const res1 = await testServer
      .delete('/city/99999')
      .send()
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res1.body).toHaveProperty('errors.default')
  })

})