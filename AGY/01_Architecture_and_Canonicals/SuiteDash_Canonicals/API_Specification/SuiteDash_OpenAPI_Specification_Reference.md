---
title: 'SuiteDash Secure API: OpenAPI 3.0.3 Master Specification & Reference'
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [api-reference, bkk-sync, obsidian-vault, office-sync, openapi, secure-api,
  suitedash, swagger, synto-knowledge]
type: api-specification
---

# SuiteDash Secure API: OpenAPI 3.0.3 Master Specification

**OpenAPI Version**: `3.0.3` | **Base URL**: `https://app.suitedash.com/secure-api/` | **Source**: `https://app.suitedash.com/secure-api/swagger/json-file`

> [!IMPORTANT] LIVE Documentation & Authentication
> All requests to the SuiteDash Secure API require dual-header authentication using **`X-Public-ID`** and **`X-Secret-Key`**, generated in your portal at `Flyout Menu > Integrations > Secure API`.
> 
> **Test / Dummy Credentials**:
> * `X-Public-ID`: `00000000-0000-0000-0000-000000000000`
> * `X-Secret-Key`: `DummySecretKey`

---

## 📌 Endpoints Summary Matrix

| Method | Path | Summary / Description |
|---|---|---|
| `GET` | `/contact/meta` | CRM Contact : Meta Attributes Information |
| `GET` | `/contacts` | Get all existing Contacts |
| `POST` | `/contact` | Create a new Contact |
| `GET` | `/contact/{identifier}` | Find a Contact |
| `PUT` | `/contact/{identifier}` | Update a Contact |
| `GET` | `/company/meta` | CRM Company : Meta Attributes Information |
| `GET` | `/companies` | Get all existing Companies |
| `POST` | `/company` | Create a new Company |
| `GET` | `/company/{identifier}` | Find a Company |
| `PUT` | `/company/{identifier}` | Update a Company |
| `GET` | `/project/meta` | Project : Meta Attributes Information |
| `GET` | `/projects` | Get all existing Projects |
| `GET` | `/project/{type}/{identifier}` | Find a Project |
| `PUT` | `/project/{type}/{identifier}` | Update a Project |
| `POST` | `/marketing/subscribe` | Subscribe contacts to marketing audiences |
| `GET` | `/worlds` | Get all existing Worlds |

---

## 🔍 Detailed Endpoint Reference

### `/contact/meta`

#### `GET` CRM Contact : Meta Attributes Information
**Operation ID**: `sorting02Contact1`  
**Tags**: `contact`  

Contact meta attributes information
<i><b><small>* dummy request allowed</small></b></i>

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | successful operation | `object` |
| `401` | Unauthorized | `Error-401` |
| `404` | Not Found | `Error-404` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X GET "https://app.suitedash.com/secure-api//contact/meta" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

### `/contacts`

#### `GET` Get all existing Contacts
**Operation ID**: `sorting02Contact2`  
**Tags**: `contact`  

Get all existing contacts
<i><b><small>* dummy request allowed</small></b></i>

**Parameters**:

| Name | Located In | Required | Type | Description |
|---|---|---|---|---|
| `page` | `query` | No | `integer` | Page number |
| `createdMin` | `query` | No | `string` | Lower bound (exclusive) for filtering by a contact's creation date-time. If <b>createdMax</b> is set, <b>createdMin</b> must be smaller than <b>createdMax</b>. Must be an RFC3339 timestamp with mandatory time zone offset, for example: <i>2024-07-14T09:00:00+00:00</i>. |
| `createdMax` | `query` | No | `string` | Upper bound (exclusive) for filtering by a contact's creation date-time. If <b>createdMin</b> is set, <b>createdMax</b> must be greater than <b>createdMin</b>. Must be an RFC3339 timestamp with mandatory time zone offset, for example: <i>2024-10-30T11:55:16-04:00</i>. |
| `orderBy` | `query` | No | `string` | The order of the contacts returned in the result. |
| `meta` | `query` | No | `string` | Select if you want to receive information in the "meta" object about all the attributes |

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | Successful operation | `object` |
| `401` | Unauthorized | `Error-401` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X GET "https://app.suitedash.com/secure-api//contacts" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

### `/contact`

#### `POST` Create a new Contact
**Operation ID**: `sorting02Contact4`  
**Tags**: `contact`  

Create a new contact
Please use <b>/contact/meta</b> request for attributes full information

**Request Body**:

