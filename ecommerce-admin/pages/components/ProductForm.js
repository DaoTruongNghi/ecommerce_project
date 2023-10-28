import axios from "axios";
import Layout from "../components/Layout";
import { useState } from "react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}) {
  // State
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);

  // Routrer
  const router = useRouter();

  // Handler createProduct data
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };
    if (_id) {
      // update product
      await axios.put("/api/products", { ...data, _id });
    } else {
      // create product
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) router.push("/products");

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="products name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <label>Description</label>
      <textarea
        type="text"
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />

      <label>Price</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />

      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
