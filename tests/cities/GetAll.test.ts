import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("Cities - GetAll", () => {

  it("Search for all cities", async () => {
    const res1 = await testServer
      .post('/city')
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