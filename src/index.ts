import { Knex } from "./server/database/knex";
import { server } from "./server/Server";

const startServer = () => {
  server.listen(process.env.PORT || 3333, () => {
    console.log(`App rodando na porta ${process.env.PORT || 3333}`)
  })
}

// To ensure that this app works during production, we have to run the migrate.
// This if is to ensure that the migrate run only during production not in the development. In development we save file all the time. When we save the file, the server run again. The migrate would run too. So to avoid this problem, we check if we are at development mode.
if (process.env.IS_LOCALHOST !== 'true') {
  Knex.migrate.latest()
    .then(() => {
      startServer()
    })
    .catch((error) => {
      console.log(error)
    })
} else {
  startServer()
}