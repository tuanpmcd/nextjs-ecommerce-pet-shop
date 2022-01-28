import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import CartItem from "../components/CartItem";
import Link from "next/link";
import { getData, postData } from "../utils/fetchData";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const Cart = () => {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth, orders } = state;
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [callback, setCallback] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(res);
    };

    getTotal();
  }, [cart]);

  useEffect(() => {// Compare instock in DB vs quantity in cart
    const cartLocal = JSON.parse(localStorage.getItem("cart"));
    if (cartLocal && cartLocal.length > 0) {
      let newArr = [];
      const updateCart = async () => {
        for (const item of cartLocal) {
          const res = await getData(`product/${item._id}`);
          const { _id, title, images, price, inStock, sold } = res.product;
          if (inStock > 0) {
            newArr.push({
              _id,
              title,
              images,
              price,
              inStock,
              sold,
              quantity: item.quantity > inStock ? 1 : item.quantity,
            });
          }
        }

        dispatch({ type: "ADD_CART", payload: newArr });
      };

      updateCart();
    }
  }, [callback]);

  const handlePayment = async () => {
    if (auth.user) {
      if (!address || !mobile) return toast.info("Please add your address and mobile")

      let newCart = [];
      for (const item of cart) {
        const res = await getData(`product/${item._id}`);
        if (res.product.inStock - item.quantity >= 0) {
          newCart.push(item);
        }
      }

      if (newCart.length < cart.length) {
        setCallback(!callback); //re-update instock in DB
        return toast.info("The product is out of stock or the quantity is insufficient")
      }

      dispatch({ type: "NOTIFY", payload: { loading: true } });

      postData("order", { address, mobile, cart, total }, auth.token).then(
        (res) => {
          if (res.err) return toast.info(res.err)
          dispatch({ type: "ADD_CART", payload: [] });
          const newOrder = {
            ...res.newOrder,
            user: auth.user,
          };
          dispatch({ type: "ADD_ORDERS", payload: [...orders, newOrder] });
          dispatch({ type: "NOTIFY", payload: { loading: false } });
          return router.push(`/order/${res.newOrder._id}`);
        }
      );
    } else {
      toast.info("Please login to continue buying")
       return router.push("/signin")
    }

  };

  if (cart.length === 0)
    return (
      <div className="container text-center">
        <Head>
          <title>Cart Empty</title>
        </Head>
        <h1 style={{marginTop: "200px"}}>Cart Empty!</h1>
        <Link href="/">
          <a className="text-info text-decoration-underline">Go to shopping now!</a>
        </Link>
      </div>
    );

  return (
    <div className="container">
      <Head>
        <title>Cart Page</title>
      </Head>

      <button className="btn btn-dark mb-5" onClick={() => router.back()}>
        <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i> Go Back
      </button>

      <div className="row">
        <div className="col-lg-8 mb-4 text-secondary table-responsive">
          <h2 className="text-uppercase">Shopping Cart</h2>

          <table className="table my-3">
            <tbody>
              {cart.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  dispatch={dispatch}
                  cart={cart}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-lg-4 mb-4 text-center text-uppercase text-secondary">
          <form>
            <h2>Shipping</h2>

            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              className="form-control mb-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <label htmlFor="mobile">Mobile</label>
            <input
              type="text"
              name="mobile"
              id="mobile"
              className="form-control mb-2"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </form>

          <h3>
            Total: <span className="text-danger">${total}</span>
          </h3>

          <Link href={auth.user ? "#!" : "/signin"}>
            <a className="btn btn-warning my-2" onClick={handlePayment}>
              Proceed with payment
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
