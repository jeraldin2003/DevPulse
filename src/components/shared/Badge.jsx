export default function Badge({ children, color }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.2rem 0.625rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 500,
        background: `${color}22`,
        color: color,
        lineHeight: 1.4,
      }}
    >
      {children}
    </span>
  );
}
