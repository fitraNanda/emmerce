import React from "react";
import "../assets/styles/productCard.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Axios from "axios";
import { API_URL } from "../constants/API";
import { getCartData } from "../redux/actions/cart";

class ProductCard extends React.Component {
  addToCarthandler = () => {
    //check apakah user sudah memiliki barang tsb di cart
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.userGlobal.id,
        productId: this.props.productData.id,
      },
    })
      .then((result) => {
        if (result.data.length) {
          //barangnya sudah ada di cart
          Axios.patch(`${API_URL}/carts/${result.data[0].id}`, {
            quantity: result.data[0].quantity + 1,
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
            productId: this.props.productData.id,
            price: this.props.productData.price,
            productName: this.props.productData.productName,
            productImage: this.props.productData.productImage,
            quantity: 1,
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

  render() {
    return (
      <div className="card product-card">
        <img src={this.props.productData.productImage} alt="" />
        <div className="mt-2">
          <div>
            <Link
              to={`/product-detail/${this.props.productData.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h6>{this.props.productData.productName}</h6>
            </Link>
            <span className="text-muted">{this.props.productData.price}</span>
          </div>
          <div className="d-flex flex-row justify-content-end">
            <button
              onClick={this.addToCarthandler}
              className="btn btn-primary mt-2"
            >
              {" "}
              Add to cart
            </button>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
