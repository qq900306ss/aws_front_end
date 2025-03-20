export default async function handler(req, res) {
  const { path } = req.query;
  const apiPath = path.join('/');
  
  // 構建 URL，包括查詢參數
  let apiUrl = `https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging/${apiPath}`;
  
  // 如果是 DELETE 請求，添加 email 查詢參數
  if (req.method === 'DELETE' && req.query.email) {
    apiUrl = `https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging?email=${req.query.email}`;
  }
  
  console.log(`Proxying ${req.method} request to: ${apiUrl}`);
  
  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };
    
    // 只有在非 GET/HEAD 請求時添加 body
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }
    
    console.log('Fetch options:', fetchOptions);
    
    const response = await fetch(apiUrl, fetchOptions);
    
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response data:`, data);
    
    // 設置適當的狀態碼和響應數據
    res.status(response.status);
    
    if (typeof data === 'object') {
      res.json(data);
    } else {
      res.send(data);
    }
  } catch (error) {
    console.error(`Error proxying request:`, error);
    res.status(500).json({ error: 'Failed to proxy request', message: error.message });
  }
}
