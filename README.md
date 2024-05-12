# Документация серверного API

## Конечные точки (Endpoints)

### Получение товаров определённого типа

- **Метод**: GET
- **URL**: `/api/products?type=***`
- **Описание**: Запросы возвращают список товаров конкретного типа. Можно использовать фильтры по категории, цене и названию или получить товары по списку идентификаторов.
- **Параметр type**:
  - тип продукта, который может быть `bouquets`, `toys` или `postcards`.
- **Параметры запроса**:
  - `category`: строка (необязательный) - фильтр товаров по категории.
  - `minPrice`: число (необязательный) - фильтр товаров по минимальной цене.
  - `maxPrice`: число (необязательный) - фильтр товаров по максимальной цене.
    специфичных товаров.
- **Пример запроса**:
  - `/api/products?type=bouquets`
  - `/api/products?type=toys`
  - `/api/products?type=postcards`
  - Фильтрация: `/api/products?category=toys&minPrice=500`
  - Список ID: `/api/products?list=1,2,3`

### Получение всех продуктов

- **Метод**: GET
- **URL**: `/api/products`
- **Описание**: Запрос возвращает список всех продуктов. Можно получить товары по списку идентификаторов или названию (часть названия).
- **Параметры запроса**:
  - `name`: строка (необязательный) - поиск товаров, содержащих указанные символы в названии.
  - `list`: строка (необязательный) - список ID товаров, разделённых запятыми, для получения специфичных товаров.
- **Пример запроса**:
  - Все товары: `/api/products`
  - Список ID: `/api/products?list=1,2,3`
  - Список по совпадению названия: `/api/products?name=розы`

### Оформление заказа

- **Метод**: POST
- **URL**: `/api/orders`
- **Описание**: Запрос создаёт новый заказ с данными, предоставленными в теле запроса.
- **Тело запроса**:
  ```json
  {
    "buyer": {
      "name": "Иван Иванов",
      "phone": "1234567890"
    },
    "recipient": {
      "name": "Мария Петрова",
      "phone": "0987654321"
    },
    "address": "ул. Советская, дом 10, кв 15",
    "paymentOnline": true,
    "deliveryDate": "2023-10-05",
    "deliveryTime": "с 9:00 до 12:00",
    "products": [
      {
        "id": 1,
        "quantity": 2
      },
      {
        "id": 2,
        "quantity": 3
      }
    ]
  }
  ```

## Пример запроса с использованием cURL:

```bash
curl -X POST http://localhost:3000/api/orders -H 'Content-Type: application/json' -d '{
  "buyer": {"name": "Иван Иванов", "phone": "1234567890"},
  "recipient": {"name": "Мария Петрова", "phone": "0987654321"},
  "address": "ул. Советская, дом 10, г. Москва, Россия",
  "paymentOnline": true,
  "deliveryDate": "2023-10-05",
  "deliveryTime": "с 9:00 до 12:00",
  "products": [{"id": 1, "quantity": 2}, {"id": 2, "quantity": 3}],
  "total":
```

## Примечания

- Параметры, помеченные как "необязательный", могут быть опущены в запросе.
- Все данные, включая номера телефонов и адреса, должны быть предоставлены в соответствии с требованиями формата данных.

# Cart API Documentation

## Endpoints

### 1. Регистрация корзины

- **Endpoint**: `POST /api/cart/register`
- **Description**: Регистрирует новую корзину и возвращает уникальный ключ доступа (`accessKey`), который сохраняется в куках.
- **Response**:
  - **200 OK**:
    ```json
    {
      "accessKey": "unique-access-key",
      "message": "Existing cart key reused."
    }
    ```

### 2. Получение данных корзины

- **Endpoint**: `GET /api/cart`
- **Description**: Возвращает содержимое корзины для текущего ключа доступа, сохранённого в куках.
- **Response**:
  - **200 OK**:
    ```json
    {
      "items": [
        {
          "productId": 1,
          "quantity": 2
        }
      ]
    }
    ```
  - **401 Unauthorized**:
    ```json
    { "error": "Access denied" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Cart not found" }
    ```

### 3. Добавление товара в корзину

- **Endpoint**: `POST /api/cart/items`
- **Description**: Добавляет товар в корзину, используя текущий ключ доступа. Требуется передать `productId` и `quantity`.
- **Body**:
  ```json
  {
    "productId": 1,
    "quantity": 2
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Item added to cart",
      "cart": {
        "items": [
          {
            "productId": 1,
            "quantity": 2
          }
        ]
      }
    }
    ```
  - **401 Unauthorized**:
    ```json
    { "error": "Access denied" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Cart not found" }
    ```

### 4. Удаление товара из корзины

- **Endpoint**: `DELETE /api/cart/items`
- **Description**: Удаляет товар из корзины, используя текущий ключ доступа. Требуется передать `productId`
- **Body**:
  ```json
  {
    "productId": 1
  }
  ```
- **Response**:

  - **200 OK**:
    ```json
    {
      "message": "Item removed from cart",
      "cart": {
        "items": []
      }
    }
    ```
  - **401 Unauthorized**:
    ```json
    { "error": "Access denied" }
    ```
  - **404 Not Found**:
    ```json
    { "error": "Product not found in cart" }
    ```

- **Notes**

  - Убедитесь в корректной обработке куки, так как они используются для поддержания сессии корзины.

  - Все эндпоинты должны быть защищены и правильно проверяться, чтобы предотвратить несанкционированный доступ.
