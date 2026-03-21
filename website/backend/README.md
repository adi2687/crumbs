# CRUMBS Backend Authentication Server

A secure JWT-based authentication system for the CRUMBS decentralized storage platform.

## Features

- JWT Authentication
- User Registration & Login
- Password Hashing with bcrypt
- Rate Limiting
- CORS Support
- MongoDB Integration
- Security Headers (Helmet)
- Device ID Tracking

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed and running)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Copy the config file and update with your values
cp config.env.example config.env
```

3. Update `config.env` with your settings:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
MONGO_URI=mongodb://localhost:27017/crumbs_auth
```

4. Start the server:
```bash
# For development
npm run dev

# For production
npm start
```

## API Endpoints

### Authentication Routes

#### POST /api/auth/register
Register a new user

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "deviceId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email",
    "deviceId": "device_id"
  }
}
```

#### POST /api/auth/login
Login user

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email",
    "deviceId": "device_id",
    "lastLogin": "timestamp"
  }
}
```

#### GET /api/auth/me
Get current logged in user (protected)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### POST /api/auth/logout
Logout user (protected)

### Health Check

#### GET /api/health
Check server status

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Security headers with Helmet
- Input validation

## Frontend Integration

The frontend is configured to connect to `http://localhost:5000` by default. Make sure to update this URL in production.

### Using the API in Frontend

```javascript
// Login example
const login = async (username, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('crumbs_token', data.token);
    localStorage.setItem('crumbs_user', JSON.stringify(data.user));
  }
  return data;
};

// Protected route example
const getUserData = async () => {
  const token = localStorage.getItem('crumbs_token');
  const response = await fetch('http://localhost:5000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": {...}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Development

The server runs in development mode by default with hot reload using nodemon.

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a strong `JWT_SECRET`
3. Use a production MongoDB URI
4. Consider using a reverse proxy (nginx)
5. Enable HTTPS

## License

MIT
