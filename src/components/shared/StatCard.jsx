export default function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.875rem",
        padding: "1rem 1.125rem",
        background: "#ffffff",
        borderRadius: "8px",
        borderLeft: `4px solid ${color}`,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: `${color}22`,
          flexShrink: 0,
        }}
      >
        <Icon size={22} color={color} />
      </div>

      <div>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "#5c6370",
            marginBottom: "0.25rem",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#1a1d26",
          }}
        >
          {value}
        </p>
        {sub && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "#5c6370",
              marginTop: "0.25rem",
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
