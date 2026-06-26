# RELATIO CRM - Project Progress

## Project Overview

**Project Name:** Relatio

**Tech Stack:**

* PostgreSQL
* Express.js
* React
* Node.js
* TypeScript
* Prisma ORM
* JWT Authentication
* Tailwind CSS (Frontend nanti)

**Architecture:**

* Route
* Controller
* Service
* Repository
* Prisma ORM

---

# Project Goal

Membangun Mini CRM (Customer Relationship Management) untuk mempelajari stack PERN secara end-to-end dengan standar struktur project yang umum digunakan di industri.

---

# Current Progress

## Backend Setup

### Environment Setup

* [x] Node.js Installed
* [x] TypeScript Setup
* [x] Express Setup
* [x] ts-node-dev Setup
* [x] Environment Variables (.env)
* [x] PostgreSQL Connection
* [x] Prisma Setup
* [x] Prisma Migration

---

### Database

Database:

```sql
relatio_db
```

Tables:

* [x] User
* [x] Lead
* [x] Customer
* [x] _prisma_migrations

Current User Schema:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  leads     Lead[]
  customers Customer[]
}
```

---

### Authentication

#### Register

Endpoint:

POST /api/auth/register

Status:

* [x] Create User
* [x] Email Validation
* [x] Password Hashing
* [x] Save To Database

---

#### Login

Endpoint:

POST /api/auth/login

Status:

* [x] Find User By Email
* [x] Compare Password
* [x] Generate JWT
* [x] Return Token

---

### Project Structure

Current:

```text
src/
│
├── config/
├── controllers/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── validations/
│
├── app.ts
└── server.ts
```

---

# Completed Learning Topics

## Express

* [x] Express App Setup
* [x] Router
* [x] Middleware
* [x] Request & Response

---

## TypeScript

* [x] TypeScript Configuration
* [x] Typing Request & Response
* [x] Function Typing

---

## PostgreSQL

* [x] Database Creation
* [x] Database Connection
* [x] Table Creation Through Prisma

---

## Prisma

* [x] Prisma Init
* [x] Schema Creation
* [x] Migration
* [x] Prisma Client
* [x] CRUD Basic

---

## Security

* [x] bcrypt Hashing
* [x] JWT Generation

---

# Next Development Roadmap

## Sprint 2 - Authentication Completion

### JWT Middleware

Status:

* [x] Create auth.middleware.ts
* [x] Verify JWT
* [x] Attach User To Request
* [x] Protected Routes

---

### Current User Endpoint

Endpoint:

GET /api/auth/me

Status:

* [x] Development
* [x] Testing

Purpose:

Return current authenticated user information.

---

## Sprint 3 - Lead Management

### Database

```prisma
model Lead {
  id        Int      @id @default(autoincrement())
  name      String
  email     String?
  phone     String?
  company   String?
  status    String   @default("new")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId    Int?
  user      User?    @relation(fields: [userId], references: [id])
}
```

---

### Features

* [x] Create Lead
* [x] Get Leads
* [x] Get Lead By ID
* [x] Update Lead
* [x] Delete Lead
* [x] Protect Lead Routes With JWT
* [x] Filter Leads By Logged In User

Endpoints:

POST /api/leads
GET /api/leads
GET /api/leads/:id
PUT /api/leads/:id
DELETE /api/leads/:id

---

## Sprint 4 - Customer Management

Features:

* [x] Create Customer
* [x] Get Customers
* [x] Customer Detail
* [x] Update Customer
* [x] Delete Customer
* [x] Protect Customer Routes With JWT
* [x] Filter Customers By Logged In User

Endpoints:

POST /api/customers
GET /api/customers
GET /api/customers/:id
PUT /api/customers/:id
DELETE /api/customers/:id

---

## Sprint 5 - Activity Tracking

Features:

* [x] Notes
* [x] Follow Up
* [x] Call Logs
* [x] Meeting Logs

---

## Sprint 6 - Dashboard

Features:

* [x] Total Leads
* [x] Total Customers
* [x] Conversion Rate
* [x] Recent Activities

---

## Sprint 7 - Frontend Foundation & Layout

### Basic Setup
* [x] Vite, React, TypeScript Setup
* [x] Tailwind CSS v4 Configuration
* [x] React Router & Axios Setup
* [x] Install UI Libraries (Lucide React, React Hook Form, Zod, Recharts, TanStack Table)

### Theme & Layout (Dark Mode Primary)
* [x] Setup Core CSS Variables (Background: #09090B, Accent: #6366F1)
* [x] Create Shared UI Components (Button, Input, Card, Badge)
* [x] Sidebar Navigation (Collapsible)
* [x] Top Navigation Bar (Search, Profile)
* [x] Main Layout System

---

## Sprint 8 - Authentication UI

* [x] Auth State Management Setup (Zustand or Context)
* [x] Login Page UI (Modern SaaS Style)
* [x] Integrate Login API & Token Storage
* [x] Axios Interceptors Implementation
* [x] Protected Routes Logic

---

## Sprint 9 - CRM Core UI (Leads & Customers)

### Leads Management
* [x] Leads Table View (TanStack Table)
* [x] Create/Edit Lead Modal or Page (React Hook Form + Zod)
* [x] Integrate Lead API (CRUD)
* [x] Status Badges UI

### Customers (Contacts) Management
* [x] Customers Table View
* [x] Customer Detail Page 
* [x] Integrate Customer API (CRUD)

---

## Sprint 10 - Dashboard & Activities UI

### Bento Dashboard Overview
* [x] KPI Cards Component (Total Leads, Customers, Conversion)
* [x] Integrasi Dashboard API
* [x] Revenue/Pipeline Chart (Recharts) Placeholder

### Activities Tracking
* [x] Activity Timeline Component
* [x] Add Activity UI (Notes, Calls, Follow-ups)
* [x] Integrate Activity API

---

# Future Improvements

## Backend Ecosystem (API for New UI)

* [ ] Zod Validation & Global Error Handler
* [ ] Logger & Refresh Token
* [ ] Role Permission (Team Management)
* [ ] Pagination, Filtering, Search
* [ ] Opportunities & Pipeline Module
* [ ] Companies Module
* [ ] Proposals Module
* [ ] Tasks Management

---

## Frontend Architecture

* [ ] Custom hook / state management setup
* [ ] Zustand (State Management)
* [ ] Dark Mode Implementation (Primary Theme)
* [ ] Recharts (Revenue & Pipeline Analytics)
* [ ] TanStack Table (Data Grids)
* [ ] Lucide React (Icons)

---

# Current Completion

Backend Foundation : 65%

Authentication : 100%

CRM Features : 100%

Frontend : 100%

Overall Project : 95%

---

Last Updated:

2026-06-27




