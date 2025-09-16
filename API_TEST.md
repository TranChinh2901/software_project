# Auth API Test

## Base URL
```
http://localhost:4000
```

## 1. Register User

### Request
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe",
    "email": "john@example.com", 
    "password": "password123",
    "role": "user"
  }'
```
### Expected Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "fullname": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 2. Login

### Request
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Expected Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "fullname": "John Doe", 
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 3. Get Profile (Protected Route)

### Request
```bash
curl -X GET http://localhost:4000/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Expected Response
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john@example.com", 
    "role": "user",
    "created_at": "2025-09-16T13:19:46.000Z",
    "updated_at": "2025-09-16T13:19:46.000Z"
  }
}
```

## 4. Logout

### Request
```bash
curl -X POST http://localhost:4000/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Expected Response
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": {
    "message": "Please remove the token from client storage"
  }
}
```

## Role-based Access Example

### Protected route requiring admin role
```bash
# This would return 403 if user doesn't have admin role
curl -X GET http://localhost:4000/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Testing Validation Errors

### Invalid email format
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe",
    "email": "invalid-email",
    "password": "password123"
  }'
```

### Short password
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe", 
    "email": "john@example.com",
    "password": "123"
  }'
```
