# Manifest
Предлагаемая конечная версия схемы манифеста

```typescript
interface Author {
  email: string;
  name: string;
}

interface Description {
  // Массив строк с ключевыми словами для поиска
  keywords: string[];
  // Главная страница проекта
  homepage: string;
  // Полное описание проекта в html или markdown
  content: string;
}

enum Permission {
  KeychainPrivate,
  KeychainFull,

  Notification,
  Activity,
  Platform,
  Logger,
  Tray,
  IPFS,
  P2P,
}

interface Security {
  // Массив с перечислением запрашиваемых dapp разрешений
  permissions: Permission[];
}

interface Bundle {
  assets: string; // Path to other app assets eg images, fonts, etc..
  script: string; // Path eg build.js
  entry: string;  // Path eg index.html
  icons: string;  // Path to icons folder with [1x, 2x, 3x]
}

type ServiceName = string;
type Services = ServiceName[];

type Dependency = string | {
  optional: boolean;
  name: string;
};

interface Manifest {
  buildCode: number;
  title: string;

  description: Description;
  author: Author;

  dependencies: Dependency[];
  services: Services;
  security: Security;
  bundle: Bundle;
}
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
    "getCats",
    "watchCats"
  ]
}
```