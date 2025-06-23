# JWT Authentication Setup

## Overview
This backend now includes JWT (JSON Web Token) authentication with the following features:

- **Token-based authentication** for secure API access
- **Middleware protection** for sensitive routes
- **Environment variable configuration** for security
- **Token verification endpoint** for frontend validation

## Environment Variables

Create a `.env` file in the root directory with:

```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3000
MONGODB_URI=mongodb+srv://takshaga:Takshaga2025@takshagamanagement.yk8heda.mongodb.net/?retryWrites=true&w=majority&appName=takshagaManagement
```

## API Endpoints

### Authentication Endpoints

1. **POST /api/users/register** - Register new user
2. **POST /api/users/login** - Login and get JWT token
3. **GET /api/users/me** - Verify token and get current user (Protected)

### Protected Routes

Routes that require authentication are marked with the `authenticateToken` middleware:

#### User Management
- **GET /api/users/me** - Get current user profile (Protected)

#### Category Management
- **POST /api/categories/insert** - Create category (Protected)
- **PUT /api/categories/update/:id** - Update category (Protected)

#### Client Management
- **POST /api/clients/insert** - Create client (Protected)
- **PUT /api/clients/update/:id** - Update client (Protected)
- **PUT /api/clients/status/:id** - Update client status (Protected)

#### Estimate Management
- **POST /api/estimates/insert** - Create estimate (Protected)
- **PUT /api/estimates/update/:id** - Update estimate (Protected)
- **PUT /api/estimates/status/:id** - Update estimate status (Protected)

#### Payment Management
- **POST /api/client-payments/** - Create client payment (Protected)
- **PUT /api/client-payments/:id** - Update client payment (Protected)

#### Expense Management
- **POST /api/client-expenses/** - Create client expense (Protected)

### Public Routes (No Authentication Required)

- **GET /api/categories/display** - Get all categories
- **GET /api/clients/display** - Get all clients
- **GET /api/clients/display/:id** - Get client by ID
- **GET /api/estimates/display** - Get all estimates
- **GET /api/estimates/display/:id** - Get estimate by ID
- **GET /api/estimates/client/:clientId** - Get estimates by client
- **GET /api/client-payments/client/:clientId** - Get payments by client
- **GET /api/client-expenses/client/:clientId** - Get expenses by client

## How to Use

### 1. Login to get token
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "employee"
  }
}
```

### 2. Use token in protected requests
```bash
GET /api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Token verification
The `/api/users/me` endpoint verifies the token and returns current user data.

## Middleware Usage

To protect any route, add the `authenticateToken` middleware:

```javascript
const { authenticateToken } = require('../middleware/auth');

// Protected route
router.post('/protected-endpoint', authenticateToken, async (req, res) => {
    // req.user contains the decoded token data
    const userId = req.user._id;
    const userRole = req.user.role;
    // ... your route logic
});
```

## Testing the Endpoints

### Test Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Creating Protected Resource
```bash
curl -X POST http://localhost:3000/api/categories/insert \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"New Category"}'
```

## Security Notes

1. **Change the JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Set appropriate token expiration** (currently 7 days)
4. **Store tokens securely** on the frontend
5. **Implement token refresh** for better UX

## Error Responses

- **401 Unauthorized** - No token provided
- **403 Forbidden** - Invalid or expired token
- **404 Not Found** - User not found (for /me endpoint) 