import axios from "axios";
import Spinner from "./Spinner";
import { useState } from "react";
import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
}) {
  // State
  const [title, setTitle] = useState(existingTitle || "");
  const [images, setImages] = useState(existingImages || []);
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Routrer
  const router = useRouter();

  // Handler createProduct data
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price, images };
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

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="products name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
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
              <div key={link} className="h-24">
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
          items-center rounded-lg text-sm text-gray-600 gap-1
          bg-gray-200 cursor-pointer"
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
          <div>Upload</div>
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
    </form>
  );
}
