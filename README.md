# DriveEasy - Car Rental System (CRS)

## Project Description
DriveEasy is a comprehensive Car Rental System (CRS) designed to streamline the process of renting cars. Built using the MERN stack ([MongoDB](https://www.mongodb.com/), [Express.js](https://expressjs.com/), [React.js](https://react.dev/), and [Node.js](https://nodejs.org/en)), along with [Redux](https://redux.js.org/), [Redux Toolkit](https://redux-toolkit.js.org/), and [TypeScript](https://www.typescriptlang.org/), the system provides a user-friendly platform for both customers and administrators.

## Features

### User Registration and Authentication
- User account creation and management
- Secure login/authentication using JWT (JSON Web Tokens)
- Password encryption for added security

### Car Listings
- Display a list of available cars with details such as make, model, year, rental cost, and availability status

### Search and Filter
- Search for cars based on criteria like rental price per day, rental price per hour, rental price per km, transmission, fuel type, and seating capacity
- Implement filters to refine search results

### Booking System
- Manage bookings with real-time updates on vehicle availability

### Pick-up and Drop-Off Location Selections
- Easy selection processes for pick-up and drop-off locations

### Rental Pricing
- Flexible pricing models (daily, hourly, per kilometer)
- Variable pricing based on vehicle type, model, or features

### Payment Integration
- Online payment processing
- Secure payment gateway integration with popular services like Razorpay

### Notification System
- Implement notifications for reservation confirmations, reminders, updates, and more

### User Profile
- Users can view their booking history, current reservations, and personal information

### Contact Us
- Users and visitors can contact the admin for queries or feedback
- A form for car owners to offer their vehicles for rent

### Admin Panel
- Manage car listings, user accounts, contact queries, and bookings
- Admins can add, edit, or remove cars from the inventory
- Manage bookings, users, and damage reports

### Car Management
- Add new cars to the system
- Update car information (model, year, specifications, etc.)
- Upload images and specifications

### Damage Reporting
- Create and document reports for any damages to rented cars during their rental period

## Technology Stack
- **Frontend**: [React.js](https://react.dev/), [Redux](https://redux.js.org/), [Redux Toolkit](https://redux-toolkit.js.org/), [TypeScript](https://www.typescriptlang.org/)
- **Backend**: [Node.js](https://nodejs.org/en), [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/)
- **Payment Gateway**: [Razorpay](https://razorpay.com/)


## Getting Started

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/devparekh24/DriveEasy-CRS.git
    ```
2. Navigate to the project directory:
    ```bash
    cd DriveEasy-CRS
    ```
3. Install dependencies for both client and server:
    ```bash
    npm install
    cd client
    npm install
    cd ..
    ```
4. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    ```

### Running the Application
1. Start the server:
    ```bash
    npm run start
    ```
2. Start the client:
    ```bash
    cd client
    npm run dev
    ```

---

Happy coding!
