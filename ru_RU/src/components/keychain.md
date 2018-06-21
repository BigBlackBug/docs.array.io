# Keychain
Компонент работы с подписью транзакций в Dapp, позволяет:
- Создавать новые ключи
- Подписыать транзакции с помощью ключа
- Просматривать список всех доступных ключей
- Смотреть установленный по умолчанию для текущего DApp ключ.

### Основные структуры данных.
- [KeyStore](https://github.com/arrayio/docs.array.io/blob/master/typing-declarations/keychain.d.ts#L26): экземпляр key-value хранилища ключей, где в качестве ключа выступает название dapp, и в качестве значения экземпляр активного ключа ActiveKey.
  - [ActiveKey](https://github.com/arrayio/docs.array.io/blob/master/typing-declarations/keychain.d.ts#L20): экземпляр обертка поверх статичных методов Keychain, объект имеет встроенный метод вызова подписи.
  - [list](https://github.com/arrayio/docs.array.io/blob/master/typing-declarations/keychain.d.ts#L30): метод возвращает нормализованный список ключей по отношению к dapp, для удобного формирования свичера.
  - [get/set](https://github.com/arrayio/docs.array.io/blob/master/typing-declarations/keychain.d.ts#L27): методы для простой работы с ключами
- [Keychain](https://github.com/arrayio/docs.array.io/blob/master/typing-declarations/keychain.d.ts#L34): класс с базовыми статичными методами для работы с ключами и подписями, также хранящий в себе текущий ключ относительно запущенного сейчас DApp.

### Принцип работы хранения KeyStore
Активные названия ключей в мапе можно вызывать каждый раз напрямую из Keychain и хранить в хранилище по простому объекту с его вхождениями, инициализации методов относительно ActiveKey производятся после выборки по простым принципам Builder паттерна. 

### Примеры использования
```jsx
// Например где-нибудь в основном клиенте
let keyname = "my_awesome_key";
let createdKey = await Keychain.create(key: keyname, algorithm: "AES256", curve: "SECP256K1");

KeyStore.setKey("my_dapp_name", createdKey); // Symlink new key in keystore
KeyStore.list() // [ { dapp: "my_dapp_name", key: (ps. from createdKey) } ]

// Использование где-нибудь в DApp
try {
  let signed = await Keychain.defaultKey.sign(
    "de5f4d8974715e20f47c8bb609547c9e66b0b9e31d521199b3d8",
    "871689d060721b5cec5a010080841e00000000000011130065cd1d0000000000000000"
  );

  console.log(signed);
  // Output: 200095af52eb0281237904da0f03ba2091d39dc256950b12b21deb990ff620a3a57876b1c3fca281612314f6155736cd0507355bf031d33330ad0cc5e687d7eb02
} catch (error) {
  // error exception handle
}
```

### Смежные ссылки:
[Пример команд для pipe based команды keychain](https://github.com/arrayio/array-io-keychain/wiki/keychain-sample-commands)

Пример вывода и ответа на команды keychain-ом
``` 
{ "command": "CMD_CREATE", "params": { "keyname": "test1", "encrypted": true, "algo": "CIPHER_AES256", "curve": "CURVE_SECP256K1" } }
{
  "id": 0,
  "result": true
}


{ "command": "CMD_SIGN", "params": { "chainid": "de5f4d8974715e20f47c8bb609547c9e66b0b9e31d521199b3d8d6af6da74cb1", "transaction": "871689d060721b5cec5a010080841e00000000000011130065cd1d0000000000000000", "keyname": "test1" } }
{
  "id": 0,
  "result": "200095af52eb0281237904da0f03ba2091d39dc256950b12b21deb990ff620a3a57876b1c3fca281612314f6155736cd0507355bf031d33330ad0cc5e687d7eb02"
}


{ "command": "CMD_LIST" }
{
  "id": 0,
  "result": [
    "test1"
  ]
}
```