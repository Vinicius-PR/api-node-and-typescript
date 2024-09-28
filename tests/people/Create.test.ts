import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe("People - Create", () => {

  let accessToken = ''
  beforeAll(async () => {
    const userEmail = "create-people@gmail.com"
    await testServer.post("/cadastrar").send({
      name: "createpeople",
      email: userEmail,
      password: "123456"
    })

    const loginResult = await testServer.post("/entrar").send({
      email: userEmail,
      password: "123456"
    })
    accessToken = loginResult.body.accessToken
    console.log('accestoken people create', accessToken)
  })

  let cityId: number | undefined = undefined
  beforeAll(async () => {
    const resCity = await testServer
      .post('/city')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ name: "City test" })

    cityId = resCity.body
  })

  it("Try to create a person without an authentication token", async () => {
    const res = await testServer
      .post("/people")
      .send({
        name: "Maria Rita",
        email: "mamarita@gmail.com",
        cityId
      })
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED)
    expect(res.body).toHaveProperty("errors.default")
  })

  it("Create a person", async () => {
    const res1 = await testServer
      .post('/people')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        name: "Rafael Santos",
        email: "rafael@gmail.com",
        cityId
      })
    expect(res1.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof res1.body).toEqual('number')
  })

  it("Create a person with email duplication", async () => {
    const res1 = await testServer
      .post('/people')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        name: "Rafael Santos",
        email: "rafaelduplicado@gmail.com",
        cityId
      })
    expect(res1.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof res1.body).toEqual('number')

    const res2 = await testServer
      .post('/people')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        name: "Rafael Santos Duplicado",
        email: "rafaelduplicado@gmail.com",
        cityId
      })
    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res2.body).toHaveProperty('errors.default')
  })
  it("Create a person with a short name ", async () => {
    const res1 = await testServer
      .post('/people')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        name: "Ra",
        email: "rafaelcreateshort@gmail.com",
        cityId
      })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.name')
  })
  it("Create a person without a name", async () => {
    const res1 = await testServer
      .post('/people')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        email: "rafael@gmail.com",
        cityId
      })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.name')
  })
  it("Create a person without a email ", async () => {
    const res1 = await testServer
      .post('/people')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        name: "Rafael Santos",
        cityId
      })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.email')
  })
  it("Create a person with invalid email ", async () => {
    const res1 = await testServer
      .post('/people')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        name: "Rafael Santos",
        email: "rafael createshort@",
        cityId
      })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.email')
  })
  it("Create a person without a city ID ", async () => {
    const res1 = await testServer
      .post('/people')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        name: "Rafael Santos",
        email: "rafaelnocity@gmail.com"
      })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.cityId')
  })
  it("Create a person with an invalid city ID ", async () => {
    const res1 = await testServer
      .post('/people')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        name: "Ra",
        email: "rafaelcreateshort@gmail.com",
        cityId: 'asdf'
      })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.cityId')
  })
  it("Create a person with no attributes", async () => {
    const res1 = await testServer
      .post('/people')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({})
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.name')
    expect(res1.body).toHaveProperty('errors.body.email')
    expect(res1.body).toHaveProperty('errors.body.cityId')
  })
})