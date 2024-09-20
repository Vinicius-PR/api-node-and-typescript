import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe("Users - SignUp", () => {

  it("Creating the user correctly", async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        name: "vinicius",
        email: "vinicreate@gmail.com",
        password: "123456"
      })
    expect(res1.status).toEqual(StatusCodes.CREATED)
    expect(typeof res1.body).toEqual('number')
  })

  it("Creating an user with duplicate email", async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        name: "vinicius",
        email: "viniduplicado@gmail.com",
        password: "123456"
      })
    expect(res1.status).toEqual(StatusCodes.CREATED)
    expect(typeof res1.body).toEqual('number')

    const res2 = await testServer
      .post('/cadastrar')
      .send({
        name: "vinicius 2",
        email: "viniduplicado@gmail.com",
        password: "123456"
      })

    expect(res2.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res2.body).toHaveProperty('errors.default')

  })

  it("Creating the user with short name", async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        name: "vi",
        email: "vinishortname@gmail.com",
        password: "123456"
      })
    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.name')
  })

  it("Creating the user with invalid email", async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        name: "vinicius",
        email: "vini @gmail.com",
        password: "123456"
      })
    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.email')
  })

  it("Creating the user with short password", async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        name: "vinicius",
        email: "vinishortpass@gmail.com",
        password: "123"
      })
    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.password')
  })

  it("Creating the user with no name", async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        email: "vininoname@gmail.com",
        password: "123456"
      })
    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.name')
  })

  it("Creating the user with no email", async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        name: "vinicius",
        password: "123456"
      })
    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.email')
  })

  it("Creating the user with no password", async () => {
    const res1 = await testServer
      .post('/cadastrar')
      .send({
        name: "vinicius",
        email: "vininopass@gmail.com"
      })
    expect(res1.status).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty('errors.body.password')
  })
})