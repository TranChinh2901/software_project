# Avatar Upload API Documentation

## Endpoint: Upload Avatar

**URL:** `PUT /api/auth/upload-avatar`  
**Authentication:** Required (Bearer Token)  
**Content-Type:** `multipart/form-data`

### Request

#### Headers
```
Authorization: Bearer <your_access_token>
Content-Type: multipart/form-data
```

#### Form Data
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| avatar | File | Yes | Image file (jpg, jpeg, png, gif, webp) |

#### File Constraints
- **Max size:** 5MB
- **Allowed formats:** jpg, jpeg, png, gif, webp
- **Auto-resize:** 500x500px
- **Storage:** Cloudinary (folder: user-avatars)
- **Quality:** Auto-optimized

### Response

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "statusCode": 200,
  "data": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john@example.com",
    "avatar": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/user-avatars/abcd1234.jpg",
    "message": "Avatar uploaded successfully"
  }
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Unauthorized",
  "statusCode": 401,
  "errorCode": "UNAUTHORIZED"
}
```

**400 Bad Request - No file**
```json
{
  "success": false,
  "message": "Avatar file is required",
  "statusCode": 400,
  "errorCode": "VALIDATION_ERROR"
}
```

**400 Bad Request - Invalid file type**
```json
{
  "success": false,
  "message": "Only image files are allowed",
  "statusCode": 400,
  "errorCode": "VALIDATION_ERROR"
}
```

**413 File Too Large**
```json
{
  "success": false,
  "message": "File too large",
  "statusCode": 413,
  "errorCode": "FILE_TOO_LARGE"
}
```

### Usage Examples

#### JavaScript (Fetch API)
```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

fetch('/api/auth/upload-avatar', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

#### cURL
```bash
curl -X PUT \
  -H "Authorization: Bearer your_access_token" \
  -F "avatar=@/path/to/image.jpg" \
  http://localhost:4000/api/auth/upload-avatar
```

#### Postman
1. Set method to `PUT`
2. URL: `http://localhost:4000/api/auth/upload-avatar`
3. Headers: 
   - Key: `Authorization`
   - Value: `Bearer your_access_token`
4. Body:
   - Select `form-data`
   - Key: `avatar` (change type to File)
   - Value: Select your image file

### Implementation Details

1. **Middleware Stack:**
   - `authMiddleware()` - Validates JWT token
   - `uploadAvatar.single('avatar')` - Handles file upload to Cloudinary
   - `asyncHandle(authController.uploadAvatar)` - Controller method

2. **Image Processing:**
   - Auto-resize to 500x500px
   - Crop to fill dimensions
   - Quality optimization
   - Format preservation

3. **Storage:**
   - Cloudinary cloud storage
   - Organized in `user-avatars` folder
   - Automatic URL generation
   - CDN delivery

### Security Notes

- Authentication required for all requests
- File type validation prevents malicious uploads
- File size limits prevent abuse
- Cloudinary handles secure storage and delivery
- Previous avatars are not automatically deleted (consider cleanup strategy)

### Related Endpoints

- `POST /api/auth/register` - User registration (avatar optional)
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (includes avatar URL)
- `PUT /api/auth/profile` - Update profile (can include avatar URL)
