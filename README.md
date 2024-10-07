# Fullstack User Management Application

This project is a Fullstack User Management Application built with React (Frontend) and Node.js/Express (Backend), using PostgreSQL for database management. The app allows admin users to create, manage, and delete users while enforcing role-based access control (RBAC).

## Features

- **Google and Microsoft OAuth login :**
- **Role-Based Access Control (RBAC):** Different permissions are granted based on user roles.
- **Create Users:** Admins can create new users with different roles.
- **Delete Users:** Admins can delete selected users, except for themselves.
- **Assign Roles:** Change a user's role (e.g., from regular user to admin).
- **Create roles :**
- **Delete roles :**
- **Reassign User to role :**
- **Change Permissions of Roles:**

  
## Table of Contents

- [Project Setup](#project-setup)
- [Backend](#backend)
- [Frontend](#frontend)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Additional Notes](#additional-notes)

---

## Project Setup

### Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) v14 or higher
- [PostgreSQL](https://www.postgresql.org/)
- [Postman](https://www.postman.com/) (Optional, for API testing)
- [Git](https://git-scm.com/)

### Installation

**Clone the Repository**
   ```bash
   git clone repo
   cd ReactNodeUserRoles

# BACKEND
cd backend
npm install
npm start


Create a .env file :
DB_USER=
DB_HOST=
DB_NAME=
DB_PASS=
DB_PORT=
FRONTEND_URL=
SESSION_SECRET_KEY=


# FRONTEND
cd ../frontend
npm install
npm run dev

Create a .env file:
VITE_GOOGLE_CLIENT_ID=
VITE_MICROSOFT_CLIENT_ID=


# DATABASE SETUP
1. Create users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'regular',
);


CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    permissions TEXT[]
);

# create 2 users : admin and regular also

# FRONTEND TESTING
npm run test

# BACKEND TESTING
npm run test