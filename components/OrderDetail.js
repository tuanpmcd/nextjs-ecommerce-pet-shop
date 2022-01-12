import Link from 'next/link'
import PaypalBtn from './PaypalBtn'
import { patchData } from '../utils/fetchData'
import { updateItem } from '../store/Actions'
import { toast } from 'react-toastify'

const OrderDetail = ({ orderDetail, state, dispatch }) => {
  const { auth, orders } = state

  const handleDelivered = (order) => {
    dispatch({ type: 'NOTIFY', payload: { loading: true } })

    patchData(`order/delivered/${order._id}`, null, auth.token)
      .then(res => {
        if (res.err) return toast.info(res.err)
        const { paid, dateOfPayment, method, delivered } = res.result

        dispatch(updateItem(orders, order._id, {
          ...order, paid, dateOfPayment, method, delivered
        }, 'ADD_ORDERS'))
        dispatch({ type: 'NOTIFY', payload: { loading: false } })
        return toast.success(res.msg)
      })
  }

  if (!auth.user) return null;
  return (
    <>
      {
        orderDetail.map(order => (
          <div key={order._id} className="row">

            <div className="col-lg-8 mb-3">
              <h2 className="text-secondary">Order {order._id}</h2>

              <div className="mt-4 text-secondary">
                <h3 className="text-info fw-bold mb-3">Shipping</h3>
                <p>Name: {order.user.name}</p>
                <p>Email: {order.user.email}</p>
                <p>Address: {order.address}</p>
                <p>Mobile: {order.mobile}</p>

                <div className={`alert ${order.delivered ? 'alert-success' : 'alert-danger'} d-flex justify-content-between align-items-center`} role="alert">

                  {
                    order.delivered ? `Deliverd on ${order.updatedAt}` : 'Not Delivered'
                  }

                  {
                    auth.user.role === 'admin' && !order.delivered &&
                    <button className="btn btn-dark text-uppercase"
                      onClick={() => handleDelivered(order)}>
                      Mark as delivered
                    </button>
                  }

                </div>

                <h3 className="text-info fw-bold mb-3">Payment</h3>
                {
                  order.method && <h6>Method: <em>{order.method}</em></h6>
                }

                {
                  order.paymentId && <p>PaymentId: <em>{order.paymentId}</em></p>
                }

                <div className={`alert ${order.paid ? 'alert-success' : 'alert-danger'}
                        d-flex justify-content-between align-items-center`} role="alert">
                  {
                    order.paid ? `Paid on ${order.dateOfPayment}` : 'Not Paid'
                  }

                </div>

                <div>
                  <h3 className="text-info fw-bold mb-3">Order Items</h3>
                  {
                    order.cart.map(item => (
                      <div
                        className='d-flex justify-content-between align-items-center py-2 mb-2 border-bottom'
                        key={item._id}
                      >
                        <img
                          src={item.images[0].url} alt={item.images[0].url}
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />

                        <h3>
                          <Link href={`/product/${item._id}`}>
                            <a className="text-info text-capitalize fs-5 text-decoration-underline">
                              {item.title}
                            </a>
                          </Link>
                        </h3>

                        <span className="text-danger fs-5">
                          {item.quantity} x ${item.price} = ${item.price * item.quantity}
                        </span>

                      </div>
                    ))
                  }
                </div>

              </div>

            </div>

            {
              !order.paid && auth.user.role !== 'admin' &&
              <div className="col-lg-4">
                <h3 className="mb-4 fw-bold text-danger">Total: ${order.total}</h3>
                <PaypalBtn order={order} />
              </div>
            }

          </div>
        ))
      }
    </>
  )
}

export default OrderDetail