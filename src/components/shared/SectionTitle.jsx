export default function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: "1.125rem",
        fontWeight: 600,
        color: "#1a1d26",
        paddingBottom: "0.5rem",
        marginBottom: "1rem",
        borderBottom: "2px solid #dde1e8",
      }}
    >
      {children}
    </h2>
  );
}
