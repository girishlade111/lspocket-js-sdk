# LS Pocket JavaScript SDK

<p align="center">
  <img src="https://raw.githubusercontent.com/girishlade111/LS-Pocket/main/ui/public/images/logo.svg" alt="LS Pocket Logo" width="120" height="120" onerror="this.style.display='none'" />
</p>

<p align="center">
  <strong>Official JavaScript & TypeScript SDK for LS Pocket backend.</strong><br>
  Cross-platform client for Browsers, Node.js, React Native, Bun, and Deno with full TypeScript support, auto-cancellation, and real-time Server-Sent Events.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/lspocket"><img src="https://img.shields.io/npm/v/lspocket.svg?style=flat&color=CB3837" alt="npm version" /></a>
  <a href="https://github.com/girishlade111/LS-Pocket"><img src="https://img.shields.io/badge/Companion_Backend-LS--Pocket-blue?style=flat&logo=go" alt="Companion Backend" /></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License: MIT" /></a>
  <a href="https://github.com/girishlade111/lspocket-js-sdk/stargazers"><img src="https://img.shields.io/github/stars/girishlade111/lspocket-js-sdk?style=social" alt="GitHub Stars" /></a>
</p>

---

> 🔗 **Companion Repositories:**
> - **Backend Server:** [github.com/girishlade111/LS-Pocket](https://github.com/girishlade111/LS-Pocket) *(Go backend binary, SQLite WAL database, and Superuser Admin UI)*
> - **JavaScript / TypeScript SDK (This Repo):** [github.com/girishlade111/lspocket-js-sdk](https://github.com/girishlade111/lspocket-js-sdk)

> ℹ️ **Attribution:** This package is a fork and rebrand of [pocketbase/js-sdk](https://github.com/pocketbase/js-sdk) by Gani Georgiev, licensed under the MIT License. The original copyright notice and license are preserved in [LICENSE.md](LICENSE.md). `lspocket` is maintained as the official client SDK for the [LS-Pocket](https://github.com/girishlade111/LS-Pocket) ecosystem.

---

## Table of Contents

- [Overview](#overview)
- [Companion Backend Server](#companion-backend-server)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Node.js / Bundlers (npm, pnpm, yarn, bun)](#nodejs--bundlers)
  - [Browser (Direct `<script>` Tag)](#browser-direct-script-tag)
  - [React Native](#react-native)
- [Quick Start](#quick-start)
- [Core Features & Caveats](#core-features--caveats)
  - [Binding Filter Parameters](#binding-filter-parameters)
  - [File Uploads](#file-uploads)
  - [Error Handling](#error-handling)
  - [Auth Stores](#auth-stores)
    - [LocalAuthStore (Default)](#localauthstore-default)
    - [AsyncAuthStore (React Native)](#asyncauthstore-react-native)
    - [Custom Auth Stores](#custom-auth-stores)
    - [Common Auth Store Methods](#common-auth-store-methods)
  - [Auto Cancellation](#auto-cancellation)
  - [TypeScript Definitions & Generics](#typescript-definitions--generics)
  - [Custom Request Options](#custom-request-options)
  - [Send Hooks (Interceptors)](#send-hooks-interceptors)
  - [SSR Integration (SvelteKit, Astro, Next.js, Nuxt)](#ssr-integration)
  - [Security Best Practices](#security-best-practices)
- [API Reference](#api-reference)
  - [Client Initialization](#client-initialization)
  - [RecordService (CRUD, Realtime & Auth)](#recordservice)
  - [BatchService](#batchservice)
  - [FileService](#fileservice)
  - [CollectionService](#collectionservice)
  - [LogService](#logservice)
  - [SettingsService](#settingsservice)
  - [RealtimeService](#realtimeservice)
  - [BackupService](#backupservice)
  - [CronService](#cronservice)
  - [HealthService](#healthservice)
  - [SQLService](#sqlservice)
- [Development & Building](#development--building)
- [License](#license)

---

## Overview

The **LS Pocket JavaScript SDK** (`lspocket`) provides an intuitive, promise-based API for interacting with the [LS-Pocket Backend Server](https://github.com/girishlade111/LS-Pocket).

### Key Highlights
- 🚀 **Universal Compatibility**: Works seamlessly across modern browsers, Node.js (>= 18), Bun, Deno, and React Native.
- ⚡ **Realtime Subscriptions**: Built-in Server-Sent Events (SSE) client for instant live-data feeds without manual reconnection logic.
- 🛡️ **Type Safety**: First-class TypeScript type definitions and generic model interfaces.
- 🛑 **Request Deduplication**: Automatic cancellation of redundant inflight requests to optimize bandwidth and prevent race conditions.
- 🔒 **Comprehensive Auth**: Supports Password, OAuth2 popup/redirect, OTP, and MFA out of the box with multi-tab storage synchronization.

---

## Companion Backend Server

This SDK connects directly to **LS Pocket**, an open-source real-time backend engine written in Go.

- **Repository**: [https://github.com/girishlade111/LS-Pocket](https://github.com/girishlade111/LS-Pocket)
- **Default Local Server URL**: `http://127.0.0.1:8090`
- **Default Admin UI**: `http://127.0.0.1:8090/_/`

Before running your frontend or server-side application, start your LS Pocket server:

```bash
# In the LS-Pocket repository root:
go run ./examples/base/main.go serve
# or run the pre-built binary
./lspocket.exe serve
```

---

## Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as Client App (Browser / Mobile / SSR)
    participant SDK as lspocket JS SDK
    participant Server as LS-Pocket Backend (Go)
    participant DB as SQLite (WAL)

    User->>SDK: new LSPocket('http://127.0.0.1:8090')
    User->>SDK: pb.collection('users').authWithPassword(email, pass)
    SDK->>Server: POST /api/collections/users/auth-with-password
    Server->>DB: Verify credentials & Argon2 hash
    Server-->>SDK: JWT Token + User Record
    SDK-->>User: Auth response (Saved in pb.authStore)

    User->>SDK: pb.collection('posts').subscribe('*', callback)
    SDK->>Server: GET /api/realtime (SSE Stream)
    Server-->>SDK: 200 SSE Stream Connected (PB_CONNECT)

    Note over User,Server: Live Database Event Occurs
    Server->>DB: Insert record into 'posts'
    Server-->>SDK: SSE Event: { action: 'create', record: { ... } }
    SDK->>>User: Invokes registered subscription callback
```

---

## Installation

### Node.js / Bundlers

Install `lspocket` using your package manager of choice:

```bash
# npm
npm install lspocket --save

# pnpm
pnpm add lspocket

# yarn
yarn add lspocket

# bun
bun add lspocket
```

Importing into your code:

```javascript
// Using ES Modules (Recommended)
import LSPocket from 'lspocket';

// OR using CommonJS
const LSPocket = require('lspocket/cjs');
```

> 💡 **Node < 17 Polyfills:**
> If you are running on Node.js versions prior to v17, make sure to supply a `fetch` polyfill such as [`cross-fetch`](https://github.com/lquixada/cross-fetch):
> ```javascript
> import 'cross-fetch/polyfill';
> ```
> For realtime subscriptions in Node environments, provide an `EventSource` polyfill:
> ```javascript
> import { EventSource } from 'eventsource';
> global.EventSource = EventSource;
> ```

### Browser (Direct `<script>` Tag)

You can load pre-bundled distributions directly in HTML:

```html
<!-- UMD (Browser Global: window.LSPocket) -->
<script src="/path/to/dist/lspocket.umd.js"></script>
<script>
  const pb = new LSPocket('http://127.0.0.1:8090');
</script>

<!-- OR ES Module in Browser -->
<script type="module">
  import LSPocket from '/path/to/dist/lspocket.es.mjs';
  const pb = new LSPocket('http://127.0.0.1:8090');
</script>
```

### React Native

For React Native, install the SDK alongside async storage and SSE polyfills:

```bash
npm install lspocket @react-native-async-storage/async-storage react-native-sse --save
```

Configure `AsyncAuthStore` and `EventSource`:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventSource from 'react-native-sse';
import LSPocket, { AsyncAuthStore } from 'lspocket';

global.EventSource = EventSource;

const store = new AsyncAuthStore({
  save: async (serialized) => AsyncStorage.setItem('pb_auth', serialized),
  initial: AsyncStorage.getItem('pb_auth'),
});

const pb = new LSPocket('http://127.0.0.1:8090', store);
```

---

## Quick Start

```javascript
import LSPocket from 'lspocket';

// 1. Initialize the client pointing to your LS Pocket backend
const pb = new LSPocket('http://127.0.0.1:8090');

// 2. Authenticate
const authData = await pb.collection('users').authWithPassword('user@example.com', '12345678');
console.log('Logged in token:', pb.authStore.token);
console.log('Current user ID:', pb.authStore.record.id);

// 3. Create a record
const newPost = await pb.collection('posts').create({
  title: 'Hello from LS Pocket SDK!',
  content: 'Building ultra-fast realtime apps.',
  status: 'published',
});

// 4. Fetch a paginated list
const resultList = await pb.collection('posts').getList(1, 20, {
  filter: 'status = "published"',
  sort: '-created',
});
console.log('Total records:', resultList.totalItems);

// 5. Realtime Subscription (SSE)
await pb.collection('posts').subscribe('*', (e) => {
  console.log('Realtime change action:', e.action); // 'create', 'update', or 'delete'
  console.log('Changed record:', e.record);
});
```

---

## Core Features & Caveats

### Binding Filter Parameters

When querying collections based on user input, use `pb.filter(expr, params)` to properly escape parameters and prevent injection:

```javascript
const result = await pb.collection('posts').getList(1, 20, {
  // Automatically escapes params and produces:
  // "title ~ 'hello world' && (views >= 100 || status = true)"
  filter: pb.filter('title ~ {:query} && (views >= {:minViews} || status = {:active})', {
    query: "hello ' world",
    minViews: 100,
    active: true,
  }),
});
```

Supported placeholders: `string`, `number`, `boolean`, `Date` (formatted to SQLite UTC string), `null`, `undefined`.

---

### File Uploads

File uploads are handled seamlessly via `multipart/form-data`. You can pass either standard web `FormData` or a plain JavaScript object with `File` or `Blob` instances:

```javascript
// Plain object:
await pb.collection('documents').create({
  title: 'Quarterly Report',
  file: new File(['report-data'], 'report.pdf', { type: 'application/pdf' }),
});

// Using FormData:
const form = new FormData();
form.set('title', 'Quarterly Report');
form.set('file', fileInput.files[0]);
await pb.collection('documents').create(form);
```

---

### Error Handling

All failed network requests and validations throw a normalized `ClientResponseError`:

```javascript
import { ClientResponseError } from 'lspocket';

try {
  await pb.collection('users').authWithPassword('wrong@email.com', 'invalid');
} catch (err) {
  if (err instanceof ClientResponseError) {
    console.log('Status code:', err.status);       // 400
    console.log('Response JSON:', err.response);   // { code: 400, message: "...", data: {...} }
    console.log('Was request aborted?', err.isAbort); // true if canceled by auto-cancellation
  }
}
```

---

### Auth Stores

#### LocalAuthStore (Default)
In browser environments, the default `LocalAuthStore` persists tokens to `window.localStorage` and synchronizes state between open browser tabs automatically.

#### AsyncAuthStore (React Native)
Use `AsyncAuthStore` with async storage engines (like `@react-native-async-storage/async-storage`).

#### Custom Auth Stores
Extend `BaseAuthStore` to define custom storage backends (e.g., Redis, memory caching, encrypted stores):

```javascript
import LSPocket, { BaseAuthStore } from 'lspocket';

class EncryptedAuthStore extends BaseAuthStore {
  save(token, record) {
    super.save(token, record);
    // Custom storage persistence logic...
  }
}

const pb = new LSPocket('http://127.0.0.1:8090', new EncryptedAuthStore());
```

#### Common Auth Store Methods

| Property / Method | Description |
|---|---|
| `pb.authStore.token` | Current JWT authentication token string |
| `pb.authStore.record` | Currently authenticated user or superuser record model |
| `pb.authStore.isValid` | Checks if the stored token exists and has not expired |
| `pb.authStore.isSuperuser` | Checks if the current token belongs to a superuser |
| `pb.authStore.clear()` | Logs out the current session and resets auth state |
| `pb.authStore.onChange(callback, fireImmediately)` | Registers a listener for authentication state transitions |
| `pb.authStore.loadFromCookie(cookieStr)` | Loads authentication state from a raw HTTP cookie header |
| `pb.authStore.exportToCookie(options)` | Exports authentication state as an HTTP cookie string |

---

### Auto Cancellation

The SDK cancels redundant inflight requests with identical endpoints to conserve resources and avoid race conditions:

```javascript
// The first two requests are automatically cancelled; only the 3rd completes:
pb.collection('posts').getList(1, 20); // Cancelled
pb.collection('posts').getList(2, 20); // Cancelled
pb.collection('posts').getList(3, 20); // Executed

// To disable auto-cancellation for a specific query:
pb.collection('posts').getList(1, 20, { requestKey: null });

// To disable auto-cancellation globally:
pb.autoCancellation(false);
```

---

### TypeScript Definitions & Generics

You can strongly type your records using generics:

```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  views: number;
  created: string;
  updated: string;
}

// Single item Promise<Post>
const post = await pb.collection('posts').getOne<Post>('RECORD_ID');

// Paginated list Promise<ListResult<Post>>
const posts = await pb.collection('posts').getList<Post>(1, 10);
```

---

### Custom Request Options

Every SDK service method accepts an optional `options` parameter (`SendOptions`):

```javascript
await pb.collection('posts').getList(1, 20, {
  headers: { 'X-Custom-Header': 'my-custom-value' },
  cache: 'no-store',
  requestKey: 'custom-key',
  // You can even pass a custom fetch implementation:
  fetch: async (url, config) => fetch(url, config),
});
```

---

### Send Hooks (Interceptors)

Inspect or alter outgoing requests and incoming responses globally:

```javascript
const pb = new LSPocket('http://127.0.0.1:8090');

// Before sending request
pb.beforeSend = function (url, options) {
  options.headers = Object.assign({}, options.headers, {
    'X-App-Client': 'LS-Pocket-Web/1.0',
  });
  return { url, options };
};

// After receiving response
pb.afterSend = function (response, data) {
  console.log('HTTP Status:', response.status);
  return data;
};
```

---

### SSR Integration

For Server-Side Rendering (SSR) applications (Next.js, Nuxt, SvelteKit, Astro), initialize a distinct client per request and sync authentication with cookies:

#### SvelteKit Example
```javascript
// src/hooks.server.js
import LSPocket from 'lspocket';

export async function handle({ event, resolve }) {
  event.locals.pb = new LSPocket('http://127.0.0.1:8090');
  event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

  try {
    if (event.locals.pb.authStore.isValid) {
      await event.locals.pb.collection('users').authRefresh();
    }
  } catch (_) {
    event.locals.pb.authStore.clear();
  }

  const response = await resolve(event);
  response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie({ httpOnly: false }));
  return response;
}
```

#### Next.js (App Router / Server Actions) Example
```javascript
import LSPocket from 'lspocket';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const pb = new LSPocket('http://127.0.0.1:8090');
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('pb_auth')?.value || '';

  pb.authStore.loadFromCookie(authCookie);
  return pb;
}
```

---

### Security Best Practices

1. **Content Security Policy (CSP)**: Configure a robust CSP header or meta tag to prevent XSS attacks targeting stored tokens.
2. **Untrusted Filters**: Always use `pb.filter()` to construct filter queries containing untrusted user inputs.
3. **Server-Side Superuser Credentials**: Never expose superuser tokens in client-side code or public browser bundles.

---

## API Reference

### Client Initialization

```javascript
const pb = new LSPocket(baseURL = '/', authStore = LocalAuthStore);
```

| Method | Description |
|---|---|
| `pb.send(path, sendOptions)` | Dispatches a raw HTTP request |
| `pb.autoCancellation(enable)` | Globally toggles request auto-cancellation |
| `pb.cancelAllRequests()` | Cancels all pending in-flight requests |
| `pb.cancelRequest(key)` | Cancels a specific request by requestKey |
| `pb.buildURL(path)` | Returns a complete absolute API URL |

---

### RecordService

Access via `pb.collection('collectionName')`:

#### CRUD Methods
```javascript
// Paginated records list
🔓 pb.collection('posts').getList(page = 1, perPage = 30, options = {});

// Full list fetched in batches
🔓 pb.collection('posts').getFullList(options = {});

// Retrieve first matching record
🔓 pb.collection('posts').getFirstListItem(filter, options = {});

// Retrieve a single record by ID
🔓 pb.collection('posts').getOne(recordId, options = {});

// Create a new record
🔓 pb.collection('posts').create(bodyParams, options = {});

// Update an existing record
🔓 pb.collection('posts').update(recordId, bodyParams, options = {});

// Delete a record
🔓 pb.collection('posts').delete(recordId, options = {});
```

#### Realtime Subscription Methods
```javascript
// Subscribe to changes on '*' or a specific record ID
🔓 pb.collection('posts').subscribe(topic, callback, options = {});

// Unsubscribe from a specific topic or all topics on collection
🔓 pb.collection('posts').unsubscribe(topic);
```

#### Auth Methods (Auth Collections Only)
```javascript
// List enabled authentication methods
🔓 pb.collection('users').listAuthMethods(options = {});

// Authenticate via Email/Username and Password
🔓 pb.collection('users').authWithPassword(email, password, options = {});

// Authenticate via One-Time Password (OTP)
🔓 pb.collection('users').authWithOTP(otpId, password, options = {});

// Authenticate via OAuth2 popup or redirect
🔓 pb.collection('users').authWithOAuth2({ provider: 'github' });

// Authenticate via OAuth2 code
🔓 pb.collection('users').authWithOAuth2Code(provider, code, codeVerifier, redirectUrl);

// Refresh current session
🔐 pb.collection('users').authRefresh(options = {});

// Request password reset email
🔓 pb.collection('users').requestPasswordReset(email, options = {});

// Confirm password reset
🔓 pb.collection('users').confirmPasswordReset(token, newPass, newPassConfirm, options = {});

// Request email verification
🔓 pb.collection('users').requestVerification(email, options = {});

// Confirm email verification
🔓 pb.collection('users').confirmVerification(token, options = {});

// Request email change
🔐 pb.collection('users').requestEmailChange(newEmail, options = {});

// Confirm email change
🔓 pb.collection('users').confirmEmailChange(token, password, options = {});

// Impersonate another user (Superuser only)
🔐 pb.collection('users').impersonate(recordId, duration, options = {});
```

---

### BatchService

Execute multiple create/update/delete operations in a single transactional HTTP request:

```javascript
const batch = pb.createBatch();

batch.collection('posts').create({ title: 'Batch Item 1' });
batch.collection('posts').create({ title: 'Batch Item 2' });
batch.collection('posts').delete('RECORD_ID_TO_DELETE');

const results = await batch.send();
```

---

### FileService

```javascript
// Generate absolute public file URL with optional thumbnail dimensions (e.g., "100x100")
🔓 pb.files.getURL(record, filename, { thumb: '100x100' });

// Acquire a private protected file token
🔐 pb.files.getToken(options = {});
```

---

### CollectionService

```javascript
// Paginated collections
🔐 pb.collections.getList(page = 1, perPage = 30, options = {});

// Get one collection by name or ID
🔐 pb.collections.getOne(idOrName, options = {});

// Create new collection schema
🔐 pb.collections.create(bodyParams, options = {});

// Update existing collection schema
🔐 pb.collections.update(idOrName, bodyParams, options = {});

// Delete collection
🔐 pb.collections.delete(idOrName, options = {});

// Truncate (delete all records inside collection)
🔐 pb.collections.truncate(idOrName, options = {});

// Import schema collection definitions
🔐 pb.collections.import(collections, deleteMissing = false, options = {});
```

---

### LogService

```javascript
// List request logs
🔐 pb.logs.getList(page = 1, perPage = 30, options = {});

// Get single log entry
🔐 pb.logs.getOne(id, options = {});

// Request log statistics
🔐 pb.logs.getStats(options = {});
```

---

### SettingsService

```javascript
// Fetch all application settings
🔐 pb.settings.getAll(options = {});

// Update application settings
🔐 pb.settings.update(bodyParams, options = {});

// Test S3 storage connection
🔐 pb.settings.testS3(filesystem = "storage", options = {});

// Send test email
🔐 pb.settings.testEmail(collectionIdOrName, toEmail, template, options = {});
```

---

### RealtimeService

```javascript
// Connect and subscribe to custom realtime topic
🔓 pb.realtime.subscribe(topic, callback, options = {});

// Unsubscribe from topic
🔓 pb.realtime.unsubscribe(topic);

// Connection status
console.log('Realtime active:', pb.realtime.isConnected);
```

---

### BackupService

```javascript
// List available database backups
🔐 pb.backups.getFullList(options = {});

// Create a new backup snapshot
🔐 pb.backups.create(basename = "", options = {});

// Upload external backup archive
🔐 pb.backups.upload({ file: fileObject }, options = {});

// Restore from a backup archive
🔐 pb.backups.restore(key, options = {});

// Delete a backup archive
🔐 pb.backups.delete(key, options = {});
```

---

### CronService

```javascript
// List all scheduled cron tasks
🔐 pb.crons.getFullList(options = {});

// Manually trigger a cron job
🔐 pb.crons.run(jobId, options = {});
```

---

### HealthService

```javascript
// Check server health status
🔓 pb.health.check(options = {});
```

---

### SQLService

```javascript
// Execute raw SQL query (Superuser only)
🔐 pb.sql.run(query, options = {});
```

---

## Development & Building

To run tests or build the SDK distribution packages from source:

```bash
# Clone the repository
git clone https://github.com/girishlade111/lspocket-js-sdk.git
cd lspocket-js-sdk

# Install dependencies
npm install

# Run unit test suite
npm test

# Format code with Prettier
npm run format

# Compile production bundles into dist/
npm run build
```

The build step generates the following artifacts in `dist/`:
- `dist/lspocket.es.mjs`: ES Module bundle
- `dist/lspocket.cjs.js`: CommonJS bundle
- `dist/lspocket.umd.js`: UMD bundle for browser `<script>` tags
- `dist/lspocket.iife.js`: Immediately Invoked Function Expression bundle
- `dist/lspocket.es.d.mts`: Complete TypeScript declaration types

---

## License

The LS Pocket JavaScript SDK is open-source software licensed under the [MIT License](LICENSE.md).
