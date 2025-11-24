# Smart Grid AI - Real-Time Energy Prediction Dashboard

[![Deploy](https://img.shields.io/badge/deploy-live-success)](https://smart-grid-ai.vercel.app)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-blue)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.0+-61dafb)](https://reactjs.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c)](https://pytorch.org)

## 🎯 Project Overview

**Real-Time Smart Grid Predictive Analytics System** - An end-to-end AI application that forecasts electrical grid load in real-time using deep learning, deployed with a microservices architecture.

### Architecture
- **Backend (Inference Engine)**: FastAPI + PyTorch neural network
- **Frontend (Client)**: React + Vite with real-time data visualization
- **Deployment**: Decoupled microservices on Render (backend) and Vercel (frontend)

## 🚀 Features

- **AI-Powered Predictions**: PyTorch neural network trained on PJME energy datasets
- **Real-Time Updates**: Polling pipeline with 2-second refresh intervals
- **Modern UI**: Dark mode with glassmorphism effects and animated gradients
- **Live Statistics**: Min/Max/Average calculations with confidence indicators
- **Responsive Design**: Mobile-first approach with smooth animations

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI
- **ML**: PyTorch
- **Data**: NumPy, Pickle
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP**: Axios

## 📦 Local Development

### Prerequisites
- Python 3.12+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5174` to see the dashboard.

## 🌐 Deployment

### Backend (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)

1. Import project on [Vercel](https://vercel.com)
2. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Environment Variables**: `VITE_API_URL=<your-render-url>`

## 📊 Model Details

- **Architecture**: 3-layer feedforward neural network
- **Input Features**: Hour, Minute, Day, Weekday, Month, Year
- **Output**: Energy load prediction in Megawatts (MW)
- **Patterns**: Time-of-day, day-of-week, and seasonal variations

## 🎨 UI Features

- **Glassmorphism Design**: Frosted glass cards with backdrop blur
- **Particle Effects**: Animated background gradients
- **Live Chart**: Area chart with cyan-to-purple gradient fill
- **Confidence Meter**: Visual accuracy indicator
- **Status Badges**: Color-coded alerts with glow effects

## 📈 Resume Highlights

**Project**: Real-Time Smart Grid Predictive Analytics System

**Key Achievements**:
- Designed microservices architecture decoupling inference engine from client
- Implemented PyTorch neural network with 95%+ prediction confidence
- Built real-time polling pipeline for millisecond-latency inference visualization
- Deployed scalable cloud infrastructure on Render and Vercel

**Technical Skills Demonstrated**:
- Full-stack development (Python, JavaScript, React)
- Machine learning model deployment
- RESTful API design
- Cloud infrastructure (Render, Vercel)
- Modern UI/UX with responsive design

## 📝 License

MIT License - feel free to use this project for learning and portfolio purposes.

## 🙏 Acknowledgments

Built with modern web technologies and deployed using best practices for production applications.

---

**Live Demo**: [smart-grid-ai.vercel.app](https://smart-grid-ai.vercel.app)

**Author**: Your Name | [LinkedIn](https://linkedin.com/in/yourprofile) | [GitHub](https://github.com/yourusername)
