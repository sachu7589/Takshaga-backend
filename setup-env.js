const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Generate a secure random JWT secret
const generateJWTSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Check if .env file exists
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
    console.log('✅ .env file already exists');
    console.log('📝 Current .env content:');
    console.log(fs.readFileSync(envPath, 'utf8'));
} else {
    // Create .env file with default values
    const envContent = `# JWT Authentication Secret (Change this in production!)
JWT_SECRET=${generateJWTSecret()}

# Server Configuration
PORT=3000

# Database Configuration
MONGODB_URI=mongodb+srv://takshaga:Takshaga2025@takshagamanagement.yk8heda.mongodb.net/?retryWrites=true&w=majority&appName=takshagaManagement

# Environment
NODE_ENV=development
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📝 Generated JWT secret for development');
    console.log('⚠️  Remember to change JWT_SECRET in production!');
}

console.log('\n🚀 You can now start the server with: node index.js');
console.log('🔐 JWT authentication is ready to use!'); 