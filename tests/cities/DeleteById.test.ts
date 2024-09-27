import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("Cities - DeleteById", () => {

  let accessToken = ''
  beforeAll(async () => {
    const userEmail = "delete-city@gmail.com"
    await testServer.post("/cadastrar").send({
      name: "deletecity",
      email: userEmail,
      password: "123456"
    })

    const loginResult = await testServer.post("/entrar").send({
      email: userEmail,
      password: "123456"
    })
    accessToken = loginResult.body.accessToken
  })

  it("Deleting a city", async () => {

    const res1 = await testServer
      .post('/city')
      .set({ Authorization: `Bearer ${accessToken}` })
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
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res1.body).toHaveProperty('errors.default')
  })

})