* Content-Type: `application/json`
```json
{
  "role": {
    "type": "string",
    "enum": [
      "Lead",
      "Client",
      "Prospect"
    ],
    "description": "Role of the Contact",
    "example": "Lead"
  },
  "first_name": {
    "type": "string",
    "description": "Contact first name",
    "example": "John"
  },
  "last_name": {
    "type": "string",
    "description": "Contact last name",
    "example": "Doe"
  },
  "email": {
    "type": "string",
    "format": "email",
    "nullable": true,
    "description": "Contact email (required except for the role of Lead)",
    "example": "john.doe@email.com"
  },
  "send_welcome_email": {
    "type": "boolean",
    "description": "Send Portal Access Invitation?",
    "example": true
  }
}
```

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `201` | Successful operation | `object` |
| `400` | Bad Request | `Error-400` |
| `401` | Unauthorized | `Error-401` |
| `405` | Method Not Allowed | `Error-405` |
| `422` | Unprocessable Entity | `object` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X POST "https://app.suitedash.com/secure-api//contact" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

### `/contact/{identifier}`

#### `GET` Find a Contact
**Operation ID**: `sorting02Contact3`  
**Tags**: `contact`  

Returns a single contact
<i><b><small>* dummy request allowed</small></b></i>

**Parameters**:

| Name | Located In | Required | Type | Description |
|---|---|---|---|---|
| `identifier` | `path` | Yes | `string` | Contact UID or Email |
| `meta` | `query` | No | `string` | Select if you want to receive information in the "meta" object about all the attributes |

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | successful operation | `object` |
| `401` | Unauthorized | `Error-401` |
| `404` | Not Found | `Error-404` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X GET "https://app.suitedash.com/secure-api//contact/{identifier}" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

#### `PUT` Update a Contact
**Operation ID**: `sorting02Contact5`  
**Tags**: `contact`  

Update a contact
Please use <b>/contact/meta</b> request for attributes full information

**Parameters**:

| Name | Located In | Required | Type | Description |
|---|---|---|---|---|
| `identifier` | `path` | Yes | `string` | Contact UID or Email |

**Request Body**:

* Content-Type: `application/json`
* Schema Reference: `#ContactUpdate`

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | Successful operation | `object` |
| `400` | Bad Request | `Error-400` |
| `401` | Unauthorized | `Error-401` |
| `404` | Not Found | `Error-404` |
| `422` | Unprocessable Entity | `object` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X PUT "https://app.suitedash.com/secure-api//contact/{identifier}" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

### `/company/meta`

#### `GET` CRM Company : Meta Attributes Information
**Operation ID**: `sorting01Company1`  
**Tags**: `company`  

Company meta attributes information
<i><b><small>* dummy request allowed</small></b></i>

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | successful operation | `object` |
| `401` | Unauthorized | `Error-401` |
| `404` | Not Found | `Error-404` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X GET "https://app.suitedash.com/secure-api//company/meta" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

### `/companies`

#### `GET` Get all existing Companies
**Operation ID**: `sorting01Company2`  
**Tags**: `company`  

Get all existing Companies (Idle Companies are not available)
<i><b><small>* dummy request allowed</small></b></i>

**Parameters**:

| Name | Located In | Required | Type | Description |
|---|---|---|---|---|
| `page` | `query` | No | `integer` | Page number |
| `createdMin` | `query` | No | `string` | Lower bound (exclusive) for filtering by a company's creation date-time. If <b>createdMax</b> is set, <b>createdMin</b> must be smaller than <b>createdMax</b>. Must be an RFC3339 timestamp with mandatory time zone offset, for example: <i>2024-07-14T09:00:00+00:00</i>. |
| `createdMax` | `query` | No | `string` | Upper bound (exclusive) for filtering by a company's creation date-time. If <b>createdMin</b> is set, <b>createdMax</b> must be greater than <b>createdMin</b>. Must be an RFC3339 timestamp with mandatory time zone offset, for example: <i>2024-10-30T11:55:16-04:00</i>. |
| `orderBy` | `query` | No | `string` | The order of the companies returned in the result. |
| `meta` | `query` | No | `string` | Select if you want to receive information in the "meta" object about all the attributes |

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | Successful operation | `object` |
| `401` | Unauthorized | `Error-401` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X GET "https://app.suitedash.com/secure-api//companies" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

### `/company`

#### `POST` Create a new Company
**Operation ID**: `sorting01Company4`  
**Tags**: `company`  

Create a new company
Please use <b>/company/meta</b> request for attributes full information

**Request Body**:

