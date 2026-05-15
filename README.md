# 🅿️ ParkX — Smart Parking Management System

A web-based parking facility management system that lets facility owners manage their parking spaces, track vehicles in real-time, calculate fees automatically, and analyze revenue and usage through an analytics dashboard.

---

## ✨ Features

### For Facility Owners
- Set up and configure your parking facility (total slots, vehicle types, pricing)
- Visual slot grid — see which slots are occupied or free at a glance
- Add vehicles on entry with vehicle number, type, driver name, and slot selection
- Process vehicle exits with automatic fee calculation based on duration
- View full parking history with entry/exit times, duration, and fees
- Facility analytics dashboard with revenue and usage insights

### For Admins
- Platform-wide overview: total facilities, vehicles, active vehicles, revenue, and users
- Manage all facilities across the platform
- View complete vehicle history across all facilities
- Manage users

### General
- Real-time slot updates using Firebase Firestore listeners
- Duplicate vehicle check (prevents the same vehicle from being parked twice)
- Peak hours analysis via entry time charts
- Secure protected routes — only authenticated users can access the app

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Firebase Firestore | Real-time database |
| Firebase Auth | User authentication |
| Recharts | Analytics charts |
| React Toastify | Notifications |
| Vite | Build tool |
| CSS Modules | Custom styling per page |

---

## 📁 Project Structure

```
ParkX/
└── src/
    ├── components/
    │   ├── ConfirmModal.jsx        # Exit confirmation dialog
    │   ├── EntryTimeChart.jsx      # Peak hours bar chart
    │   ├── FacilityAnalytics.jsx   # Revenue & usage dashboard
    │   ├── FacilityEditForm.jsx    # Edit facility settings
    │   ├── FacilitySetupForm.jsx   # First-time facility setup
    │   ├── Navbar.jsx              # Navigation bar
    │   ├── ProtectedRoute.jsx      # Auth guard
    │   └── SlotGrid.jsx            # Visual parking slot selector
    │
    ├── context/
    │   ├── AuthContext.js          # Auth state context
    │   ├── AuthProvider.jsx        # Firebase auth provider
    │   ├── useAdmin.js             # Admin role hook
    │   └── useFacility.js         # Facility data hook
    │
    ├── firebase/
    │   └── firebaseConfig.js       # Firebase initialization
    │
    ├── pages/
    │   ├── Home.jsx                # Landing page with live stats
    │   ├── Login.jsx               # Sign in
    │   ├── Signup.jsx              # Register
    │   ├── Dashboard.jsx           # Facility owner dashboard
    │   ├── AddVehicle.jsx          # Park a vehicle
    │   ├── ExitVehicle.jsx         # Process vehicle exit & fee
    │   ├── History.jsx             # Owner's parking history
    │   ├── Admin.jsx               # Admin overview
    │   ├── AdminFacilities.jsx     # Admin — all facilities
    │   └── AdminHistory.jsx        # Admin — full vehicle history
    │
    └── styles/                     # Per-page CSS files
```

---

## 💰 Fee Calculation

Fees are calculated automatically on vehicle exit:

```
Fee = First Hour Rate + (Extra Hours × Rate Per Extra Hour)
Duration is rounded up to the nearest hour.
```

Rates are configured per facility by the owner during setup.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Firebase project with Firestore and Authentication enabled

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ParkX.git
cd ParkX
```

### 2. Set up environment variables

Create a `.env` file in the root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run the development server
```bash
npm run dev
```

App runs on `http://localhost:5173`

### 5. Set up admin access
```bash
node scripts/initAdmin.js
```

---

## 🔐 User Roles

| Role | Access |
|---|---|
| `owner` | Manage their own facility, add/exit vehicles, view history |
| `admin` | Full platform access — all facilities, vehicles, users |

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
