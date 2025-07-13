const https = require('https');

// Test Expo Token
function testExpoToken(token) {
  const options = {
    hostname: 'expo.dev',
    path: '/api/v2/user',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Expo token is valid!');
        const user = JSON.parse(data);
        console.log(`   Logged in as: ${user.username}`);
      } else {
        console.log('❌ Expo token is invalid or expired');
        console.log(`   Status: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Error testing Expo token:', error.message);
  });

  req.end();
}



// Usage instructions
console.log('🔑 Token Testing Script');
console.log('========================');
console.log('');
console.log('To test your Expo token, run:');
console.log('node test-tokens.js <EXPO_TOKEN>');
console.log('');
console.log('Example:');
console.log('node test-tokens.js exp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
console.log('');

// If token is provided as command line argument
if (process.argv.length === 3) {
  const expoToken = process.argv[2];
  
  console.log('Testing Expo token...');
  console.log('');
  
  testExpoToken(expoToken);
} else {
  console.log('No token provided. Please run with your Expo token as argument.');
} 