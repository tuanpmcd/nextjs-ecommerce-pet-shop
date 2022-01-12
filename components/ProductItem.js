import Link from "next/link";
import { useContext } from "react";
import { DataContext } from "../store/GlobalState";
import { addToCart } from "../store/Actions";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ProductItem = ({ product, handleCheck }) => {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;
  const router = useRouter()

  const handleBuy = () => {
    dispatch(addToCart(product, cart))
    if (product.inStock === 0) return toast.info("This product is out of stock")
    return router.push("/cart");
  }

  const userLink = () => {
    return (
      <>
        <Link href={`/product/${product._id}`}>
          <a className="btn btn-outline-dark btn-sm" style={{ marginRight: "5px", flex: 1 }}>
            View
          </a>
        </Link>
        <button
          className="btn btn-outline-info btn-sm"
          style={{ marginLeft: "5px", flex: 1 }}
          onClick={handleBuy}
        >
          Buy
        </button>
      </>
    );
  };

  const adminLink = () => {
    return (
      <>
        <Link href={`create/${product._id}`}>
          <a className="btn btn-outline-info btn-sm" style={{ marginRight: "5px", flex: 1 }}>
            Edit
          </a>
        </Link>

        <button
          className="btn btn-outline-danger btn-sm"
          style={{ marginLeft: "5px", flex: 1 }}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() =>
            dispatch({
              type: "ADD_MODAL",
              payload: [
                {
                  data: "",
                  id: product._id,
                  title: product.title,
                  type: "DELETE_PRODUCT",
                },
              ],
            })
          }
        >
          Delete
        </button>
      </>
    );
  };

  return (
    <div className="card mx-1 mb-1 p-3 bg-light">
      {auth.user && auth.user.role === "admin" && (
        <input
          type="checkbox"
          checked={product.checked}
          className="position-absolute"
          style={{ height: "20px", width: "20px" }}
          onChange={() => handleCheck(product._id)}
        />
      )}

      <img
        className="card-img-top p-2"
        src={product.images[0].url}
        alt=""
      />
      <div className="card-body">
        <p className="card-title text-capitalize  fs-6" title={product.title}>
          {product.title}
        </p>

        <div className="row justify-content-between mx-0">
          <h6 className="text-danger px-0">${product.price}</h6>
          {product.inStock > 0 ? (
            <h6 className="text-danger px-0">In Stock: {product.inStock}</h6>
          ) : (
            <h6 className="text-danger px-0">Out Stock</h6>
          )}
        </div>

        <p className="card-text" style={{ fontSize: "13px" }} title={product.description}>
          {product.description}
        </p>

        <div className="row justify-content-between mx-0 my-2">
          {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
