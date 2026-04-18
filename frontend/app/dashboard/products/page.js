"use client";

import { useEffect, useState } from "react";
import { getProducts, deleteProduct, updateProduct } from "@/lib/api";
import { useRouter } from "next/navigation";
export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 20;

  /* ================= FILTERS ================= */
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState("");

  /* ================= SORT ================= */
  const [sort, setSort] = useState("productid");
  const [order, setOrder] = useState("ASC");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const token = document.cookie.includes("token");

    if (!token) {
      router.push("/login");
    }
  }, []);

  /* ================= LOAD ================= */
  const load = async () => {
    const query = `?page=${page}&limit=${limit}&name=${name}&price=${price}&cost=${cost}&quantity=${quantity}&sort=${sort}&order=${order}`;

    try {
      const res = await getProducts(query);

      console.log("API RESPONSE:", res);

      const data = Array.isArray(res?.data) ? res.data : [];
      setProducts(data);

      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    load();
  }, [page, name, price, cost, quantity, sort, order]);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete product?")) return;
    await deleteProduct(id);
    load();
  };

  /* ================= EDIT ================= */
  const handleEdit = (p) => {
    setEditingId(p.productid);
    setEditForm(p);
  };

  const handleSave = async (id) => {
    await updateProduct(id, editForm);
    setEditingId(null);
    load();
  };

  const clearFilters = () => {
    setName("");
    setPrice("");
    setCost("");
    setQuantity("");
    setPage(1);
  };

  /* ================= PROFIT CALC ================= */
  const calcProfit = (price, cost) => {
    const p = Number(price);
    const c = Number(cost);
    if (!c) return 0;
    return (((p - c) / c) * 100).toFixed(2);
  };

  return (
    <div style={styles.page}>

      {/* ================= TOP BAR ================= */}
      <div style={styles.topBar}>

        {/* SORT */}
        <div style={styles.group}>
          <select
            style={styles.select}
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="productid">ID</option>
            <option value="price">Price</option>
            <option value="cost">Cost</option>
            <option value="quantity">Quantity</option>
            <option value="name">Name</option>
            <option value="profit">Profit</option>
          </select>

          <select
            style={styles.select}
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(1);
            }}
          >
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>
        </div>

        {/* FILTERS */}
        <div style={styles.group}>
          <input
            style={styles.input}
            placeholder="Search name..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setPage(1);
            }}
          />

          <input
            style={styles.input}
            placeholder="Price"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setPage(1);
            }}
          />

          <input
            style={styles.input}
            placeholder="Cost"
            value={cost}
            onChange={(e) => {
              setCost(e.target.value);
              setPage(1);
            }}
          />

          <input
            style={styles.input}
            placeholder="Qty"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setPage(1);
            }}
          />

          <button style={styles.clearBtn} onClick={clearFilters}>
            Clear
          </button>
        </div>

        {/* PAGINATION */}
        <div style={styles.pagination}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))}>◀</button>
          <span>{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>▶</button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Cost</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Profit %</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.productid}>

              {/* NAME */}
              <td>
                {editingId === p.productid ? (
                  <input
                    value={editForm.name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                ) : (
                  p.name
                )}
              </td>

              {/* DESCRIPTION */}
              <td>
                {editingId === p.productid ? (
                  <input
                    value={editForm.description || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                ) : (
                  p.description
                )}
              </td>

              {/* COST (EDITABLE) */}
              <td>
                {editingId === p.productid ? (
                  <input
                    type="number"
                    value={editForm.cost || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, cost: e.target.value })
                    }
                  />
                ) : (
                  p.cost
                )}
              </td>

              {/* PRICE (EDITABLE) */}
              <td>
                {editingId === p.productid ? (
                  <input
                    type="number"
                    value={editForm.price || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                  />
                ) : (
                  p.price
                )}
              </td>

              {/* QUANTITY (EDITABLE) */}
              <td>
                {editingId === p.productid ? (
                  <input
                    type="number"
                    value={editForm.quantity || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, quantity: e.target.value })
                    }
                  />
                ) : (
                  p.quantity
                )}
              </td>

              {/* PROFIT AUTO CALCULATED */}
              <td>
                {editingId === p.productid
                  ? calcProfit(editForm.price, editForm.cost)
                  : calcProfit(p.price, p.cost)}
                %
              </td>

              {/* ACTIONS */}
              <td style={{ display: "flex", gap: 10 }}>
                {editingId === p.productid ? (
                  <>
                    <button onClick={() => handleSave(p.productid)}>💾</button>
                    <button onClick={() => setEditingId(null)}>❌</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(p)}>✏</button>
                    <button onClick={() => handleDelete(p.productid)}>🗑</button>
                  </>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  page: {
    background: "#0a0a0a",
    minHeight: "100vh",
    color: "white",
    padding: 20
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
    flexWrap: "wrap"
  },
  group: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap"
  },
  input: {
    padding: 8,
    background: "#111",
    border: "1px solid #333",
    color: "white"
  },
  select: {
    padding: 8,
    background: "#111",
    color: "white",
    border: "1px solid #333"
  },
  clearBtn: {
    background: "#222",
    color: "white",
    border: "1px solid #444",
    padding: "8px 12px"
  },
  pagination: {
    display: "flex",
    gap: 10,
    alignItems: "center"
  },
  table: {
    width: "100%",
    background: "#111",
    borderCollapse: "collapse",
    textAlign: "center"
  }
};