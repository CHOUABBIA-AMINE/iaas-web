# API Endpoints Required for Select Dropdowns

## Overview

This document lists all API endpoints required by the frontend for populating select dropdowns. These endpoints should return **simple lists** (arrays) without pagination to ensure optimal performance and simplicity.

---

## Backend Endpoints to Implement

### 1. State List Endpoint

**Endpoint:** `GET /common/administration/state/list`

**Description:** Returns a simple list of all states for dropdown selection.

**Response Type:** `StateDTO[]`

**Response Example:**
```json
[
  {
    "id": 1,
    "code": "ALG",
    "designationAr": "الجزائر",
    "designationEn": "Algiers",
    "designationFr": "Alger",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  },
  {
    "id": 2,
    "code": "OUA",
    "designationAr": "ورقلة",
    "designationEn": "Ouargla",
    "designationFr": "Ouargla",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  }
]
```

---

### 2. Locality List Endpoint (All)

**Endpoint:** `GET /common/administration/locality/list`

**Description:** Returns a simple list of all localities.

**Response Type:** `LocalityDTO[]`

**Response Example:**
```json
[
  {
    "id": 1,
    "code": "HMD",
    "designationAr": "حاسي مسعود",
    "designationEn": "Hassi Messaoud",
    "designationFr": "Hassi Messaoud",
    "stateId": 2,
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  }
]
```

---

### 3. Locality List Endpoint (By State)

**Endpoint:** `GET /common/administration/locality/state/{stateId}/list`

**Description:** Returns localities for a specific state for dropdown selection.

**Path Parameter:** `stateId` - The ID of the state

**Response Type:** `LocalityDTO[]`

**Response Example:**
```json
[
  {
    "id": 5,
    "code": "HMD",
    "designationAr": "حاسي مسعود",
    "designationEn": "Hassi Messaoud",
    "designationFr": "Hassi Messaoud",
    "stateId": 2,
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  },
  {
    "id": 6,
    "code": "HMR",
    "designationAr": "حاسي الرمل",
    "designationEn": "Hassi R'Mel",
    "designationFr": "Hassi R'Mel",
    "stateId": 2,
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  }
]
```

---

### 4. Vendor List Endpoint

**Endpoint:** `GET /network/common/vendor/list`

**Description:** Returns a simple list of all vendors.

**Response Type:** `VendorDTO[]`

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Sonatrach",
    "code": "STH",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  },
  {
    "id": 2,
    "name": "ENI",
    "code": "ENI",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  }
]
```

---

### 5. Operational Status List Endpoint

**Endpoint:** `GET /network/common/operational-status/list`

**Description:** Returns a simple list of all operational statuses.

**Response Type:** `OperationalStatusDTO[]`

**Response Example:**
```json
[
  {
    "id": 1,
    "nameAr": "قيد التشغيل",
    "nameEn": "Operational",
    "nameFr": "Opérationnel",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  },
  {
    "id": 2,
    "nameAr": "خارج الخدمة",
    "nameEn": "Out of Service",
    "nameFr": "Hors service",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  }
]
```

---

### 6. Station Type List Endpoint

**Endpoint:** `GET /network/type/station-type/list`

**Description:** Returns a simple list of all station types.

**Response Type:** `StationTypeDTO[]`

**Response Example:**
```json
[
  {
    "id": 1,
    "nameAr": "محطة ضغط",
    "nameEn": "Compression Station",
    "nameFr": "Station de compression",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  }
]
```

---

### 7. Terminal Type List Endpoint

**Endpoint:** `GET /network/type/terminal-type/list`

**Description:** Returns a simple list of all terminal types.

**Response Type:** `TerminalTypeDTO[]`

**Response Example:**
```json
[
  {
    "id": 1,
    "nameAr": "محطة تصدير",
    "nameEn": "Export Terminal",
    "nameFr": "Terminal d'exportation",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  }
]
```

---

### 8. Hydrocarbon Field Type List Endpoint

**Endpoint:** `GET /network/type/hydrocarbon-field-type/list`

**Description:** Returns a simple list of all hydrocarbon field types.

**Response Type:** `HydrocarbonFieldTypeDTO[]`

**Response Example:**
```json
[
  {
    "id": 1,
    "nameAr": "حقل نفط",
    "nameEn": "Oil Field",
    "nameFr": "Champ pétrolier",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  }
]
```

---

### 9. Pipeline System List Endpoint

**Endpoint:** `GET /network/core/pipeline-system/list`

**Description:** Returns a simple list of all pipeline systems.

**Response Type:** `PipelineSystemDTO[]`

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Oil Pipeline System 1",
    "code": "OPS1",
    "createdAt": "2025-01-01T00:00:00",
    "updatedAt": "2025-01-01T00:00:00"
  }
]
```

---

## Important Notes

### Field Names for State and Locality

⚠️ **CRITICAL:** State and Locality entities use **`designation`** fields, NOT `name` fields:

- ✅ `designationAr` (Arabic designation)
- ✅ `designationEn` (English designation)
- ✅ `designationFr` (French designation)
- ❌ NOT `nameAr`, `nameEn`, `nameFr`

### Response Format

All `/list` endpoints should return:
- ✅ **Simple array** of DTOs
- ❌ **NOT** paginated response (no `Page<T>`, no `content`, `totalElements`, etc.)

**Correct Response:**
```json
[
  { "id": 1, "name": "Item 1" },
  { "id": 2, "name": "Item 2" }
]
```

**Incorrect Response (Don't use for `/list` endpoints):**
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 10,
  "number": 0
}
```

### Performance Considerations

- These endpoints are used in select dropdowns
- Should return all records without pagination
- If a table has thousands of records, consider:
  - Adding search/filter functionality
  - Implementing autocomplete instead of simple dropdown
  - Limiting results with a reasonable cap (e.g., 1000 items max)

---

## Implementation Checklist for Backend Team

- [ ] `GET /common/administration/state/list`
- [ ] `GET /common/administration/locality/list`
- [ ] `GET /common/administration/locality/state/{stateId}/list`
- [ ] `GET /network/common/vendor/list`
- [ ] `GET /network/common/operational-status/list`
- [ ] `GET /network/type/station-type/list`
- [ ] `GET /network/type/terminal-type/list`
- [ ] `GET /network/type/hydrocarbon-field-type/list`
- [ ] `GET /network/core/pipeline-system/list`
- [ ] Verify State/Locality use `designation` fields
- [ ] Verify all endpoints return arrays, not paginated responses
- [ ] Test with frontend to ensure compatibility

---

## Contact

For questions or clarifications, contact:
- **Author:** CHOUABBIA Amine
- **Date:** December 24, 2025
