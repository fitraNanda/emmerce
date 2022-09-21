import React from "react";
import Axios from "axios";
import { API_URL } from "../constants/API";
import { connect } from "react-redux";
import { getCartData } from "../redux/actions/cart";

class ProductDetail extends React.Component {
  state = {
    productData: {},
    productNotFound: false,
    quantity: 1,
  };

  qtyBtnHandler = (action) => {
    if (action === "increment") {
      this.setState({ quantity: this.state.quantity + 1 });
    } else if (action === "decrement" && this.state.quantity > 1) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  };

  addToCarthandler = () => {
    //check apakah user sudah memiliki barang tsb di cart
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.userGlobal.id,
        productId: this.state.productData.id,
      },
    })
      .then((result) => {
        if (result.data.length) {
          //barangnya sudah ada di cart
          Axios.patch(`${API_URL}/carts/${result.data[0].id}`, {
            quantity: result.data[0].quantity + this.state.quantity,
          })
            .then(() => {
              this.props.getCartData(this.props.userGlobal.id);
              alert("berhasil menambahkan barang");
            })
            .catch(() => {
              alert("terjadi kesalahan");
            });
        } else {
          //barangnya belum ada di cart

          Axios.post(`${API_URL}/carts`, {
            userId: this.props.userGlobal.id,
            productId: this.state.productData.id,
            price: this.state.productData.price,
            productName: this.state.productData.productName,
            productImage: this.state.productData.productImage,
            quantity: this.state.quantity,
          })
            .then(() => {
              this.props.getCartData(this.props.userGlobal.id);
              alert("berhasil menambahkan barang");
            })
            .catch(() => {
              alert("terjadi kesalahan");
            });
        }
      })
      .catch(() => {
        alert("terjadi kesalahan");
      });
  };

  fetchProductData = () => {
    Axios.get(`${API_URL}/products`, {
      params: {
        id: this.props.match.params.productId,
      },
    })
      .then((result) => {
        if (result.data.length) {
          this.setState({
            productData: result.data[0],
          });
        } else {
          this.setState({ productNotFound: true });
        }
      })
      .catch(() => {
        alert("terjadi kesalahan");
      });
  };

  componentDidMount() {
    this.fetchProductData();
  }

  render() {
    return (
      <div className="container">
        {this.state.productNotFound ? (
          <div className="alert alert-danger text-center mt-3">
            Product dengan ID {this.props.match.params.productId} tidak
            ditemukan
          </div>
        ) : (
          <div className="row mt-3">
            <div className="col-6">
              <img
                style={{ width: "100%" }}
                src={this.state.productData.productImage}
                alt=""
              />
            </div>
            <div className="col-6 d-flex flex-column justify-content-center">
              <h4>{this.state.productData.productName}</h4>
              <h5>{this.state.productData.price}</h5>
              <p>{this.state.productData.description}</p>
              <div className="d-flex flex-row align-items-center">
                <button
                  onClick={() => this.qtyBtnHandler("decrement")}
                  className="btn btn-primary mr-4"
                >
                  -
                </button>
                <button className="btn btn-primary mx-4">
                  {this.state.quantity}
                </button>
                <button
                  onClick={() => this.qtyBtnHandler("increment")}
                  className="btn btn-primary mt-0"
                >
                  +
                </button>
              </div>
              <button
                onClick={this.addToCarthandler}
                className="btn btn-success mt-3"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
  getCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