* Content-Type: `application/json`
```json
{
  "name": {
    "type": "string",
    "description": "Company name",
    "example": "Microsoft"
  },
  "role": {
    "type": "string",
    "enum": [
      "Lead",
      "Client",
      "Prospect"
    ],
    "description": "Role of the Company",
    "example": "Client"
  },
  "primaryContact": {
    "type": "object",
    "properties": {
      "first_name": {
        "type": "string",
        "description": "Required when 'create_primary_contact_if_not_exists' is true",
        "required": false,
        "nullable": false,
        "example": "John"
      },
      "last_name": {
        "type": "string",
        "description": "Required when 'create_primary_contact_if_not_exists' is true",
        "required": false,
        "nullable": false,
        "example": "Doe"
      },
      "email": {
        "type": "string",
        "format": "email",
        "required": true,
        "nullable": false,
        "example": "john.doe@email.com"
      },
      "send_welcome_email": {
        "type": "boolean",
        "description": "Send welcome email to the primary contact in case was not already sent",
        "required": false,
        "nullable": false,
        "example": true
      },
      "create_primary_contact_if_not_exists": {
        "type": "boolean",
        "description": "Create a Primary Contact with all provided data if the email does not exists",
        "required": true,
        "nullable": false,
        "example": true
      },
      "prevent_individual_mode": {
        "type": "boolean",
        "description": "Prevent this Primary Contact from switching into 'Individual Mode'",
        "required": false,
        "nullable": false,
        "example": true
      },
      "worlds": {
        "$ref": "#/components/schemas/ManageWorlds"
      }
    }
  }
}
```

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `201` | Successful operation | `object` |
| `400` | Bad Request | `Error-400` |
| `401` | Unauthorized | `Error-401` |
| `405` | Method Not Allowed | `Error-405` |
| `422` | Unprocessable Entity | `object` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X POST "https://app.suitedash.com/secure-api//company" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

### `/company/{identifier}`

#### `GET` Find a Company
**Operation ID**: `sorting01Company3`  
**Tags**: `company`  

Returns a single company
<i><b><small>* dummy request allowed</small></b></i>

**Parameters**:

| Name | Located In | Required | Type | Description |
|---|---|---|---|---|
| `identifier` | `path` | Yes | `string` | Company UID or Name |
| `meta` | `query` | No | `string` | Select if you want to receive information in the "meta" object about all the attributes |

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | successful operation | `object` |
| `401` | Unauthorized | `Error-401` |
| `404` | Not Found | `Error-404` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X GET "https://app.suitedash.com/secure-api//company/{identifier}" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

#### `PUT` Update a Company
**Operation ID**: `sorting01Company5`  
**Tags**: `company`  

Update a company
Please use <b>/company/meta</b> request for attributes full information

**Parameters**:

| Name | Located In | Required | Type | Description |
|---|---|---|---|---|
| `identifier` | `path` | Yes | `string` | Company UID or Name |

**Request Body**:

* Content-Type: `application/json`
* Schema Reference: `#CompanyUpdate`

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | Successful operation | `object` |
| `400` | Bad Request | `Error-400` |
| `401` | Unauthorized | `Error-401` |
| `404` | Not Found | `Error-404` |
| `422` | Unprocessable Entity | `object` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X PUT "https://app.suitedash.com/secure-api//company/{identifier}" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

### `/project/meta`

#### `GET` Project : Meta Attributes Information
**Operation ID**: `sorting03Project1`  
**Tags**: `project`  

Project meta attributes information
<i><b><small>* dummy request allowed</small></b></i>

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | successful operation | `object` |
| `401` | Unauthorized | `Error-401` |
| `404` | Not Found | `Error-404` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X GET "https://app.suitedash.com/secure-api//project/meta" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

### `/projects`

#### `GET` Get all existing Projects
**Operation ID**: `sorting03Project2`  
**Tags**: `project`  

Get all existing Projects
<i><b><small>* dummy request allowed</small></b></i>

**Parameters**:

| Name | Located In | Required | Type | Description |
|---|---|---|---|---|
| `page` | `query` | No | `integer` | Page number |
| `createdMin` | `query` | No | `string` | Lower bound (exclusive) for filtering by a Project's creation date-time. If <b>createdMax</b> is set, <b>createdMin</b> must be smaller than <b>createdMax</b>. Must be an RFC3339 timestamp with mandatory time zone offset, for example: <i>2024-07-14T09:00:00+00:00</i>. |
| `createdMax` | `query` | No | `string` | Upper bound (exclusive) for filtering by a Project's creation date-time. If <b>createdMin</b> is set, <b>createdMax</b> must be greater than <b>createdMin</b>. Must be an RFC3339 timestamp with mandatory time zone offset, for example: <i>2024-10-30T11:55:16-04:00</i>. |
| `orderBy` | `query` | No | `string` | The order of the Projects returned in the result. |
| `meta` | `query` | No | `string` | Select if you want to receive information in the "meta" object about all the attributes |

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | Successful operation | `object` |
| `401` | Unauthorized | `Error-401` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X GET "https://app.suitedash.com/secure-api//projects" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

