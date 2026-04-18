export default function DashboardHome() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Dashboard</h1>
      <p style={styles.text}>Manage products, inventory, and analytics.</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    background: "#fff"
  },
  title: {
    color: "#000",
    fontSize: "32px",
    marginBottom: "10px"
  },
  text: {
    color: "#000",
    fontSize: "16px"
  }
};