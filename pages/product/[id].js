import Head from "next/head";
import { useState, useContext } from "react";
import { getData } from "../../utils/fetchData";
import { DataContext } from "../../store/GlobalState";
import { addToCart } from "../../store/Actions";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const DetailProduct = (props) => {
  const [product] = useState(props.product);
  const [tab, setTab] = useState(0);

  const { state, dispatch } = useContext(DataContext);
  const { cart } = state;

  const router = useRouter()

  const handleBuy = () => {
    dispatch(addToCart(product, cart))
    if(product.inStock === 0) return toast.info("This product is out of stock")
    return router.push("/cart");
  }

  const isActive = (index) => {
    if (tab === index) return " active";
    return "";
  };

  return (
    <div className="row container px-0 m-auto detail_page">
      <Head>
        <title>Detail Product</title>
      </Head>

      <div className="col-md-6 py-3">
        <img
          src={product.images[tab].url}
          alt=""
          className="detail_page_img d-block img-thumbnail rounded w-100"
        />

        <div className="row mx-0" style={{ cursor: "pointer" }}>
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt=""
              className={`img-thumbnail rounded ${isActive(index)}`}
              style={{ height: "80px", width: "20%" }}
              onClick={() => setTab(index)}
            />
          ))}
        </div>
      </div>

      <div className="col-md-6 mt-3">
        <h3 className="text-uppercase">{product.title}</h3>
        <h5 className="text-danger">${product.price}</h5>

        <div className="row mx-0 d-flex justify-content-between">
          {product.inStock > 0 ? (
            <h6 className="text-danger px-0">In Stock: {product.inStock}</h6>
          ) : (
            <h6 className="text-danger px-0">Out Stock</h6>
          )}

          <h6 className="text-danger px-0">Sold: {product.sold}</h6>
        </div>

        <div className="my-2">{product.description}</div>
        <div className="my-2">{product.content}</div>

        <button
          type="button"
          className="btn btn-info my-3"
          onClick={handleBuy}
        >
          + Add to cart
        </button>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params: { id } }) {
  const res = await getData(`product/${id}`);
  // server side rendering
  return {
    props: { product: res.product }, // will be passed to the page component as props
  };
}

export default DetailProduct;
