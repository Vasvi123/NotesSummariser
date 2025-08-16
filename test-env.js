require('dotenv').config();

console.log('🔍 Testing Environment Variables...');
console.log('GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? '✅ Configured' : '❌ Missing');
console.log('GITHUB_ENDPOINT:', process.env.GITHUB_ENDPOINT);
console.log('GITHUB_MODEL:', process.env.GITHUB_MODEL);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
