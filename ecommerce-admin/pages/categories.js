import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [parentCategories, setParentCategories] = useState("");
  const [categories, setCategories] = useState([]);
  const [editedCategories, setEditedCategories] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => setCategories(result.data));
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    if (parentCategories === "no-parent-category") {
      categories.parent = null;
    } else {
      categories.parent = parentCategories;
    }

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

  function deleteCategories(categories) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${categories.name}`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
        didOpen: () => {
          // run when swal is opened...
        },
        didClose: () => {
          // run when swal is closed...
        },
      })
      .then(async (result) => {
        // when confirmed and promise resolved...
        if (result.isConfirmed) {
          const { _id } = categories;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      })
      .catch((error) => {
        // when promise rejected...
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", value: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValueChange(index, property, newValue) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].value = newValue;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategories
          ? `Edit category ${editedCategories.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            placeholder={"Category name"}
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <select
            value={parentCategories}
            onChange={(ev) =>
              ev.target.value === "no-parent-category"
                ? setParentCategories(null)
                : setParentCategories(ev.target.value)
            }
          >
            <option value="no-parent-category">No parent category</option>
            {categories?.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type={"button"}
            className="btn-default text-sm mb-2"
            onClick={addProperty}
          >
            Add new properties
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2">
                <input
                  className="mb-0"
                  type="text"
                  placeholder="property name (example: color)"
                  value={property.name}
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                ></input>
                <input
                  className="mb-0"
                  type="text"
                  placeholder="Values, comma separated"
                  value={property.value}
                  onChange={(ev) =>
                    handlePropertyValueChange(index, property, ev.target.value)
                  }
                ></input>
                <button
                  className="btn-default"
                  onClick={() => removeProperty(index)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
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
                    <button
                      className="btn-primary"
                      onClick={() => deleteCategories(category)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
