import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../../store/GlobalState";
import { imageUpload } from "../../utils/imageUpload";
import { postData, getData, putData } from "../../utils/fetchData";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ProductsManager = () => {
  const initialState = {
    title: "",
    price: 0,
    inStock: 0,
    description: "",
    content: "",
    category: "",
  };
  const [product, setProduct] = useState(initialState);
  const { title, price, inStock, description, content, category } = product;

  const [images, setImages] = useState([]);

  const { state, dispatch } = useContext(DataContext);
  const { categories, auth } = state;

  const router = useRouter();
  const { id } = router.query;
  const [onEdit, setOnEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setOnEdit(true);
      getData(`product/${id}`).then((res) => {
        setProduct(res.product);
        setImages(res.product.images);
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages([]);
    }
  }, [id]);

  const handleChangeInput = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleUploadInput = (e) => {
    let newImages = [];
    let num = 0;
    let err = "";
    const files = [...e.target.files];

    if (files.length === 0) return toast.info("Files does not exist")

    files.forEach((file) => {
      if (file.size > 1024 * 1024) return (err = "The largest image size is 1MB");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return (err = "Image format is incorrect");

      num += 1;

      if (num <= 5) newImages.push(file);
      return newImages;
    });

    if (err) toast.error(err)

    const imgCount = images.length;
    if (imgCount + newImages.length > 5) return toast.info("Up to 5 images")
    setImages([...images, ...newImages]);
  };

  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.user.role !== "admin") return toast.error("Authentication is not valid")

    if (
      !title ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      category === "all" ||
      images.length === 0
    )
      return toast.error("Please add all the fields")

    dispatch({ type: "NOTIFY", payload: { loading: true } });

    let media = [];
    const imgNewURL = images.filter((img) => !img.url);
    const imgOldURL = images.filter((img) => img.url);

    if (imgNewURL.length > 0) media = await imageUpload(imgNewURL);

    let res;
    if (onEdit) {
      res = await putData(
        `product/${id}`,
        { ...product, images: [...imgOldURL, ...media] },
        auth.token
      );
      if (res.err) return toast.error(res.err)
    } else {
      res = await postData(
        "product",
        { ...product, images: [...imgOldURL, ...media] },
        auth.token
      );
      if (res.err) return toast.error(res.err)
    }
    dispatch({ type: "NOTIFY", payload: { loading: false } });
    return toast.success(res.msg)
  };

  return (
    <div className="container products_manager">
      <Head>
        <title>Products Manager</title>
      </Head>
      <form className="row" onSubmit={handleSubmit}>

        <div className="col-md-6 mb-4">
          <div className="input-group">
            <input
              id="inputGroupFile02"
              type="file"
              className="form-control"
              onChange={handleUploadInput}
              multiple
              accept="image/*"
            />
            <button
              type="button"
              className="btn btn-info"
              htmlFor="inputGroupFile02"
            >
              Upload
            </button>
          </div>

          <div className="row img-up">
            {images.map((img, index) => (
              <div key={index} className="file_img my-2">
                <img
                  src={img.url ? img.url : URL.createObjectURL(img)}
                  alt=""
                  className="img-thumbnail rounded"
                />
                <span onClick={() => deleteImage(index)}>X</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <input
            type="text"
            name="title"
            value={title}
            placeholder="Title"
            className="form-control mb-3"
            onChange={handleChangeInput}
          />

          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <label className="form-label" htmlFor="price">Price</label>
              <input
                type="number"
                name="price"
                value={price}
                placeholder="Price"
                className="form-control"
                onChange={handleChangeInput}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label" htmlFor="price">In Stock</label>
              <input
                type="number"
                name="inStock"
                value={inStock}
                placeholder="inStock"
                className="form-control"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <textarea
            name="description"
            id="description"
            cols="30"
            rows="4"
            placeholder="Description"
            onChange={handleChangeInput}
            className="form-control mb-3"
            value={description}
          />

          <textarea
            name="content"
            id="content"
            cols="30"
            rows="4"
            placeholder="Content"
            onChange={handleChangeInput}
            className="form-control mb-3"
            value={content}
          />

          <select
            name="category"
            id="category"
            value={category}
            onChange={handleChangeInput}
            className="form-select mb-3"
          >
            <option value="all">All Products</option>
            {categories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>

          <button type="submit" className="btn btn-info w-100">
            {onEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductsManager;
