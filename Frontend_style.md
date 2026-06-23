# Relatio CRM — Frontend Design Guidelines

## Overview

Relatio is a modern CRM platform focused on managing relationships, leads, companies, proposals, opportunities, and customer interactions.

The design philosophy combines:

* Linear Design Language
* Bento Dashboard Layout
* Modern SaaS Principles
* Enterprise-Ready User Experience

The goal is to create a clean, premium, fast, and professional CRM experience suitable for startups and growing businesses.

---

# Brand Identity

## Brand Name

**Relatio**

## Meaning

Derived from the Latin word *Relatio*, representing:

* Relationship
* Connection
* Communication
* Reporting
* Business Growth

## Brand Personality

* Professional
* Intelligent
* Trustworthy
* Modern
* Efficient
* Data-Driven

---

# Design Principles

## Core Goals

The interface should feel:

* Fast
* Modern
* Professional
* Premium
* Minimal
* Easy to Navigate

The UI should prioritize productivity and readability over visual effects.

---

# Design Inspiration

Primary Inspirations:

* Linear
* Vercel
* Stripe Dashboard
* Notion
* Raycast

Avoid:

* Heavy Glassmorphism
* Neobrutalism
* Excessive Gradients
* Cartoon-like Components
* Overly Decorative Elements

---

# Color System

## Dark Mode (Primary)

### Background

```css
#09090B
```

### Sidebar

```css
#111113
```

### Card Surface

```css
#18181B
```

### Border

```css
rgba(255,255,255,0.08)
```

### Primary Accent

```css
#6366F1
```

### Secondary Accent

```css
#8B5CF6
```

### Success

```css
#22C55E
```

### Warning

```css
#F59E0B
```

### Danger

```css
#EF4444
```

### Text Primary

```css
#FAFAFA
```

### Text Secondary

```css
#A1A1AA
```

---

# Typography

## Font Family

Preferred:

* Inter
* Geist

Fallback:

```css
font-family:
Inter,
Geist,
system-ui,
sans-serif;
```

## Font Weight

### Heading

```css
600
```

### Labels

```css
500
```

### Body

```css
400
```

---

# Layout Structure

## Top Navigation

Components:

* Relatio Logo
* Global Search
* Quick Actions
* Notifications
* User Profile Menu

Characteristics:

* Sticky Header
* Clean Layout
* Minimal Height
* Quick Access Workflow

---

## Sidebar Navigation

Navigation Items:

* Dashboard
* Leads
* Contacts
* Companies
* Proposals
* Opportunities
* Activities
* Tasks
* Reports
* Settings

Requirements:

* Collapsible Sidebar
* Icon + Label
* Active State Indicator
* Smooth Animation

---

# Dashboard Design

## Layout Style

Use a Bento Grid layout.

Characteristics:

* Uneven card sizes
* Modular blocks
* Flexible arrangement
* Information-rich design

---

## First Row

### KPI Cards

Display:

* Total Leads
* Active Opportunities
* Open Proposals
* Monthly Revenue

Card Contents:

* Title
* Value
* Trend Indicator
* Growth Percentage

---

## Second Row

### Sales Pipeline

Large Visualization Card

Contents:

* Pipeline Stages
* Conversion Overview
* Lead Flow

### Revenue Analytics

Large Visualization Card

Contents:

* Revenue Trends
* Monthly Comparison
* Growth Insights

---

## Third Row

### Recent Activities

Display latest CRM actions.

Examples:

* New Lead Created
* Proposal Sent
* Deal Updated
* Contact Added

### Upcoming Tasks

Display:

* Due Date
* Priority
* Status

### Team Performance

Display:

* Top Performers
* Closed Deals
* Revenue Contribution

---

## Fourth Row

### Recent Leads Table

Columns:

* Name
* Company
* Status
* Value
* Last Contact
* Owner

Features:

* Search
* Sorting
* Pagination
* Row Actions

---

# Card Design

Requirements:

* Border Radius: 16px
* Soft Border
* Minimal Shadow
* Hover State
* Smooth Transition

Example:

```css
border-radius: 16px;
transition: all 0.2s ease;
```

---

# Table Design

Requirements:

* Sticky Header
* Compact Layout
* Hover Effect
* Responsive Design

Focus on data readability.

---

# Form Design

Requirements:

* Floating Labels
* Clear Validation
* Consistent Spacing
* Accessible Inputs

Input States:

* Default
* Focus
* Error
* Disabled

---

# Button Design

Variants:

### Primary

Used for main actions.

Examples:

* Save
* Create Lead
* Send Proposal

### Secondary

Used for supporting actions.

Examples:

* Edit
* Duplicate

### Ghost

Used for lightweight interactions.

Examples:

* Cancel
* View Details

---

# Badge System

Lead Statuses:

* New
* Contacted
* Qualified
* Proposal
* Negotiation
* Won
* Lost

Use subtle background colors.

Avoid bright saturated colors.

---

# Component Architecture

Recommended Structure:

```plaintext
src/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── leads/
│   ├── contacts/
│   ├── proposals/
│   └── shared/
│
├── layouts/
│
├── pages/
│
├── hooks/
│
├── services/
│
├── utils/
│
└── types/
```

---

# Technical Stack

Frontend:

* React
* Tailwind CSS
* React Router
* TanStack Query
* Axios

Charts:

* Recharts

Icons:

* Lucide React

Tables:

* TanStack Table

Forms:

* React Hook Form
* Zod

---

# User Experience Goals

Every screen should feel:

* Fast
* Predictable
* Professional
* Data-Focused

Users should be able to:

* Find information quickly
* Manage leads efficiently
* Track proposals easily
* Monitor business growth visually

---

# Final Vision

Relatio should look and feel like a premium SaaS product released in 2026.

The experience should combine:

* Linear's simplicity
* Vercel's professionalism
* Stripe's clarity
* Bento Dashboard's flexibility

The result should be a CRM that is modern, scalable, maintainable, and suitable for long-term product growth.
