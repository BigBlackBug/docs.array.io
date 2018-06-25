# Manifest
Предлагаемая конечная версия схемы манифеста

``` js
Scheme({
  /*
    Vesrion reference: https://developer.android.com/studio/publish/versioning
    buildCode - номер сборки текущего приложения, основная версия
    version - строка с версией которая будет отображна пользователю
  */
  "buildCode": Number,

  // Название приложения
  "title": String,
  
  "author": {
    "email": String,
    "name": String,
  },

  "description": {
    // Полное описание проекта в html или markdown
    "content": String,
    // Массив строк с ключевыми словами для поиска
    "keywords": Array,
    // Главная страница проекта
    "homepage": URLString,
  },

  "security": {
    // Массив строк с запрашиваемыми для dapp разрешениями
    "permissions": []string,
  },

  // Опции runtime окружения dapp
  "bundle": {
    "entry": String, // Path eg index.html
    "script": String, // Path eg build.js
    "icons": String, // Path to icons folder with [1x, 2x, 3x]
    "assets": String // Path to other app assets eg images, fonts, etc..
  }

  // Сервисы (подробнее в разделе Activity)
  "services": [
    {
      "name": String, // публичное название сервиса
      "type": Emitter, // Enum { Static, Emitter }
      "rules": [ ...rules ], // Права доступные для сервиса: Enum { Send, Receive }
      "arguments": [{ name, type }, ...], // Срез аргументов с названием и типом
      "event_type": Type // Enum { Map, Array, ...other basic types }
    }
  ]
})
```

*Manifest Пример*
``` js
{
  "buildCode": 1,
  "title": "MyAwesomeApp",
  
  "author": {
    "email": "dev@example.com",
    "name": "Awesome Name",
  },

  "description": {
    "content": "Is description of my awesome dapp!",
    "keywords": ["awesome", "blockchain", "keywords"],
    "homepage": "http://github.com/user/awesome_app",
  },

  "apperance": {
    "inject_type": "Overlap",
    "decorations": false,
  },

  "security": {
    "permissions": ["storage", "logger", "ipfs"],
  },

  "bundle": {
    "entry"  : "index.html",
    "script" : "bundle.js",
    "assets" : "assets/",
    "icons"  : "icons/"
  },

  "services": [
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
    }
  ]
}
```