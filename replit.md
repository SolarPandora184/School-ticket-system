# Overview

This is a full-stack ticket management system built with a modern React frontend and Express.js backend. The application allows users to submit support tickets and provides an admin interface for managing and tracking tickets. The system includes features like ticket creation, status management, priority levels, and real-time updates.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript** - Modern React application using functional components and hooks
- **Vite** - Fast development build tool with hot module replacement
- **shadcn/ui Components** - Comprehensive UI component library based on Radix UI primitives
- **Tailwind CSS** - Utility-first CSS framework for styling with custom design system
- **TanStack Query** - Server state management for API calls and caching
- **React Hook Form + Zod** - Form handling with schema validation
- **Wouter** - Lightweight routing library for navigation

## Backend Architecture
- **Express.js** - RESTful API server with middleware support
- **TypeScript** - Type-safe server-side development
- **In-Memory Storage** - Temporary data storage using Map objects (designed to be replaced with database)
- **Zod Validation** - Runtime type checking and validation for API endpoints
- **Session Management** - Basic session handling with middleware logging

## Database Design
- **Drizzle ORM** - Type-safe database toolkit configured for PostgreSQL
- **Schema Definition** - Well-defined ticket and user schemas with enums for status and priority
- **Database Ready** - Complete schema setup ready for PostgreSQL deployment

## Key Features
- **Dual Interface System** - Public ticket submission form and private admin panel
- **Admin Access Control** - Keyboard shortcut activation (PageUp x3) with localStorage persistence
- **Real-time Updates** - Live ticket status tracking and automatic refresh capabilities
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Type Safety** - End-to-end TypeScript with shared schema validation

## Authentication & Authorization
- **Admin Mode Toggle** - Simple browser-based admin activation without traditional login
- **Local Storage Persistence** - Admin status maintained across sessions
- **No User Authentication** - Public ticket submission without registration required

## API Structure
- **RESTful Endpoints** - Standard HTTP methods for ticket CRUD operations
- **Filtered Queries** - Separate endpoints for live tickets, past tickets, and statistics
- **Validation Middleware** - Request/response validation using Zod schemas
- **Error Handling** - Centralized error handling with proper HTTP status codes

# External Dependencies

## Core Framework Dependencies
- **React 18** - Frontend framework with concurrent features
- **Express.js** - Backend web framework
- **TypeScript** - Static type checking across the stack
- **Vite** - Build tool and development server

## UI and Styling
- **Radix UI** - Unstyled, accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built component library
- **Lucide React** - Icon library

## Data Management
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Form state management
- **Zod** - Schema validation and type inference
- **Drizzle ORM** - Database toolkit

## Database
- **PostgreSQL** - Primary database (configured via Neon)
- **Drizzle Kit** - Database migration tool

## Development Tools
- **ESBuild** - JavaScript bundler for production builds
- **PostCSS** - CSS processing with Autoprefixer
- **TypeScript Compiler** - Type checking and compilation

## Optional Integrations
- **Replit Plugins** - Development environment enhancements (error overlay, cartographer)