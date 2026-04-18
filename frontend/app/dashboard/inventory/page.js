"use client";

import { useEffect, useState } from "react";
import { getInventoryHistory } from "@/lib/api";
import { useRouter, useParams } from "next/navigation";

export default function InventoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();

  // ✅ FIX 1: ensure id is string-safe
  const productId = params?.id ? String(params.id) : null;

useEffect(() => {
  const load = async () => {
    try {
      setLoading(true);

      const res = await getInventoryHistory(); // ✅ FIX

      const data = res?.data || [];

      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Inventory error:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Inventory History</h1>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Product Id</th>
              <th>Date</th>
              <th>Change</th>
              <th>Source</th>
              <th>Old Qty</th>
              <th>New Qty</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={styles.empty}>
                  Loading...
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.empty}>
                  No inventory history found
                </td>
              </tr>
            ) : (
              history.map((h) => (
                <tr key={h.id}>
                  <td style={styles.cell}>{h.id}</td>
                  <td style={styles.cell}>{h.product_id}</td>
                  <td style={styles.cell}>
                    {new Date(h.timestamp).toLocaleString()} {/* ✅ FIX 4: readable date */}
                  </td>

                  <td
                    style={{
                      ...styles.cell,
                      color: h.quantity_change > 0 ? "#00ff99" : "#ff4d4d",
                      fontWeight: "bold",
                    }}
                  >
                    {h.quantity_change}
                  </td>

                  <td style={styles.cell}>
                    <span style={styles.badge}>{h.source}</span>
                  </td>

                  <td style={styles.cell}>{h.old_quantity}</td>
                  <td style={styles.cell}>{h.new_quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    background: "#0a0a0a",
    minHeight: "100vh",
    color: "white",
    padding: 30,
    fontFamily: "Arial",
  },

  title: {
    fontSize: 26,
    marginBottom: 20,
    fontWeight: "bold",
  },

  card: {
    background: "#111",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #222",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
  },

  cell: {
    padding: "14px 10px",
    borderBottom: "1px solid #222",
    textAlign: "center",
    fontSize: 14,
  },

  empty: {
    padding: 20,
    color: "#888",
    textAlign: "center",
  },

  badge: {
    background: "#222",
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 12,
  },
};