import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("Cities - Create", () => {

  it("Create function", async () => {
    const res1 = await testServer
      .post('/city')
      .send({ name: "Resende Costa" })
    expect(res1.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof res1.body).toEqual('number')
  })


  it("Create with a short name ", async () => {
    const res1 = await testServer
      .post('/city')
      .send({ name: "Re" })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.name')
  })

})