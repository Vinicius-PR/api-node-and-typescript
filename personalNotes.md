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

# Aula 12

## Melhorando a construção das validações

O middleware criando na aula passada é importante para testar os dados antes da função principal. Só que tem um problema: Imagina ter que criar uma função para cada campo em cada requisição? Ia ter varias funcões middleware parecidas. O codigo iria ficar bem bagunçado.

Então nessa aula foi crianda uma função de validação que retorna uma outra função para validar o campo/requisição desejada. O campo e os schemas do yup são passadas como parametro nessa função.

A Função de validação ficou da seguinte maneira:

```javascript
type TProperty = 'body' | 'header' | 'params' | 'query'

type TGetSchema = <T>(schema: Schema<T>) => Schema<T>

type TAllSchemas = Record<TProperty, Schema<any>>

type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>

type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler

export const validation: TValidation = (getAllSchemas) => async (req, res, next) => {
  const schemas = getAllSchemas((schema) => schema)

  const errorsResult: Record<string, Record<string, string>> = {}
  Object.entries(schemas).forEach(([key, schema]) => {
    try {
      schema.validateSync(req[key as TProperty], { abortEarly: false })
    } catch (err) {
      const yupError = err as ValidationError
      const errors: Record<string, string> = {}

      yupError.inner.forEach(error => {
        if (error.path === undefined) return

        errors[error.path] = error.message
      })

      errorsResult[key as TProperty] = errors
    }
  })

  if (Object.entries(errorsResult).length === 0) {
    return next()
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorsResult })
  }
}
```

Observe que a função **validation** tem a typagem *TValidation*. Essa informar que a função recebe um parametro chamado *getAllSchemas* e retorna um *RequestHandler*. O retorno é o mesmo da função criada na aula 11. Já o *getAllSchemas* é uma função que tem o proposito de retornar os schemas. Esses shcemas que é passado na função de validation é um objeto. Onde a chave é o que será testado (body, query, params...) e o valor é o schema do yup.

Então esse objeto de schemas é passado para a função de validation e esse objeto é usado nessa função *getAllSchemas*. *GetAllSchemas*

Para usar essa função de validação é da seguinte maneira:

```javascript
interface CityProps {
  name: string
}

export const createValidation = validation((getSchema) => ({
  body: getSchema<CityProps>(yup.object().shape({
    name: yup.string().required().min(3)
  }))
}))
```
