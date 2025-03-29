const amplifyConfig = {
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'us-west-2',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'YOUR_USER_POOL_ID', // You'll need to replace this with your actual User Pool ID
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: 'YOUR_USER_POOL_CLIENT_ID', // Replace with your actual Client ID
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,
  },
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
