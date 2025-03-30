// This file is kept for backward compatibility but is no longer used
// We've switched to direct API integration in api.js

const amplifyConfig = {
  API: {
    endpoints: [
      {
        name: 'WinsurfAPI',
        endpoint: 'https://0d2f8bryih.execute-api.us-west-2.amazonaws.com/staging',
        region: 'us-west-2'
      }
    ]
  }
};

export default amplifyConfig;
