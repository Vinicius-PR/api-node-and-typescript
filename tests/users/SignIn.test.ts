import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"


describe("Users - SignIn", () => {

  beforeAll(async () => {
    await testServer
      .post('/cadastrar')
      .send({
        name: "Joe Doe",
        email: "joedoe@gmail.com",
        password: "123456"
      })
  })

  it("SignIn with right email and password", async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        email: "joedoe@gmail.com",
        password: "123456"
      })
    expect(res1.statusCode).toEqual(StatusCodes.OK)
    expect(res1.body).toHaveProperty("accessToken")
  })

  it("SignIn with wrong password", async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        email: "joedoe@gmail.com",
        password: "123456789"
      })
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(res1.body).toHaveProperty("errors.default")
  })

  it("SignIn with wrong email", async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        email: "joedoeasdf@gmail.com",
        password: "123456"
      })
    expect(res1.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(res1.body).toHaveProperty("errors.default")
  })

  it("SignIn with Invalid email", async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        email: "joedo @gmail.com",
        password: "123456"
      })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty("errors.body.email")
  })

  it("SignIn with short password", async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        email: "joedo@gmail.com",
        password: "123"
      })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty("errors.body.password")
  })

  it("SignIn with no email", async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        password: "123456"
      })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty("errors.body.email")
  })

  it("SignIn with no password", async () => {
    const res1 = await testServer
      .post('/entrar')
      .send({
        email: "joedo@gmail.com"
      })
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(res1.body).toHaveProperty("errors.body.password")
  })
})