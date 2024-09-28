import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("People - DeleteById", () => {

  let accessToken = ''
  beforeAll(async () => {
    const userEmail = "delete-people@gmail.com"
    await testServer.post("/cadastrar").send({
      name: "deletepeople",
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

  it("Try to delete a person without an anthentication token", async () => {
    const res = await testServer
      .delete("/people/1")
      .send()
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(res.body).toHaveProperty("errors.default")
  })

  it("Deleting a person", async () => {

    const res1 = await testServer
      .post('/people')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        name: "Rafael Santos",
        email: "rafaeldelete@gmail.com",
        cityId
      })

    expect(res1.statusCode).toEqual(StatusCodes.CREATED)

    const deleteRes = await testServer
      .delete(`/people/${res1.body}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send()

    expect(deleteRes.statusCode).toEqual(StatusCodes.NO_CONTENT)

  })

  it("Try to delete a person that does not exist ", async () => {
    const res1 = await testServer
      .delete('/people/99999')
      .set({ authorization: `Bearer ${accessToken}` })
      .send()
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res1.body).toHaveProperty('errors.default')
  })

})