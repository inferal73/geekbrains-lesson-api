## Корзина (/shop)

#### GET
Получение корзины или создание новой корзины

**Параметры запроса**:
- user_id

**Примеры запроса**: 

- /shop?**user_id=_r54f5o455**
- /shop

**Ответ сервера**:

Если user_id передан (находится существующий юзер):
```json
{
    "user_id": "_r54f5o455",
    "cart": [
        {
            "product_id": "_qq4oggunn",
            "product": "iPhone X",
            "price": "75000"
        },
        {
            "product_id": "_lcdpe3xxs",
            "product": "iPad Pro 9.7",
            "price": "23990"
        }
    ]
}
```
Если запрос без параметров (создаётся новый юзер):
```json
{
    "user_id": "_8fh8v49aa",
    "cart": []
}
```

---

#### POST
Добавление товара

**Параметры запроса**:
- user_id
- product
- price

**Пример запроса**: 

/shop?**user_id=_kg0j5rfgr&product=iPhone X&price=75000**

**Ответ сервера**:

Информация о добавленном продукте
```json
{
    "product_id": "_qq4oggunn",
    "product": "iPhone X",
    "price": "75000"
}
```

---

#### DELETE
Удаление товара

**Параметры запроса**:
- user_id
- product_id

**Пример запроса**: 

/shop?**user_id=_kg0j5rfgr&product_id=_lcdpe3xxs**

**Ответ сервера**:


Обновлённая корзина без удалённого товара
```json
{
    "user_id": "_r54f5o455",
    "cart": [
        {
            "product_id": "_qq4oggunn",
            "product": "iPhone X",
            "price": "75000"
        }
    ]
}
```
