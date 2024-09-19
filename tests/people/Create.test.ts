import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe("People - Create", () => {

  let cityId: number | undefined = undefined

  beforeAll(async () => {
    const resCity = await testServer
      .post('/city')
      .send({ name: "City test" })

    cityId = resCity.body
  })
  it("Create a person", async () => {
    const res1 = await testServer
      .post('/people')
      .send({
        name: "Rafael Santos",
        email: "rafaelcreate@gmail.com",
        cityId
      })
    expect(res1.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof res1.body).toEqual('number')
  })
  it("Create a person with email duplication", async () => {
    const res1 = await testServer
      .post('/people')
      .send({
        name: "Rafael Santos",
        email: "rafaelduplicado@gmail.com",
        cityId
      })
    expect(res1.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof res1.body).toEqual('number')

    const res2 = await testServer
      .post('/people')
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
      .send({
        name: "Rafael Santos",
        email: "rafael@gmail.com"
      })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.cityId')
  })
  it("Create a person with an invalid city ID ", async () => {
    const res1 = await testServer
      .post('/people')
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
      .send({})
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.name')
    expect(res1.body).toHaveProperty('errors.body.email')
    expect(res1.body).toHaveProperty('errors.body.cityId')
  })
})