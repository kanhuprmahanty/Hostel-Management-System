# 🏨 Hostel Management System

A full-stack **Hostel Management System** built using **Spring Boot, React.js, MySQL, and Firebase** to manage hostel operations, student records, room allocation, authentication, and administrative activities through a modern web application.

## 📌 About the Project

The Hostel Management System provides a centralized platform for managing hostel-related activities efficiently. It follows a **frontend-backend architecture**, where React handles the user interface and Spring Boot provides REST APIs and business logic.

## 🚀 Key Features

* 🔐 User Authentication & Authorization
* 👨‍🎓 Student Management
* 🏠 Hostel & Room Management
* 🛏️ Room Allocation
* 📋 Student Registration
* 🔍 Search and View Student Details
* ✏️ Update Student Information
* 🗑️ Delete Student Records
* 📊 Admin Dashboard
* 📱 Responsive User Interface
* 🔥 Firebase Integration
* 🗄️ MySQL Database Management
* 🌐 RESTful APIs
* ⚠️ Exception Handling
* ✅ Form Validation

## 🛠️ Technology Stack

### Backend

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Hibernate
* REST API
* Maven
* Lombok

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Bootstrap / Tailwind CSS
* Axios
* React Router

### Database & Services

* MySQL
* Firebase
* Firebase Authentication / Services

### Development Tools

* IntelliJ IDEA / Eclipse
* Visual Studio Code
* Postman
* Git
* GitHub
* MySQL Workbench
* npm

## 📂 Project Structure

```text
Hostel-Management-System/
│
├── backend/
│   ├── src/main/java/
│   │   └── controller/
│   │   └── service/
│   │   └── repository/
│   │   └── entity/
│   │   └── dto/
│   │   └── exception/
│   │
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── routes/
│   │   └── App.jsx
│   │
│   ├── public/
│   └── package.json
│
└── README.md
```

## 🔄 Application Workflow

```text
User
 ↓
React Frontend
 ↓
Authentication
 ↓
Spring Boot REST API
 ↓
Controller
 ↓
Service Layer
 ↓
Repository Layer
 ↓
MySQL Database
 ↓
Response
 ↓
React UI
```

## 🔐 Authentication

The application uses authentication mechanisms to control access to the system.

Authentication can include:

* User Registration
* Login
* Logout
* Authentication Validation
* Role-Based Access
* Firebase Authentication

## 👨‍🎓 Student Management

Administrators can manage student information including:

* Student ID
* Student Name
* Email
* Phone Number
* Gender
* Address
* Course
* Room Details
* Admission Information

## 🏠 Hostel Management

The system provides functionality for:

* Hostel details
* Room details
* Room availability
* Room allocation
* Student-room mapping
* Room occupancy management

## 🛏️ Room Allocation

The room allocation process:

```text
Student Registration
        ↓
Check Room Availability
        ↓
Select Room
        ↓
Allocate Room
        ↓
Update Room Status
        ↓
Store Allocation
```

## 🔌 REST API

The Spring Boot backend exposes RESTful APIs for communication with the React frontend.

Typical operations include:

```text
GET     → Retrieve records
POST    → Create records
PUT     → Update records
DELETE  → Delete records
```

Example endpoints:

```text
/api/students
/api/rooms
/api/hostels
/api/users
/api/auth
```

## 🗄️ Database

MySQL is used as the primary relational database.

Main entities may include:

```text
User
Student
Hostel
Room
RoomAllocation
```

Spring Data JPA and Hibernate are used for database operations and object-relational mapping.

## 🔥 Firebase Integration

Firebase is used for application services such as authentication and related frontend functionality.

Typical configuration includes:

```text
Firebase Configuration
        ↓
Firebase SDK
        ↓
Authentication / Services
        ↓
React Application
```

Firebase configuration should be stored securely and sensitive credentials should not be committed to GitHub.




Create the database:

```sql
CREATE DATABASE hostel_management_system;
```

Update database properties:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hostel_management_system
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

###  Run Backend

Run the Spring Boot application.

The backend will be available at:

```text
http://localhost:8080
```

## ⚛️ Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

The frontend will normally run on the Vite development server.

## 🧪 API Testing

The REST APIs can be tested using **Postman**.

Test:

* GET requests
* POST requests
* PUT requests
* DELETE requests
* Authentication requests
* Validation scenarios
* Error responses

## 🛡️ Exception Handling

The backend handles application errors using centralized exception-handling mechanisms.

Examples:

* Resource Not Found
* Invalid Input
* Database Errors
* Validation Errors
* Unauthorized Access
* Internal Server Errors

## 📱 Responsive Design

The React frontend is designed to provide a user-friendly experience across:

* Desktop
* Laptop
* Tablet
* Mobile devices

## 📈 Future Enhancements

* Online hostel fee management
* Payment gateway integration
* Complaint management
* Visitor management
* Leave management
* Food/mess management
* Email notifications
* SMS notifications
* Advanced admin dashboard
* Docker deployment
* Cloud deployment
* Automated testing
* Role-based security improvements

## 🎯 Learning Outcomes

This project demonstrates practical knowledge of:

* Java
* Spring Boot
* Spring MVC
* Spring Data JPA
* Hibernate
* REST API Development
* React.js
* JavaScript
* MySQL
* Firebase
* CRUD Operations
* Authentication
* Exception Handling
* MVC Architecture
* API Integration
* Git & GitHub

## 💼 Project Highlights

* Full-stack web application
* RESTful backend architecture
* Modern React frontend
* Relational database integration
* Firebase service integration
* CRUD-based functionality
* Layered Spring Boot architecture
* API testing with Postman
* Responsive user interface

## 👨‍💻 Author

**Kanhu Prasad Mahanty**

MCA Graduate | Fresher | Full Stack Java Developer

### Technical Focus

```text
Java | Spring Boot | Spring Data JPA
REST API | Microservices | MySQL
React.js | JavaScript | Firebase
HTML | CSS | Git | GitHub
```

## ⭐ Support

If you find this project useful for learning **Full Stack Java Development**, consider giving the repository a ⭐.

**Learn → Build → Test → Deploy → Improve**

## 📜 License

This project is developed for educational and portfolio purposes.

