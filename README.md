# 🚀 DevPulse

DevPulse is a React-powered analytics dashboard that aggregates data from multiple public APIs and transforms it into meaningful insights through modular data-processing pipelines.

The application fetches users, posts, todos, trivia questions, and country information, then presents the results through an interactive dashboard with charts, statistics, and detailed analysis panels.

---

## ✨ Features

### 📊 Overview Dashboard
- Unified dashboard experience
- Real-time data loading metrics
- Refresh dashboard data on demand
- Graceful error handling for failed API requests

### 👥 User Analytics
- Total user count
- Company distribution insights
- User statistics aggregation

### 📝 Post Analysis
- Total posts count
- Top 5 users by post activity
- User contribution breakdown

### ✅ Productivity Tracking
- Todo completion statistics
- Per-user productivity metrics
- Completion percentage calculations

### 🎯 Trivia Insights
- Trivia question analysis
- Difficulty distribution (Easy / Medium / Hard)
- Categorized trivia data

### 🌍 Country Statistics
- Total countries available
- Top 10 countries by population
- Population-based rankings

---

## 🏗️ Architecture

DevPulse follows a modular architecture that separates:

1. **API Layer** → Fetches raw data
2. **Business Logic Layer** → Processes and transforms data
3. **UI Components** → Displays insights

```text
src/
│
├── api/
│   ├── fetchUsers.js
│   ├── fetchPosts.js
│   ├── fetchTodos.js
│   ├── fetchTrivia.js
│   └── fetchCountries.js
│
├── modules/
│   ├── userStats.js
│   ├── postAnalysis.js
│   ├── productivityTracker.js
│   ├── triviaScorer.js
│   └── countryLookup.js
│
├── components/
│   ├── panels/
│   ├── shared/
│   ├── DashboardData.js
│   └── DevPulseDashboard.jsx
│
└── App.jsx
```

---

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite

### Visualization
- Recharts

### UI
- Lucide React Icons

### Tooling
- ESLint

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/jeraldin2003/DevPulse.git
cd DevPulse
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🔄 Data Flow

The dashboard loads data concurrently using:

```javascript
Promise.allSettled()
```

This ensures:

- Faster loading times
- Partial dashboard functionality when some APIs fail
- Independent error handling for each data source

### Sources Loaded

- Users
- Posts
- Todos
- Trivia Questions
- Countries

Each dataset is processed through dedicated analysis modules before being displayed.

---

## 🧠 Data Processing Modules

### User Statistics

Calculates:

- Total users
- Total unique companies

### Post Analysis

Calculates:

- Total posts
- Top 5 users by post count

### Productivity Tracker

Calculates:

- User todo completion rates
- Completed vs total tasks
- Productivity percentages

### Trivia Scorer

Calculates:

- Difficulty distribution
- Question metadata extraction

### Country Lookup

Calculates:

- Total countries
- Top 10 countries by population

---

## ⚡ Error Handling

DevPulse uses resilient loading strategies:

- Failed API requests do not crash the application
- Errors are displayed in a dashboard banner
- Successfully loaded modules remain functional
- Users can retry loading with the Refresh button

---

## 🎨 Dashboard Sections

| Section | Purpose |
|----------|----------|
| Overview | Summary metrics |
| Users | User analytics |
| Posts | Post statistics |
| Productivity | Todo completion analysis |
| Trivia | Trivia insights |
| Countries | Population and country data |

---

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Jeraldin**

GitHub: https://github.com/jeraldin2003

---
