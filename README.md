
# Ticket Management System  
A Ticket Management System for managing customer support tickets, with user authentication and options to create, view, and manage tickets and customer data. The frontend is deployed on Vercel, and the backend is hosted on Render.  
--- 
## Project Links  
- **Frontend Deployment**: [Vercel Link](https://help-desk-woad.vercel.app/)  
- **Backend Deployment**: [Render Link](https://helpdesk-yyx0.onrender.com/)
- **POSTMAN LINK **: [POSTMAN Link](https://www.postman.com/roy707/workspace/shop-cart/collection/32632569-de64033d-4a79-4a1a-90c1-09138b9681d2?action=share&creator=32632569)

<img width="1031" alt="Screenshot 2024-11-11 at 12 32 21 AM" src="https://github.com/user-attachments/assets/8a14a9e6-9c00-45cc-b9fc-a68ecda5a5c6">

 
## About the Project  
This system is designed to streamline the process of handling support tickets, providing easy access to ticket and customer information. Key features include:  - **User Authentication**: Users can sign up, log in, and log out.  
- **Ticket Management**: Users can create, view, update, and manage tickets.
- **Customer Management**: Access and manage customer-related information associated with tickets.

## Setup Instructions  
### Prerequisites  
- **Node.js** (v14 or later)
- **MongoDB** (for local database if needed)
- **npm** or **yarn** (package manager)

### Backend Setup  
1. **Clone the repository**:
git clone https://github.com/roy7077/HelpDesk.git
cd HelpDesk/server  

2. npm install
    
3.  PORT=8080
    MONGODB_URL=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    
4.  npm start
    The backend server should now be running on http://localhost:8080.
    

### Frontend Setup

1.  cd ../client
    
2.  npm install
    
3.  **Configure Environment Variables**:
    In the frontend code, ensure that the API URL is set to your backend endpoint (e.g., http://localhost:8080 or your Render link).
    
5.  npm start The frontend should now be running on http://localhost:3000.
