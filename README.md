# PhD Tracking System - Spectrum Consultants

A professional, full-fledge MERN-stack application designed for **Spectrum Consultants** to manage and track PhD and Postdoctoral applications. Styled after [spectrumconsultants.pk](https://spectrumconsultants.pk/), this platform provides a seamless experience for both applicants and administrators.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide React, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Storage** | Firebase Storage (Admin SDK) |
| **Auth** | JWT (JSON Web Tokens) with Role-Based Access Control (RBAC) |
| **Styling** | Vanilla CSS (Spectrum Red & Dark Theme) |

---

## System Architecture & Flow

### 1. Data Communication
The system follows a classic **Client-Server architecture**:
*   **Frontend (React)**: Communicates with the backend via RESTful APIs using **Axios**.
*   **Backend (Express)**: Validates requests, interacts with MongoDB for data persistence, and coordinates with Firebase for document storage.
*   **Authentication**: Uses JWT. Upon login/register, the server issues a token which the client stores in `localStorage` and attaches to the `Authorization` header for protected routes.

### 2. Document Handling Flow
1. **Student** selects a file (PDF/Image) in the **Documents Module**.
2. **Frontend** sends a `multipart/form-data` POST request to `/api/upload`.
3. **Backend** processes the file buffer using `multer`, uploads it to **Firebase Storage** via the Admin SDK, and makes it public.
4. **Firebase** returns a public URL.
5. **Backend** sends this URL back to the student's local form state.
6. **Student** saves the section, persisting the URL to **MongoDB**.

---

## Comprehensive Features

### Student Portal
*   **Dashboard**: Animated progress bar (completion %), application status stepper, and quick action cards.
*   **11-Step Form**:
    1.  **Applicant Info**: Basic personal details (name, DOB, nationality).
    2.  **Contact Details**: Phone, email, and address tracking.
    3.  **Guardian Info**: Parental/Guardian contact and occupation.
    4.  **Academic Background**: Dynamic list of degrees, institutions, and CGPA.
    5.  **Program Info**: PhD/Postdoc selection and intake year.
    6.  **Research & Experience**: Publications list and research statement.
    7.  **English Proficiency**: IELTS/PTE/TOEFL scores and test dates.
    8.  **Funding Info**: Scholarship or self-funded details.
    9.  **Referees**: Management of up to 3 academic/professional references.
    10. **Document Upload**: Securely upload CV, transcripts, passport, and certificates.
    11. **Final Declaration**: Legal agreement and digital signature.
*   **Notification Center**: Real-time alerts for status updates (e.g., "Application Accepted").

### Admin Portal
*   **Global Dashboard**: Visual stats for total applications, pending reviews, and acceptance rates.
*   **Application Management**: Centralized table with search, filtering by status, and quick-action status updates.
*   **Automated Triggers**: Updating an application status automatically generates a notification for the student.

---

## API Documentation

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Register a new student | Public |
| POST | `/login` | Authenticate & get token | Public |
| GET | `/me` | Get current user profile | Private |

### 2. Applications (`/api/applications`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/me` | Get student's current application | Student |
| PUT | `/me/section/:section` | Save specific form section | Student |
| POST | `/me/submit` | Final submission | Student |
| GET | `/` | List all applications | Admin |
| PUT | `/:id/status` | Update application status | Admin |

### 3. Notifications (`/api/notifications`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/` | Get user notifications | Private |
| PUT | `/:id/read` | Mark notification as read | Private |
| POST | `/` | Create new notification | Admin |

---

## Installation & Setup

### Prerequisites
*   Node.js (v16.x or higher)
*   MongoDB Atlas Account
*   Firebase Project with Storage enabled

### 1. Clone & Install
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Configure Environment
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_secret
JWT_EXPIRE=30d
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NODE_ENV=development
```
*Note: Ensure `serviceAccountKey.json` is present in the project root.*

### 3. Run Development
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

---

## Design Philosophy
The system implements the **Spectrum Consultants Design System**:
*   **Primary Accent**: `#ED1C24` (Spectrum Red)
*   **Main Neutral**: `#1A1A1B` (Bold Dark)
*   **Backgrounds**: `#F7F7F7` (Professional Light)
*   **Typography**: `Poppins` for confidence-building headings; `Inter` for operational UI efficiency.

---

## Security Standards
*   **Password Protection**: Salted hashes via `bcryptjs`.
*   **Authentication**: Stateless JWT with expiration.
*   **File Security**: Server-side filtering of MIME types and file sizes.
*   **RBAC**: Middleware-enforced role checks for all Admin endpoints.
