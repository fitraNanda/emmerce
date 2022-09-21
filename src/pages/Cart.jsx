import React from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { API_URL } from "../constants/API";
import { getCartData } from "../redux/actions/cart";

class Cart extends React.Component {
  state = {
    isCheckoutMode: false,
    recipientName: "",
    address: "",
    payment: 0,
  };

  checkoutModeToggle = () => {
    this.setState({
      isCheckoutMode: !this.state.isCheckoutMode,
    });
  };

  deleteCartHandler = (cartId) => {
    Axios.delete(`${API_URL}/carts/${cartId}`)
      .then(() => {
        this.props.getCartData(this.props.userGlobal.id);
      })
      .catch(() => {
        alert("terjadi kesalahan");
      });
  };

  renderSubtotalPrice = () => {
    let subTotal = 0;
    for (let i = 0; i < this.props.cartGlobal.cartList.length; i++) {
      subTotal +=
        this.props.cartGlobal.cartList[i].price *
        this.props.cartGlobal.cartList[i].quantity;
    }
    return subTotal;
  };

  renderTaxFee = () => {
    return this.renderSubtotalPrice() * 0.11;
  };

  renderTotalPrice = () => {
    return this.renderSubtotalPrice() + this.renderTaxFee();
  };

  renderCart = () => {
    return this.props.cartGlobal.cartList.map((val) => {
      return (
        <tr>
          <td className="align-middle">{val.id}</td>
          <td className="align-middle">{val.productName}</td>
          <td className="align-middle">{val.price}</td>
          <td className="align-middle">
            <img src={val.productImage} alt="" style={{ height: "125px" }} />
          </td>
          <td className="align-middle">{val.quantity}</td>
          <td className="align-middle">{val.quantity * val.price}</td>
          <td className="align-middle">
            <button
              onClick={() => this.deleteCartHandler(val.id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  inputHandler = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  payBtnHandler = () => {
    //1. POST ke /transactions
    //2. DELETE semua cart item yang sudah dibayar

    //kondisi melihat uang konsumen
    if (this.state.payment < this.renderTotalPrice()) {
      alert(`uang anda kurang ${this.renderTotalPrice() - this.state.payment}`);
      return;
    }

    if (this.state.payment > this.renderTotalPrice()) {
      alert(
        `Sukses, anda mendapatkan kembalian ${
          this.state.payment - this.renderTotalPrice()
        }`
      );
    } else if (this.state.payment === this.renderTotalPrice()) {
      alert(`Terima kasih telah membayar dengan uang pas`);
    }

    const d = new Date();

    Axios.post(`${API_URL}/transactions`, {
      userId: this.props.userGlobal.id,
      address: this.state.address,
      recipientName: this.state.recipientName,
      totalPrice: parseInt(this.renderTotalPrice()),
      totalPayment: parseInt(this.state.payment),
      transactionDate: `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`,
      transactionItems: this.props.cartGlobal.cartList,
    })
      .then((result) => {
        alert("Terima kasih");
        result.data.transactionItems.forEach((val) => {
          this.deleteCartHandler(val.id);
        });
      })
      .catch(() => {
        alert("terjadi kesalahan");
      });
  };

  render() {
    return (
      <div className="p-5 text-center">
        <h1>Cart</h1>
        <div className="row mt-5">
          <div className="col-9 text-center">
            <table className="table">
              <thead className="bg-light">
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.renderCart()}</tbody>
              <tbody className="bg-light"></tbody>
              <tfoot>
                <tr className="bg-light">
                  <td colSpan="8">
                    <button
                      onClick={this.checkoutModeToggle}
                      className="btn btn-success"
                    >
                      Checkout
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {this.state.isCheckoutMode ? (
            <div className="col-3">
              {/* form checkout */}
              <div className="card text-start">
                <div className="card-header">
                  <strong>Order Summary</strong>
                </div>
                <div className="card-body">
                  <div className="d-flex my-2 flex-row justify-content-between align-items-center">
                    <span className="font-weight-bold">
                      <strong>Subtotal price</strong>{" "}
                    </span>
                    <span>Rp. {this.renderSubtotalPrice()}</span>
                  </div>
                  <div className="d-flex my-2 flex-row justify-content-between align-items-center">
                    <span className="font-weight-bold">
                      <strong>Tax (11%)</strong>{" "}
                    </span>
                    <span>Rp. {this.renderTaxFee()}</span>
                  </div>
                  <div className="d-flex my-2 flex-row justify-content-between align-items-center">
                    <span className="font-weight-bold">
                      <strong>Total price</strong>{" "}
                    </span>
                    <span>Rp. {this.renderTotalPrice()}</span>
                  </div>
                </div>
                <div className="card-body border-top">
                  <label htmlFor="recipientName">Recipient Name</label>
                  <input
                    onChange={this.inputHandler}
                    type="text"
                    name="recipientName"
                    className="form-control mb-3"
                  />
                  <label htmlFor="address">Address</label>
                  <input
                    onChange={this.inputHandler}
                    type="text"
                    name="address"
                    className="form-control"
                  />
                </div>
                <div className="card-footer">
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <input
                      onChange={this.inputHandler}
                      name="payment"
                      type="number"
                      className="form-control"
                    />
                    <button
                      onClick={this.payBtnHandler}
                      className="btn btn-success mx-1"
                    >
                      Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartGlobal: state.cart,
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
  getCartData,
};
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
