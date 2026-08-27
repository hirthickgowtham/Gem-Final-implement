# MediaStatus API Test Cases Specification

**Service**: `MicroService_2`  
**Base URL**: `http://localhost:5002/api`  
**Allowed Status States**: `'pending'`, `'ready'`, `'failed'`

---

## 1. POST: Create / Initialize Media Status

### Test Case 1.1: Create Status (Default to `"pending"`) (Positive)
* **Endpoint**: `POST /api/media_status`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "media_id": 105
  }
  ```
* **Expected Status**: `201 Created`
* **Expected Response**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Media status created/initialized successfully",
    "data": {
      "media_id": "105",
      "status": "pending",
      "created_at": "2026-08-27T15:45:00.123Z",
      "updated_at": "2026-08-27T15:45:00.123Z"
    },
    "error": null
  }
  ```

### Test Case 1.2: Missing `media_id` (Negative)
* **Endpoint**: `POST /api/media_status`
* **Request Body**:
  ```json
  {
    "status": "pending"
  }
  ```
* **Expected Status**: `400 Bad Request`
* **Expected Response**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "media_id is required",
    "data": null,
    "error": null
  }
  ```

### Test Case 1.3: Invalid Status Enum Value (Negative)
* **Endpoint**: `POST /api/media_status`
* **Request Body**:
  ```json
  {
    "media_id": 105,
    "status": "in_progress"
  }
  ```
* **Expected Status**: `400 Bad Request`
* **Expected Response**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Invalid status 'in_progress'. Allowed statuses: pending, ready, failed",
    "data": null,
    "error": null
  }
  ```

---

## 2. GET: Retrieve Media Status

### Test Case 2.1: Retrieve Existing Media Status (Positive)
* **Endpoint**: `GET /api/media_status/105`
* **Expected Status**: `200 OK`
* **Expected Response**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Media status retrieved successfully",
    "data": {
      "media_id": "105",
      "status": "pending",
      "created_at": "2026-08-27T15:45:00.123Z",
      "updated_at": "2026-08-27T15:45:00.123Z"
    },
    "error": null
  }
  ```

### Test Case 2.2: Retrieve Non-Existent Media Status (Negative)
* **Endpoint**: `GET /api/media_status/9999999`
* **Expected Status**: `404 Not Found`
* **Expected Response**:
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "Media status not found for media_id 9999999",
    "data": null,
    "error": null
  }
  ```

---

## 3. PATCH: Update Media Status

### Test Case 3.1: Update Status to `"ready"` (Positive)
* **Endpoint**: `PATCH /api/media_status`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "media_id": 105,
    "status": "ready"
  }
  ```
* **Expected Status**: `200 OK`
* **Expected Response**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Media status updated successfully",
    "data": {
      "media_id": "105",
      "status": "ready",
      "created_at": "2026-08-27T15:45:00.123Z",
      "updated_at": "2026-08-27T15:46:12.456Z"
    },
    "error": null
  }
  ```

### Test Case 3.2: Update Status to `"failed"` on Transcode Error (Positive)
* **Endpoint**: `PATCH /api/media_status`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "media_id": 105,
    "status": "failed"
  }
  ```
* **Expected Status**: `200 OK`
* **Expected Response**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Media status updated successfully",
    "data": {
      "media_id": "105",
      "status": "failed",
      "created_at": "2026-08-27T15:45:00.123Z",
      "updated_at": "2026-08-27T15:46:12.456Z"
    },
    "error": null
  }
  ```

### Test Case 3.3: Missing `media_id` (Negative)
* **Endpoint**: `PATCH /api/media_status`
* **Request Body**:
  ```json
  {
    "status": "ready"
  }
  ```
* **Expected Status**: `400 Bad Request`
* **Expected Response**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "media_id is required",
    "data": null,
    "error": null
  }
  ```

### Test Case 3.4: Invalid Status Enum String (Negative)
* **Endpoint**: `PATCH /api/media_status`
* **Request Body**:
  ```json
  {
    "media_id": 105,
    "status": "done"
  }
  ```
* **Expected Status**: `400 Bad Request`
* **Expected Response**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Invalid status 'done'. Allowed statuses: pending, ready, failed",
    "data": null,
    "error": null
  }
  ```

### Test Case 3.5: Update Non-Existent Record (Negative)
* **Endpoint**: `PATCH /api/media_status`
* **Request Body**:
  ```json
  {
    "media_id": 9999999,
    "status": "ready"
  }
  ```
* **Expected Status**: `404 Not Found`
* **Expected Response**:
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "Media status record not found for media_id 9999999",
    "data": null,
    "error": null
  }
  ```

---

## 4. DELETE: Delete Media Status Record

### Test Case 4.1: Delete Existing Media Status (Positive)
* **Endpoint**: `DELETE /api/media_status/105`
* **Expected Status**: `200 OK`
* **Expected Response**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Media status deleted successfully",
    "data": {
      "media_id": "105",
      "status": "ready",
      "created_at": "2026-08-27T15:45:00.123Z",
      "updated_at": "2026-08-27T15:46:12.456Z"
    },
    "error": null
  }
  ```

### Test Case 4.2: Delete Non-Existent Record (Negative)
* **Endpoint**: `DELETE /api/media_status/9999999`
* **Expected Status**: `404 Not Found`
* **Expected Response**:
  ```json
  {
    "success": false,
    "statusCode": 404,
    "message": "Media status record not found for media_id 9999999",
    "data": null,
    "error": null
  }
  ```
