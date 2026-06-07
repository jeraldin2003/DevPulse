import { AlertCircle } from "lucide-react";

export default function ErrorCard({ message }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "1.25rem",
        background: "#fdecea",
        border: "1px solid #f5a8a0",
        borderRadius: "8px",
        color: "#b42318",
      }}
    >
      <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
      <div>
        <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
          Data unavailable
        </p>
        <p style={{ fontSize: "0.875rem" }}>{message}</p>
      </div>
    </div>
  );
}
