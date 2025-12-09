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
![Screenshot 2024-06-30 200926](https://github.com/devparekh24/DriveEasy-CRS/assets/103924658/e11ad63f-d78c-4292-98fc-a90c5ee5e84d)

![Screenshot 2024-06-30 200935](https://github.com/devparekh24/DriveEasy-CRS/assets/103924658/4fafe468-7fac-429a-af93-138e3ef7ee5f)

![Screenshot 2024-06-30 195807](https://github.com/devparekh24/DriveEasy-CRS/assets/103924658/128237bc-8f16-4b10-ba30-b1769dc5f6ce)

![Screenshot 2024-06-30 200355](https://github.com/devparekh24/DriveEasy-CRS/assets/103924658/8cf505d0-be40-4ac0-bdca-3a92da94f8cc)

![Screenshot 2024-06-30 200424](https://github.com/devparekh24/DriveEasy-CRS/assets/103924658/3de48f20-e0c4-42c5-8e5f-c92c463283b6)

![Screenshot 2024-06-30 200444](https://github.com/devparekh24/DriveEasy-CRS/assets/103924658/eef7689e-8509-4b73-a2ea-4f5234a2bb11)

![Screenshot 2024-06-30 200459](https://github.com/devparekh24/DriveEasy-CRS/assets/103924658/0da2cd1b-e500-4f64-9aa8-48d305d3ff24)

![Screenshot 2024-06-30 200521](https://github.com/devparekh24/DriveEasy-CRS/assets/103924658/56430a25-591c-4906-b041-df37467bf029)

![Screenshot 2024-06-30 200623](https://github.com/devparekh24/DriveEasy-CRS/assets/103924658/bfefab0a-20f1-494a-9eab-33185b8d6dd2)

![Screenshot 2024-06-30 200659](https://github.com/devparekh24/DriveEasy-CRS/assets/103924658/ec4fe5bb-cffa-44c6-9400-38e3b0f89174)

![Screenshot 2024-06-30 200738](https://github.com/devparekh24/DriveEasy-CRS/assets/103924658/dab1eaaa-294e-4795-99fd-f0dd97d4f31d)

![Screenshot 2024-06-30 200816](https://github.com/devparekh24/DriveEasy-CRS/assets/103924658/35ae5bc2-12a4-416b-b46f-8dfda7e736f8)


