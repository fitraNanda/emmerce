import React from "react";
import Axios from "axios";
import { API_URL } from "../constants/API";
import { connect } from "react-redux";

class History extends React.Component {
  state = {
    transactionList: [],
    transactionDetails: [],
  };

  fetchTransactions = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        userId: this.props.userGlobal.id,
      },
    })
      .then((result) => {
        this.setState({ transactionList: result.data });
      })
      .catch(() => {
        alert("terjadi kesalahan di server");
      });
  };

  seeDetailsBtnHandler = (transactionDetails) => {
    this.setState({ transactionDetails });
  };

  renderTransaction = () => {
    return this.state.transactionList.map((val) => {
      return (
        <tr>
          <td>{val.transactionDate}</td>
          <td>{val.transactionItems.length} Item(s)</td>
          <td>Rp. {val.totalPrice}</td>
          <td>
            <button
              onClick={() => this.seeDetailsBtnHandler(val.transactionItems)}
              className="btn btn-info"
            >
              See Details
            </button>
          </td>
        </tr>
      );
    });
  };

  renderTransactionDetailItems = () => {
    return this.state.transactionDetails.map((val) => {
      return (
        <div className="d-flex my-2 flex-row justify-content-between align-items-center">
          <span>
            <strong>
              {val.productName} ({val.quantity})
            </strong>
          </span>
          <span>Rp {val.price * val.quantity}</span>
        </div>
      );
    });
  };

  componentDidMount() {
    this.fetchTransactions();
  }

  render() {
    return (
      <div className="p-5">
        <h1>Transaction History</h1>
        <div className="row mt-5">
          <div className="col-8">
            <table className="table">
              <thead className="bg-light">
                <tr>
                  <th>Transaction Data</th>
                  <th>Total Items</th>
                  <th>Total Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.renderTransaction()}</tbody>
            </table>
          </div>
          <div className="col-4">
            {this.state.transactionDetails.length ? (
              <div className="card">
                <div className="card-header">
                  <strong>Transaction Deatail</strong>
                </div>
                <div className="card-body">
                  {this.renderTransactionDetailItems()}
                </div>
              </div>
            ) : null}
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

export default connect(mapStateToProps)(History);
