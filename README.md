# ☀️ Weather React App

A modern, responsive single‑page application built with **React** that provides real‑time weather information for any city worldwide.  
The app uses a **Django backend middleware** to fetch data from the **Open‑Meteo API** and serve it to the React frontend.

---

## 🔗 Live Sites

- **Frontend (React on Vercel):** [View Live Site](https://weather-frontend-sigma-ten.vercel.app/)  
- **Backend (Django on Render):** [Weather Backend](https://weather-backend-ugpk.onrender.com/)

---

## ✨ Features

- **City Search**: Search weather data by typing the name of any city.
- **Current Conditions**: Displays temperature, humidity, and wind speed.
- **Weather Icons**: Visual representation of conditions (sun, clouds, rain).
- **Responsive Design**: Optimized for desktop and mobile.

---

## 🛠️ Tech Stack

| Category              | Technology        | Description                                                                 |
| --------------------- | ----------------- | --------------------------------------------------------------------------- |
| **Frontend Framework** | **React**         | Functional components + Hooks (`useState`, `useEffect`).                     |
| **Styling**           | **CSS**           | Clean and efficient styling.                                                |
| **Backend**           | **Django**        | Middleware layer to fetch and serve weather data.                           |
| **API**               | **Open‑Meteo API**| Free weather API providing forecast and current conditions.                  |
| **Deployment**        | **Vercel + Render** | Frontend hosted on Vercel, backend hosted on Render.                        |

---

## ⚙️ Local Setup

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- Python 3.10+
- pip / virtualenv

---

### 🔧 Frontend Setup (React)

1. Clone the repository:

   ```bash
   git clone https://github.com/dhanyasri612/weather-frontend.git
   cd weather-frontend
   
2. Install dependencies:
   
    ```bash
   npm install
   # or
   yarn install

3. Run the development server:

    ```bash
    npm run dev
    # or
    yarn run dev

4. Open in browser: http://localhost:5173
   

# 🔧 Backend Setup (Django)

1. Clone the backend repository:

   ```bash
   git clone https://github.com/dhanyasri612/weather-backend.git
   cd weather-backend

2. Create virtual environment & install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate   # Linux/Mac
   venv\Scripts\activate      # Windows

   pip install -r requirements.txt

3. Run Django server:
   ```bash
   python manage.py runserver
   
5. API will be available at:
   ```bash
   http://127.0.0.1:8000/weather/?city=London


   
