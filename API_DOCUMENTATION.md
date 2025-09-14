# Smart Home API Documentation

## Overview

This API provides endpoints for managing smart home devices, user profiles, and plant monitoring data. All endpoints use Firebase Realtime Database for data persistence.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API uses user ID-based access control. All endpoints require a valid `userId` parameter.

---

## Endpoints

### 1. ESP Devices

#### GET `/api/espDevices`

Get all ESP devices from the global devices collection.

**Response:**

```json
{
  "devices": {
    "device1": {
      "id": "device1",
      "name": "Sensor 1",
      "status": "online"
    }
  }
}
```

**Status Codes:**

- `200` - Success
- `404` - Devices not found
- `500` - Internal server error

---

### 2. User Profile

#### GET `/api/[userId]/profile`

Get user profile information.

**Parameters:**

- `userId` (string, required) - User identifier

**Response:**

```json
{
  "profile": {
    "userId": "u0987654321",
    "name": "John Doe",
    "img": "https://example.com/avatar.jpg",
    "email": "john@example.com"
  }
}
```

**Status Codes:**

- `200` - Success
- `400` - Missing userId
- `404` - User not found
- `500` - Internal server error

#### PUT `/api/[userId]/profile`

Update user profile information.

**Parameters:**

- `userId` (string, required) - User identifier

**Request Body:**

```json
{
  "userId": "u0987654321",
  "name": "John Doe",
  "img": "https://example.com/avatar.jpg",
  "email": "john@example.com"
}
```

**Response:**

```json
{
  "message": "Profile updated",
  "profile": {
    "userId": "u0987654321",
    "name": "John Doe",
    "img": "https://example.com/avatar.jpg",
    "email": "john@example.com"
  }
}
```

**Status Codes:**

- `200` - Success
- `400` - Missing userId
- `500` - Internal server error

---

### 3. User Devices

#### GET `/api/[userId]/devices`

Get all devices for a specific user.

**Parameters:**

- `userId` (string, required) - User identifier

**Response:**

```json
{
  "device": {
    "1": {
      "dataDeviceId": 1,
      "id": "QWxvZSBWZXJh",
      "name": "Aloe Vera",
      "room": "Living Room",
      "image": "/images/plant.webp",
      "status": "healthy",
      "category": "Outdoor",
      "humidity": 50,
      "soilMoisture": 40,
      "fertilizer": "Weekly",
      "userId": "u0987654321"
    },
    "2": {
      "dataDeviceId": 2,
      "id": "RmlkZGxlIExlYWYgRmln",
      "name": "Fiddle Leaf Fig",
      "room": "Bedroom",
      "image": "/images/plant.webp",
      "status": "healthy",
      "category": "Indoor",
      "humidity": 50,
      "soilMoisture": 40,
      "fertilizer": "Weekly",
      "userId": "u0987654321"
    }
  }
}
```

**Status Codes:**

- `200` - Success
- `400` - Missing userId
- `404` - Device not found
- `500` - Internal server error

---

### 4. Individual Device

#### GET `/api/[userId]/devices/[deviceId]`

Get a specific device for a user.

**Parameters:**

- `userId` (string, required) - User identifier
- `deviceId` (string, required) - Device identifier

**Response:**

```json
{
  "device": {
    "dataDeviceId": 1,
    "id": "QWxvZSBWZXJh",
    "name": "Aloe Vera",
    "room": "Living Room",
    "image": "/images/plant.webp",
    "status": "healthy",
    "category": "Outdoor",
    "humidity": 50,
    "soilMoisture": 40,
    "fertilizer": "Weekly",
    "userId": "u0987654321"
  }
}
```

**Status Codes:**

- `200` - Success
- `400` - Missing userId or deviceId
- `404` - Device not found
- `500` - Internal server error

#### PUT `/api/[userId]/devices/[deviceId]`

Update a specific device for a user.

**Parameters:**

- `userId` (string, required) - User identifier
- `deviceId` (string, required) - Device identifier

**Request Body:**

```json
{
  "dataDeviceId": 1,
  "id": "QWxvZSBWZXJh",
  "name": "Aloe Vera",
  "room": "Living Room",
  "image": "/images/plant.webp",
  "status": "healthy",
  "category": "Outdoor",
  "humidity": 60,
  "soilMoisture": 45,
  "fertilizer": "Biweekly",
  "userId": "u0987654321"
}
```

**Response:**

```json
{
  "message": "Device updated successfully"
}
```

**Status Codes:**

- `200` - Success
- `400` - Missing userId or deviceId
- `500` - Internal server error

---

## Data Models

### Device Object

```typescript
interface Device {
  dataDeviceId: number; // Original device ID
  id: string; // Base64 encoded device name
  name: string; // Device/plant name
  room: string; // Location/room
  image: string; // Image URL
  status: "healthy" | "warning" | string; // Device status
  category: string; // Device category
  humidity: number; // Humidity percentage (0-100)
  soilMoisture: number; // Soil moisture percentage (0-100)
  fertilizer: string; // Fertilizer schedule
  userId: string; // Owner user ID
}
```

### Profile Object

```typescript
interface Profile {
  userId: string; // User identifier
  name: string; // Display name
  img: string; // Profile image URL
  email?: string; // Email address (optional)
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

### Common Error Codes

- `400` - Bad Request (missing required parameters)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server-side error)

---

## Usage Examples

### Update Plant Settings

```javascript
const response = await fetch("/api/u0987654321/devices/1", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    dataDeviceId: 1,
    id: btoa("Aloe Vera"),
    name: "Aloe Vera",
    room: "Living Room",
    image: "/images/plant.webp",
    status: "healthy",
    category: "Outdoor",
    humidity: 60,
    soilMoisture: 45,
    fertilizer: "Biweekly",
    userId: "u0987654321",
  }),
});

const result = await response.json();
console.log(result.message); // "Device updated successfully"
```

### Get User Profile

```javascript
const response = await fetch("/api/u0987654321/profile");
const data = await response.json();
console.log(data.profile.name); // "John Doe"
```

### Get All User Devices

```javascript
const response = await fetch("/api/u0987654321/devices");
const data = await response.json();
console.log(Object.keys(data.device)); // ["1", "2", "3"]
```

---

## Firebase Database Structure

```
/
├── devices/                    # Global ESP devices
│   ├── device1/
│   └── device2/
└── [userId]/                   # User-specific data
    ├── profile/                # User profile
    └── devices/                # User's devices
        ├── 1/                  # Device ID 1
        ├── 2/                  # Device ID 2
        └── 3/                  # Device ID 3
```

---

## Notes

1. **Device ID Encoding**: Device names are Base64 encoded for the `id` field using `btoa(deviceName)`
2. **User ID Format**: User IDs follow the pattern `u` + 10 digits (e.g., `u0987654321`)
3. **Status Values**: Device status can be `"healthy"`, `"warning"`, or any custom string
4. **Percentage Values**: Humidity and soil moisture are stored as integers (0-100)
5. **Fertilizer Schedule**: Common values include `"Daily"`, `"Weekly"`, `"Biweekly"`, `"Monthly"`

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

---

## Version History

- **v1.0** - Initial API implementation with basic CRUD operations
- **v1.1** - Added device-specific endpoints and improved error handling
