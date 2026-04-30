LIFTS - Full-Stack Fitness Tracker
A production-grade fitness and workout tracking application designed to help users log their training sessions, track progressive overload, and manage their workout history in real-time.

This application utilizes a decoupled architecture, featuring a modern React frontend communicating with a secure Java Spring Boot REST API, fully deployed on AWS cloud infrastructure.

🚀 Live Demo
Frontend: https://davidlifts.fit

Backend API: https://api.davidlifts.fit

🏗️ Architecture & Tech Stack
Frontend (Client)

React.js (Bootstrapped with Vite for optimized performance)

Deployment: Vercel (Edge network deployment)

Domain Management: Namecheap Custom DNS

Backend (Server)

Java & Spring Boot: RESTful API architecture handling business logic and security

Security: JWT-based authentication and secure token storage

Deployment: Amazon Web Services (AWS EC2)

Reverse Proxy: Nginx configured for optimized request routing and header management

SSL/Encryption: Let's Encrypt (Certbot) enforcing strict HTTPS/TLS

Database

PostgreSQL: Relational database mapping complex user and workout entities

Hosting: AWS RDS (Relational Database Service) for high availability and persistence

✨ Key Features
Secure Authentication: Users can securely register, log in, and maintain persistent sessions via JWT.

CRUD Functionality: Complete Create, Read, Update, and Delete operations for workout sessions and exercise sets.

Real-Time Synchronization: Frontend state updates instantly upon database mutation for a seamless UX.

Cloud Infrastructure: Fully containerized and hosted environment ensuring 24/7 availability.

💻 Local Development Setup
If you wish to run this project locally, follow these steps:

Prerequisites
Node.js and npm installed

Java 17+ and Maven installed

PostgreSQL installed and running locally

Running the Frontend
Clone the repository: git clone https://github.com/das622/gym-frontend.git

Navigate to the directory: cd gym-frontend

Install dependencies: npm install

Create a .env file in the root directory and add your local API URL:

Code snippet
VITE_API_URL=http://localhost:8080/api/v1
Start the development server: npm run dev