### `/project/{type}/{identifier}`

#### `GET` Find a Project
**Operation ID**: `sorting03Project3`  
**Tags**: `project`  

Returns a single Project
<i><b><small>* dummy request allowed</small></b></i>

**Parameters**:

| Name | Located In | Required | Type | Description |
|---|---|---|---|---|
| `type` | `path` | Yes | `string` | Specifies the type of filter to apply.<br><br><b><i>uid</i></b> - the 'identifier' should be the Project UID (example: 2ff558c3-3eb0-48e1-a3bc-4c7f59dfb02f)<br><b><i>name</i></b> - the 'identifier' should be the exact name of the Project<br><b><i>contains_the_following</i></b> - the 'identifier' should be a string that is contained in a Project name<br><b><i>most_recent</i></b> - the 'identifier' accept only 'true' value |
| `identifier` | `path` | Yes | `string` | The identifier for the selected type. Required for 'uid', 'name' and 'contains_the_following'. Send 'true' for 'most_recent'. |
| `meta` | `query` | No | `string` | Select if you want to receive information in the "meta" object about all the attributes |

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | successful operation | `object` |
| `401` | Unauthorized | `Error-401` |
| `404` | Not Found | `Error-404` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X GET "https://app.suitedash.com/secure-api//project/{type}/{identifier}" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

#### `PUT` Update a Project
**Operation ID**: `sorting03Project4`  
**Tags**: `project`  

Update a Project
Please use <b>/project/meta</b> request for attributes full information

**Parameters**:

| Name | Located In | Required | Type | Description |
|---|---|---|---|---|
| `type` | `path` | Yes | `string` | Specifies the type of filter to apply.<br><br><b><i>uid</i></b> - the 'identifier' should be the Project UID (example: 2ff558c3-3eb0-48e1-a3bc-4c7f59dfb02f)<br><b><i>name</i></b> - the 'identifier' should be the exact name of the Project<br><b><i>contains_the_following</i></b> - the 'identifier' should be a string that is contained in a Project name<br><b><i>most_recent</i></b> - the 'identifier' accept only 'true' value |
| `identifier` | `path` | Yes | `string` | The identifier for the selected type. Required for 'uid', 'name' and 'contains_the_following'. Send 'true' for 'most_recent'. |

**Request Body**:

* Content-Type: `application/json`
* Schema Reference: `#ProjectUpdate`

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | Successful operation | `object` |
| `400` | Bad Request | `Error-400` |
| `401` | Unauthorized | `Error-401` |
| `404` | Not Found | `Error-404` |
| `422` | Unprocessable Entity | `object` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X PUT "https://app.suitedash.com/secure-api//project/{type}/{identifier}" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

### `/marketing/subscribe`

#### `POST` Subscribe contacts to marketing audiences
**Operation ID**: `sorting04Marketing1`  
**Tags**: `marketing`  

Subscribe contacts to marketing audiences

**Request Body**:

* Content-Type: `application/json`

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | Successful operation (if at least one item was successfully managed) | `object` |
| `401` | Unauthorized | `Error-401` |
| `405` | Method Not Allowed | `Error-405` |
| `422` | Unprocessable Entity | `object` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X POST "https://app.suitedash.com/secure-api//marketing/subscribe" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---

### `/worlds`

#### `GET` Get all existing Worlds
**Operation ID**: `sorting01Worlds`  
**Tags**: `worlds`  

Get all existing Worlds
<i><b><small>* dummy request allowed</small></b></i>

<b style="color:#e30437">Only available with the WORLDS Power-up</b>

**Parameters**:

| Name | Located In | Required | Type | Description |
|---|---|---|---|---|
| `page` | `query` | No | `integer` | Page number |
| `orderBy` | `query` | No | `string` | The order of the Worlds returned in the result. |

**Responses**:

| Code | Description | Schema |
|---|---|---|
| `200` | Successful operation | `object` |
| `401` | Unauthorized | `Error-401` |
| `429` | Too many requests | `Error-429` |

**Example cURL Request**:
```bash
curl -X GET "https://app.suitedash.com/secure-api//worlds" \
  -H "X-Public-ID: YOUR_PUBLIC_ID" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  -H "Content-Type: application/json"
```

---
