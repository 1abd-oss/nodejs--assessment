"use client";

import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{
        width: 220,
        background: "#111",
        color: "white",
        padding: 20
      }}>
        <h2>Dashboard</h2>

        <nav style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href="/dashboard/products">📦 Products</Link>
          <Link href="/dashboard/add-product">➕ Add Product</Link>
          <Link href="/dashboard/inventory">📊 Inventory</Link>
        </nav>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 20, background: "#f5f5f5" }}>
        {children}
      </div>

    </div>
  );
}