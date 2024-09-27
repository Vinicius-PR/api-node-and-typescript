import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe("People - UpdateById", () => {

  let accessToken = ''
  beforeAll(async () => {
    const userEmail = "update-people@gmail.com"
    await testServer.post("/cadastrar").send({
      name: "updatepeople",
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

  it("Update a person", async () => {
    const res1 = await testServer
      .post('/people')
      .send({
        name: "Rafael Santos",
        email: "rafaelupdatebyid@gmail.com",
        cityId
      })

    expect(res1.statusCode).toEqual(StatusCodes.CREATED)

    const updateById = await testServer
      .put(`/people/${res1.body}`)
      .send({
        name: "Rafael Santos",
        email: "rafaelupdate@gmail.com",
        cityId
      })

    expect(updateById.statusCode).toEqual(StatusCodes.NO_CONTENT)

    const res2 = await testServer
      .get(`/people/${res1.body}`)
      .send()
    expect(res2.body.email).toEqual("rafaelupdate@gmail.com")
  })

  it("Update a person that does not exist", async () => {
    const res1 = await testServer
      .put('/people/99999')
      .send({
        name: "Rafael Santos",
        email: "rafaelupdatebyid@gmail.com",
        cityId
      })
    expect(res1.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res1.body).toHaveProperty('errors.default')
  })
})