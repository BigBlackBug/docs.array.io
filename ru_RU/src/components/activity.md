# Activity
Система взаимодействия между собой DApps по потокам сервисов сообщений.

### Цели
- Возможность DApp запрашивать разрешения на использование сервисов другого DApp
- Возможность декларировать резервацию на набор функций которые предоставляет другой DApp

### Типы взаимодействий
- Потоковый - позволяет создавать асинхронные pubsub сервисы, для постоянного обмена сообщениями, с возможностью подписки.
- Статичный - позволяет создать еденичный запрос на возвращаемое значение.

### Manifest
*На предоставление функционала для других DApp*

``` js
{
  // ... other fields
  "services": [
    {
      "name": String, // public Serivce name
      "type": Static, // Enum { Static, Emitter }
      "arguments": [{ name, type }, ...], // Срез аргументов с названием и типом 
      "return": Type // Enum { Map, Array, ...other basic types }
    },

    {
      "name": String, // public Serivce name
      "type": Emitter, // Enum { Static, Emitter }
      "rules": [ ...rules ], // Права доступные для сервиса: Enum { Send, Receive }
      "arguments": [{ name, type }, ...], // Срез аргументов с названием и типом
      "event_type": Type // Enum { Map, Array, ...other basic types }
    }
  ]
}
```

*На получение доступа к API другого DApp*
``` js
{
  "activities": [
    "app_name.{service_name}" // Перечисление требуемых activities сервисов
  ]
}
```

### Пояснения к принципам работы
Главная цель нашего взаимодействия в том чтобы наши DApp могли предоставлять и описывать схему относительно сервисов и данных которые они предоставляют, возвращают и тд. Относительно создания удобных обвязок предлагается декларативный стиль для описания схемы данных которую может получать и отправлять наши DApp, в целях безопасности разрешаются для взаимодействия только стандартные типы данных поддерживаемые JSON. С запретом на трансфер бинарных данных, для исключения возможности эксплутации уязвимостей. Также для работы с безопасностью предусматривается что в процессе проверки на запрос данных необходимо подтвердить что установленный DApp который предоставляет сервис - должны быть только от доверенных разработчиков из маркетплейса - чтобы исключить возможность подделки имени бандла и доступа к нему.

#### Дополнительные Возможности относительно декларации запрашиваемых сервисов
Прокси-декларации доступных сервисов, позволит нам генерировать из деклараций запрашиваемых в DApp - полноценные модули API доступные к JS, для целей безопасности будет исключена возможность прямой отправки каких либо сообщений к другому DApp.

``` js
// Плохая реализация
Service.send("other_dapp.service_name", { props: 1, props: 2}) 
```  

``` js
// Хорошая реализация на мета-декларациях
import SomeService from "array.io/services/other_dapp/service_name"

let result = await SomeService(1, 2)
// { ... result }
```

Пояснение: при использовании единого сервиса в который мы отправляем данные, у нас возникает проблема дополнительной валидации в моменте работы с middleware основного процесса который будет оркестрировать данные. Хороший пример подразумевает что у нас есть изолированный компонент, который генерирует нам фантомную сущность через которую проходит рантайм валидацию параметров, входных данных, и данных которые будут возвращаться еще на этапе генерации константной сущности. Также это позволит нам иметь дополнительные гарантии и документирование относительно типизации:

*Относитеьно реальный пример*

Манифест
``` js
[
  {
    "name": "get_cats",
    "type": "static",
    "arguments": [{
      "name": "user_id",
      "type": "string"
    }, {
      "name": "alive",
      "type": "bool"
    }],

    "return": {
      "is_array": true,
      "contain": "map",
      "entries": {
        "name": "string",
        "age": "number"
      }
    }
  }, {
    "watch_new_cats",
    "type": "emitter",

    "arguments": [{
      "name": "user_id",
      "type": "string"
    }, {
      "name": "alive",
      "type": "bool"
    }],

    "event_type": {
      "contain": "map",

      "entries": {
        "name": "string",
        "age": "number"
      }
    }
  }
]
```

Примерная имплементация сервиса в предоставляющем его DApp
``` js
const { Activity } = GlobalContext

// Static
// Имплементируем статичный сервис get_cats, с параметрами
Activity.register_static('get_cats', async (user_id, alive) => {
  let result = await dapp_function_get(...args);
  return result
})

// Emitter
// Запрашиваем экземпляр эмитера для сервиса watch
let emitter = Activity.get_emitter("watch_new_cats")
// Получаем подписчика по id
let subscriber = emitter.get_subscriber("subscriber_id")

// { meta object of arguments for watch }
console.log(subscriber.params)

// send message to subscriber
await subscriber.send({
  name: "Hello Kitty",
  age: 1
})

```

Типизированная декларация
``` typescript 
declare function get_cats(user_id: string, alive: bool): Promise<{ name: string, age: number}[]>;
declare function watch_new_cats(user_id: string, alive: bool, cb: ({ name: string, age: number}) => void);
```

Как будет выглядеть вызов сервиса из JS
``` js
import watchNewCats from "array.io/services/crypto_kitties/watch_new_cats"
import getCats from "array.io/services/crypto_kitties/get_cats"

// Статичный вызов
let user_cats = await getCats("12345", 10) // Возвращаемые значения асинхронные, поэтому они Promise 

// Вызов подписки в сервис
watchNewCats("12345", 123, ({ name, age }) => {
  console.log(`Got new cat! Cat is ${name} with ${age} age`)
})
```

### Дополнительные ссылки
Похожая мобильная имплементация в системе Android
[IntentService](https://developer.android.com/reference/android/app/IntentService)
[Activity](https://developer.android.com/reference/android/app/Activity)
[Services](https://developer.android.com/guide/components/services)

Средства метапрограммирования фантомных сущностей в js
[Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

Написание лоадера относительно webpack сборщика
[Write Webpack Loader](https://webpack.js.org/contribute/writing-a-loader/)