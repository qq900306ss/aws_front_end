# 購物車 API 串接說明文件

## 基本資訊

- API 基礎路徑：`https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging`
- 所有請求需要包含授權令牌（JWT）在 `Authorization` 標頭中
- 所有回應均為 JSON 格式

## 商品結構

商品（Product）包含以下欄位：

```json
{
  "id": "商品唯一識別碼",
  "name": "商品名稱",
  "description": "商品描述",
  "price": 商品價格（浮點數）,
  "stock": 庫存數量（整數）,
  "category": "商品類別",
  "image_url": "商品圖片URL",
  "created_at": "創建時間",
  "updated_at": "更新時間"
}
```

## 購物車項目結構

購物車項目（CartItem）包含以下欄位：

```json
{
  "product_id": "商品唯一識別碼",
  "name": "商品名稱",
  "description": "商品描述",
  "price": 商品單價（浮點數）,
  "quantity": 數量（整數）,
  "image_url": "商品圖片URL",
  "category": "商品類別",
  "subtotal": 小計金額（浮點數，等於 price * quantity）
}
```

## 購物車結構

購物車（Cart）包含以下欄位：

```json
{
  "id": "購物車唯一識別碼",
  "user_id": "用戶唯一識別碼",
  "items": [購物車項目陣列],
  "total": 總金額（浮點數）,
  "created_at": "創建時間",
  "updated_at": "更新時間"
}
```

## API 端點

### 1. 獲取購物車

- **URL**: `/cart`
- **方法**: `GET`
- **描述**: 獲取當前用戶的購物車內容
- **請求標頭**:
  - `Authorization`: Bearer {JWT令牌}
- **回應**:
  - 成功: HTTP 200
    ```json
    {
      "id": "購物車ID",
      "user_id": "用戶ID",
      "items": [
        {
          "product_id": "商品ID",
          "name": "商品名稱",
          "description": "商品描述",
          "price": 100.0,
          "quantity": 2,
          "image": "圖片URL",
          "category": "類別",
          "subtotal": 200.0
        }
      ],
      "total": 200.0,
      "created_at": "2025-03-31T12:00:00Z",
      "updated_at": "2025-03-31T12:30:00Z"
    }
    ```
  - 失敗: HTTP 401（未授權）或 HTTP 500（伺服器錯誤）

### 2. 更新整個購物車

- **URL**: `/cart`
- **方法**: `POST`
- **描述**: 更新整個購物車內容（替換現有項目）
- **請求標頭**:
  - `Authorization`: Bearer {JWT令牌}
- **請求體**:
  ```json
  {
    "items": [
      {
        "product_id": "商品ID",
        "quantity": 2
      },
      {
        "product_id": "另一個商品ID",
        "quantity": 1
      }
    ]
  }
  ```
- **回應**:
  - 成功: HTTP 200（返回更新後的購物車）
  - 失敗: HTTP 400（請求錯誤）、HTTP 401（未授權）或 HTTP 500（伺服器錯誤）

### 3. 清空購物車

- **URL**: `/cart`
- **方法**: `DELETE`
- **描述**: 清空當前用戶的購物車
- **請求標頭**:
  - `Authorization`: Bearer {JWT令牌}
- **回應**:
  - 成功: HTTP 200（返回清空後的購物車）
  - 失敗: HTTP 401（未授權）或 HTTP 500（伺服器錯誤）

### 4. 添加項目到購物車

- **URL**: `/cart/item`
- **方法**: `POST`
- **描述**: 添加或增加商品到購物車
- **請求標頭**:
  - `Authorization`: Bearer {JWT令牌}
- **請求體**:
  ```json
  {
    "product_id": "商品ID",
    "quantity": 1
  }
  ```
- **回應**:
  - 成功: HTTP 200（返回更新後的購物車）
  - 失敗: HTTP 400（請求錯誤）、HTTP 401（未授權）或 HTTP 500（伺服器錯誤）

### 5. 從購物車移除項目

- **URL**: `/cart/item`
- **方法**: `DELETE`
- **描述**: 從購物車中移除或減少商品數量
- **請求標頭**:
  - `Authorization`: Bearer {JWT令牌}
- **請求體**:
  ```json
  {
    "product_id": "商品ID",
    "quantity": 1  // 要減少的數量，如果為0或大於等於當前數量，則完全移除該項目
  }
  ```
- **回應**:
  - 成功: HTTP 200（返回更新後的購物車）
  - 失敗: HTTP 400（請求錯誤）、HTTP 401（未授權）或 HTTP 500（伺服器錯誤）

## 錯誤處理

所有錯誤回應均包含一個 JSON 物件，其中包含一個 `error` 欄位，說明錯誤原因：

```json
{
  "error": "錯誤訊息"
}
```

常見錯誤訊息包括：
- `未授權`：用戶未登入或令牌無效
- `無法讀取請求體`：請求格式錯誤
- `無效的購物車數據`：請求數據格式不正確
- `商品不存在`：指定的商品ID不存在
- `商品庫存不足`：請求的數量超過了可用庫存

## 前端實現範例

### 獲取購物車

```javascript
async function getCart() {
  try {
    const response = await fetch('https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('獲取購物車失敗');
    }
    
    const cart = await response.json();
    return cart;
  } catch (error) {
    console.error('獲取購物車時出錯:', error);
    throw error;
  }
}
```

### 添加商品到購物車

```javascript
async function addToCart(productId, quantity) {
  try {
    const response = await fetch('https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/cart/item', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '添加到購物車失敗');
    }
    
    const updatedCart = await response.json();
    return updatedCart;
  } catch (error) {
    console.error('添加到購物車時出錯:', error);
    throw error;
  }
}
```

### 更新整個購物車

```javascript
async function updateCart(items) {
  try {
    const response = await fetch('https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '更新購物車失敗');
    }
    
    const updatedCart = await response.json();
    return updatedCart;
  } catch (error) {
    console.error('更新購物車時出錯:', error);
    throw error;
  }
}
```

## 注意事項

1. 所有請求都需要有效的 JWT 令牌，可以通過登入 API 獲取
2. 購物車會自動計算每個項目的小計（subtotal）和總計（total）
3. 添加商品時會檢查庫存，如果庫存不足會返回錯誤
4. 購物車數據會保存在伺服器端，用戶可以在不同設備上訪問相同的購物車
5. API 路徑中的 `/staging` 是 API Gateway 的階段名稱，在實際請求中需要包含
