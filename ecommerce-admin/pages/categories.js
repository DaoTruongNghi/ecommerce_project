import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import axios from "axios";

export default function Categories() {
  const [name, setName] = useState("");
  const [parentCategories, setParentCategories] = useState("");
  const [categories, setCategories] = useState([]);
  const [editedCategories, setEditedCategories] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => setCategories(result.data));
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = { name, parentCategories };
    if (editedCategories) {
      data._id = editedCategories._id;
      await axios.put("/api/categories", data);
      setEditedCategories(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    fetchCategories();
  }

  function editCategory(categories) {
    setEditedCategories(categories);
    setName(categories.name);
    setParentCategories(categories.parent?._id);
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategories
          ? `Edit category ${editedCategories.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          placeholder={"Category name"}
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <select
          className="mb-0"
          value={parentCategories}
          onChange={(ev) => setParentCategories(ev.target.value)}
        >
          <option value="">No parent category</option>
          {categories?.length > 0 &&
            categories.map((category) => (
              <option value={category._id}>{category.name}</option>
            ))}
        </select>

        <button type={"submit"} className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent categories</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories?.length > 0 &&
            categories.map((category) => (
              <tr>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn-primary "
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button className="btn-primary ">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
