import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [products, setProducts] = useState([]);

  // Fetch 100 products from API
  const fetchProducts = async () => {
  const res = await fetch("http://localhost:8082/api/products"); // Laravel backend
  const data = await res.json();

  const processed = data.map((p) => ({
    id: p.id,
    name: p.name,
    inventory: p.inventory,
    avgSales: p.avg_sales,
    leadTime: p.lead_time,
    status: null,
  }));

  setProducts(processed);
};


  // Run prediction for each product
  const runPrediction = () => {
    const updated = products.map((p) => {
      let status = "";
      const threshold = p.avgSales * p.leadTime;

      if (p.inventory < threshold * 0.5) status = "Reorder"; // low stock
      else if (p.inventory < threshold) status = "Monitor";  // watch closely
      else status = "In Stock";                               // sufficient stock

      return { ...p, status };
    });

    setProducts(updated);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container">
      <h2>Inventory Forecast Dashboard</h2>

      <button className="predict-btn" onClick={runPrediction}>
        Run Prediction
      </button>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Inventory</th>
            <th>Avg Sales/week</th>
            <th>Lead Time (days)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td data-label="Product">{p.name}</td>
              <td data-label="Inventory">{p.inventory}</td>
              <td data-label="Avg Sales/week">{p.avgSales}</td>
              <td data-label="Lead Time (days)">{p.leadTime}</td>
              <td
                data-label="Status"
                className={
                  p.status === "Reorder"
                    ? "reorder"
                    : p.status === "Monitor"
                    ? "monitor"
                    : "in-stock"
                }
              >
                {p.status || "---"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
