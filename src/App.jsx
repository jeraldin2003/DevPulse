import LoadingSpinner from "./components/shared/LoadingSpinner.jsx";

export default function App() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>DevPulse Dashboard</h1>
      </header>

      <main className="dashboard-body">
        <LoadingSpinner />
      </main>

      <footer className="dashboard-footer">
        <span>DevPulse</span>
      </footer>
    </div>
  );
}
