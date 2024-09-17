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

O middleware criando na aula passada é importante para testar os dados antes da função principal. Só que tem um problema: Imagina ter que criar uma função para cada campo em cada requisição? ia ter varias funcões middleware parecidas. O codigo iria ficar bem bagunçado.

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

Observe que a função **validation** tem a typagem *TValidation*. 

```javascript
type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler
```

Essa é para informar que a função recebe um parametro chamado *getAllSchemas* e retorna um *RequestHandler*. O retorno é o mesmo da função criada na aula 11. Já o *getAllSchemas* é uma função. 

O **getAllSchemas** é do tipo *TGetAllSchemas*. Essa função recebe também uma função. O type *TGetAllSchemas* é :

```javascript
  type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>
```
Aqui diz que *getAllSchemas* é uma função que recebe como parametro o *getSchema* e retorna uma tipagem do tipo *TAllSchemas*, porem com o Partial. Esse Partial faz que a tipagem retornada não seja obrigatoria.

O **TAllSchemas** é o seguinte:

```javascript
type TAllSchemas = Record<TProperty, Schema<any>>
```

Aqui diz que o *TAllSchemas* é um objeto, que é retornado por *getAllSchemas*. A chave é do tipo **TProperty**, que pode ser **'body' | 'header' | 'params' | 'query'**. Já o valor é o Schema.

Ok, mas e o **getSchema: TGetSchema**? O *TGetSchema* é:

```javascript
type TGetSchema = <T>(schema: Schema<T>) => Schema<T>
```
O **TGetSchema** diz que a função *getSchema* recebe um *schema* de algum tipo generico **T**. E também retorna o *schema* desse tipo generico passado como parametro da função.

Para Ilustrar o passo a passo dessa loucura, pegarei como exemplo a função de validacão para a creação da cidade:

```javascript
interface CityProps {
  name: string
}

export const createValidation = validation((getSchema) => ({
  body: getSchema<CityProps>(yup.object().shape({
    name: yup.string().required().min(3)
  }))
}))

router.post('/city', CityControllers.createValidation, CityControllers.create)
```

### Vamos supor que a pessoa esteja criando uma cidade:

#### Chamando a rota /city

Ao chamar a rota /city com o metodo POST, ira primeiro executar o middleware de validação. O *createValidation*. Esse *createValidation* é igual a função de validação. Essa função de validação retorna uma função, que será salva dentro da variavel *createValidation*.

#### Função Validation

**validation** recebe como parametro uma função. Essa função recebe um parametro chamado *getSchema* e retorna um objeto. Esse objeto retornado tem a chave sendo o valor do que será validado. Nesse caso será o **body**. Já o valor é a **schema** do yup.

Ja dentro da função de **validation**, é salvo os schemas numa variavel *schemas*, usando a função *getAllSchemas* e retornando todos os schemas que foi passado lá no retorno da função que é como parametro de **validation**. Lá onde foi criado a constante **createValidation**. (Sim, é confuso!)

O **getAllSchemas** simplesmente recebe uma função: 
```javascript
const schemas = getAllSchemas((schema) => schema)
```
Essa função é do tipo **TGetSchema**, que basicamente recebe um schema com uma tipagem generica **T** e retorna um schema com essa tipatem **T**. Por isso que, quando a constante **createValidation** foi criada, a chave *body* tem o valor como uma função *getSchema<CityProps>*. Essa função **getSchema** usa o tipo generico **CityProps** para retornar um *schema* do tipo **CityProps**.

Com todos os schemas, a constante **errorsResult** é criada e é iniciado como objeto vacio. Essa constante é do tipo:
```javascript
Record<string, Record<string, string>>
```
Aqui quer dizer que **errorsResult** é um objeto onde a chave é uma string e o valor é outro objeto. Esse outro objeto tem chave e valor sendo string. Um exemplo desse objeto **errorsResult** é:
```javascript
{
	"errorsResult": {
		"body": {
			"name": "Deve ter pelo menos 3 caracteres"
		}
	}
}
```

Agora é validado as coisas. Primeiro deve transformar o objeto **schemas** em um array para fazer um loop. Object.entries é usado.

Explicando Object.entries:

**Object.entries({"teste": 0, "teste 2": 1})** ira retornar dois arrays. Cada array tera também um array. Ira retornar:
[['teste', 0], ['teste 2', 1]]

O **Object.entries(schemas)** retorna também um array de array. A primeira posição de cada array é a chave. A segunda posição de cada array é o schema. Nesse caso do createValidation, vai retornar somente um array com outro array dentro:
[['body': Schema]]

No *try/catch* ira validar usando o schema. Caso tenha alguem erro, o catch ira criar o erro com a mensagem e salvar dentro do objeto **errorsResult**

No final testara o tamanho do objeto **errorsResult**. Se estiver vazio, o next() ira ser retornado e prosseguirá com a função de criação de cidade. Caso contrario, o erro é mostrado e para por ai.


# Aula 22

## Criando a pasta providers

Essa pasta foi criada para colocar funções que irá manipular os dados no banco. Como criar, deletar, atualizar e por ai vai. Todas as funções do **CRUD**.