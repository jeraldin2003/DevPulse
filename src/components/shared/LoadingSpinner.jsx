export default function LoadingSpinner({ message = "Loading dashboard..." }) {
  return (
    <div className="loading-container">
      <div className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
