import axios from "axios";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  // Props
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  // State
  const [title, setTitle] = useState(existingTitle || "");
  const [images, setImages] = useState(existingImages || []);
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Routrer
  const router = useRouter();

  // useEffect
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  // Handler createProduct data
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
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

  // Handle images react-sortalbejs
  function updateImagesOrder(images) {
    setImages(images);
  }

  // Handler upload Images
  async function uploadImages(ev) {
    // FileList is repersent for list files have already upload from a form
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      // const res = await axios.post("/api/upload", data, {
      //   headers: { "Content-Type": "multipart/-form-data" },
      // });
      console.log(data);
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  // Handle categories&properties in select fearture
  const propertiesToFill = [];
  // 1. Handler Properties and push it in propertiesToFill array
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    // 2. Check it if these have parent properties, then push it in to
    // propertiesToFill array
    // while (catInfo?.parent?._id) {
    //   const parentCat = categories.find(
    //     ({ _id }) => _id === catInfo?.parent?._id
    //   );
    //   propertiesToFill.push(parentCat);
    // 2.1. Finally update catInfo to cursor in parentCat and
    // keep the loop start begin until catInfo?.parent?._id doesn't exits,
    // that mean no Parent Category or may be Parent Category don't have any _id
    //   catInfo = parentCat;
    // }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="products name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Categories</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories?.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                <option value="">No Select</option>
                {p.value && p.value.map((v) => <option value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {/* Create a image upload and handle moving image in after */}
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="" className="rounded-lg"></img>
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label
          className="w-24 h-24 flex flex-col justify-center 
          items-center rounded-lg text-sm text-primary gap-1
          bg-white cursor-pointer shadow-sm border border-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
            />
          </svg>
          <div>Add image</div>
          <input type="file" onChange={uploadImages} className="hidden"></input>
        </label>
      </div>

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
      <button
        type="button"
        className="text-white px-4 py-1 inline-flex mx-1 items-center gap-1 bg-gray-700"
        onClick={() => setGoToProducts(true)}
      >
        Cancel
      </button>
    </form>
  );
}
