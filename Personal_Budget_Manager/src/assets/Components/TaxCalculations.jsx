import React, { useState } from "react";
import "../Styles/TaxCalculations.css";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBudget } from "./Contexts/BudgetContext";
import Navbar from "./Navbar";

const gstRates = {
  "Essential Goods (Food, Medicine)": 5,
  "Electronics": 18,
  "Clothing": 12,
  "Luxury Items": 28,
  "Services (Hotels, Restaurants)": 18,
};

const TaxCalculator = () => {
  const [form, setForm] = useState({ price: "", category: "", description: "" });
  const [taxType, setTaxType] = useState("GST");
  const { calculations, addTax, delTax } = useBudget();
  const user = JSON.parse(localStorage.getItem("user"));


  const getIncomeTaxRate = (income) => {
    if (income <= 1200000) return 0;
    if (income <= 1600000) return 15;
    if (income <= 2000000) return 20;
    if (income <= 2400000) return 25;
    return 30; 
  };

  const calculateTax = () => {
    if (!form.price) return;

    let taxRate = 0, taxAmount = 0, basePrice = parseFloat(form.price);

    if (taxType === "GST" && form.category) {
      taxRate = gstRates[form.category] || 0;
      basePrice = (basePrice * 100) / (100 + taxRate);
      taxAmount = parseFloat(form.price) - basePrice;
    } else if (taxType === "Income Tax") {
      taxRate = getIncomeTaxRate(basePrice);
      taxAmount = (basePrice * taxRate) / 100;
    }

    const newCalculation = {
      userId: user.id,
      category: taxType === "GST" ? form.category : "Income Tax",
      price: form.price,
      description: form.description,
      taxRate,
      taxAmount,
      basePrice: taxType === "GST" ? basePrice.toFixed(2) : form.price-taxAmount,
    };

    addTax(newCalculation);
    setForm({ price: "", category: "", description: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((old) => ({ ...old, [name]: value }));
  };

  return (
    <>
      <Navbar />
      <div className="gst-calculator-container">
        <div className="gst-calculator">
          <h2>Tax Calculator</h2>

          <label>Select Tax Type</label>
          <select value={taxType} onChange={(e) => setTaxType(e.target.value)}>
            <option value="GST">GST Tax</option>
            <option value="Income Tax">Income Tax</option>
          </select>


          <label>{taxType === "GST" ? "Product Price (₹)" : "Total Income (₹)"}</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder={taxType === "GST" ? "Enter price" : "Enter total income"}
          />


          {taxType === "GST" && (
            <>
              <label>Select Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="">-- Select --</option>
                {Object.keys(gstRates).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} ({gstRates[cat]}% GST)
                  </option>
                ))}
              </select>
            </>
          )}


          <label>Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter Description"
          />

          <button onClick={calculateTax}>Calculate Tax</button>
        </div>


        <div className="gst-table-container">
          <h3>Tax Calculations</h3>
          <div className="gst-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Price/Income (₹)</th>
                  <th>Description</th>
                  <th>Tax (%)</th>
                  <th>Base Price/TDI (₹)</th>
                  <th>Tax Amount (₹)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {calculations.map((calc, index) => (
                  <tr key={index}>
                    <td>{calc.category}</td>
                    <td>₹{calc.price}</td>
                    <td>{calc.description}</td>
                    <td>{calc.taxRate}%</td>
                    <td>₹{calc.basePrice}</td>
                    <td>₹{calc.taxAmount.toFixed(2)}</td>
                    <td>
                      <IconButton edge="end" color="error" onClick={() => delTax(calc._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
                {calculations.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>No tax calculations yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaxCalculator;
