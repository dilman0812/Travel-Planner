# 🗺️ Travel Planner — Smart Travel Planning Web Application

## Overview
Travel Planner is a full-stack web application that helps users plan their trips efficiently. Users can search destinations, view recommended itineraries, connect with local guides, and access hotel booking links — all from one place.

The platform also allows guides to register, manage their availability, and approve user requests for guided tours. It provides a seamless connection between tourists and local guides while also giving access to recommended hotels, itineraries, and nearby places.

## ✨ Features

### 🏠 Home Page
- Displays recommended travel itineraries for popular destinations
- Shows top states and cities with attractions, nearby places, and travel details
- Each itinerary includes a Booking.com hotel link for convenient accommodation search

### 📅 Planner
- Interactive search form with destination, start date, and end date inputs
- Fetches destination details and available guides dynamically from the database
- Dynamically generates Booking.com hotel links using user-input dates and locations
- Users can send requests to guides and create their own itineraries by adding destinations to a cart

### 🔐 Authentication
**Two distinct roles:**
- **User** — can register, log in, create itineraries, and send guide requests
- **Guide** — can register, list their services, manage bookings, and approve requests
- Guides and users have separate profile dashboards
- Booking status updates are visible in both dashboards once approved

### 📋 Booking System
- Users can send requests to available guides
- Guides can approve or reject requests
- Once approved, the booking status is updated for both user and guide accounts

## 🛠️ Tech Stack

| Layer | Technology Used |
|-------|----------------|
| Frontend | HTML, CSS, JavaScript, EJS Templates |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (pg-promise) |
| Integration | Booking.com hotel links |
| Authentication | Session-based (custom logic) |

## 📁 Project Structure
```
Travel-Planner/
│
├── app.js # Main server file (Express app)
├── package.json
├── README.md
├── .env # Database credentials
│
├── views/ # EJS templates
│ ├── home.ejs
│ ├── login.ejs
│ ├── planner.ejs
│ ├── result.ejs
│ ├── guide-dashboard.ejs
│ └── user-dashboard.ejs
│
├── public/ # Static assets
│ ├── css/
│ ├── js/
│ └── images/
│
├── recommendations/ # Recommended itineraries folder
└── states/ # Folders for each state with city data
```
## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/dilman0812/travel-planner-platform.git
cd travel-planner-platform
```
### 2. Install Dependencies
```
npm install
```
### 3. Configure Database
```
Create a PostgreSQL database.
Add a .env file or update your database URL in app.js:
env
DATABASE_URL=postgresql://<username>:<password>@<host>/<dbname>?sslmode=require
```
### 4. Run the Server
```
node app.js
or
nodemon app.js
```
### 5. Open in Browser
```
http://localhost:3000/
```
## 🗃️ Database Structure

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| name | TEXT | User's full name |
| email | TEXT | User's email (primary key) |
| password | TEXT | User's password |
| bookings | TEXT | Stores booking details |

### Guides Table
| Column | Type | Description |
|--------|------|-------------|
| aadharno | TEXT | Unique guide identifier |
| guidename | TEXT | Guide name |
| email | TEXT | Guide email (primary key) |
| password | TEXT | Password |
| contactno | TEXT | Contact number |
| languagespoken | TEXT | Languages guide can speak |
| availability | TEXT | Availability status |
| charges | INTEGER | Per-day charges |
| city | TEXT | City name |
| state | TEXT | State name |
| booking_requests | TEXT | Stores user requests |

### Locations Table
| Column | Type | Description |
|--------|------|-------------|
| city | TEXT | City name |
| state | TEXT | State name |
| attraction | TEXT | Attraction name |
| description | TEXT | Information about the attraction |

## 👨‍💻 Author
I built using Node.js, Express.js, EJS, and PostgreSQL.

## 📄 License
You are free to modify and distribute it for educational or personal use.

---

⭐ If you found this project useful, give it a star on GitHub!
