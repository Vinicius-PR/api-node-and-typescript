# Aula 07

## Estrutura de pastas

Foram usadas as pastas controllers, database, routes e shared.

### controller

A controller é responsavel por conter as funções que serão executadas quando um endpoint for chamado. Por exemplo:

```javascript
  router.get('/', (req, res) => {
    console.log('we are at / end point')
    return res.status(StatusCodes.ACCEPTED).send("Ola Dev")
  })
```
A função de callback acima, a arrow function, é um controle. Essa função poderia ficar dentro da pasta controler para organizar o projeto.


### database

Essa pasta tera o banco de dados. Aquivos relacionado ao banco de dados.

### routes

Pasta para organizar as rotas da nossa api


### shared

Aqui tera os arquivos que será compartilhado em toda a aplicação. Um exemplo são os **middlewares**. Exemplo:

```javascript
  router.get(
    '/', 
    (req, res, next) => {
    console.log('we are at / end point')
    const condition = true
    if (condition) {
      next()
    }
    return res.status(StatusCodes.ACCEPTED).send("Ola Dev")
    },
    (req, res) => {
    console.log('we are at / end point')
    return res.status(StatusCodes.ACCEPTED).send("Ola Dev")
    }
  )
```

Nesse exemplo acima, a primeira função que contém o parametro *next* é um middleware. Essa função é executada quando bate no end point e dependendo do retorno dela, executa a proxima função ou não. Um exemplo pratico seria verificar se o usuario está autenticado ou não.

Também temos a pasta **services** dentro de shared. Ela contem arquivos que consomem api externas. Contem arquivos de não fazem mudanças no banco de dados. São funções que nos ajuda a criptografar senhas por exemplo.

# Aula 08

## Tipagem do body

Uma forma que eu aprendi a tipar o body.

```javascript
  interface CityProps {
    name: string
  }

  export const create = (req: Request<{}, {}, CityProps>, res: Response) => {

    return res.send("Created!")
  }
```

# Aula 11

## Middleware de validação Yup

Um Middleware é uma função que ocorre antes do processamento final. Por exemplo:

```javascript
  export const createBodyValidator: RequestHandler = async (req, res, next) => {
    try {
      await bodyRequestValidation.validate(req.body, { abortEarly: false })
      return next()
    } catch (err) {
      const yupError = err as yup.ValidationError
      const errors: Record<string, string> = {}

      yupError.inner.forEach(error => {
        if (error.path === undefined) return

        errors[error.path] = error.message
      })

      return res.status(StatusCodes.BAD_REQUEST).json({ errors })
    }
  }

  router.post('/city', CityControllers.createBodyValidator, CityControllers.create)
```
Observe acima que o CityControllers.createBodyValidator é um middleware. Ele ocorre antes da função create. Esse middleware é responsavel para validar o body, usando o yup. Se tudo ocorrer bem, é retornado **next()**. Essa função next() é usada para executar a proxima função da lista quando feita a requisição da rota */city*. Que nesse caso é CityControllers.create