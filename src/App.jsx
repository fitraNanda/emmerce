import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Cart from "./pages/Cart";
import History from "./pages/History";
import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";
import "bootstrap/dist/css/bootstrap.css";
import MyNavbar from "./components/myNavbar";
import { connect } from "react-redux";
import { userKeepLogin, checkStorage } from "./redux/actions/user";
import { getCartData } from "./redux/actions/cart";

class App extends React.Component {
  componentDidMount() {
    const userLocalStorage = localStorage.getItem("userDataEmmerce");

    if (userLocalStorage) {
      const userData = JSON.parse(userLocalStorage);
      this.props.userKeepLogin(userData);
      this.props.getCartData(userData.id);
    } else {
      this.props.checkStorage();
    }
  }

  render() {
    if (this.props.userGlobal.storageIsChecked) {
      return (
        <BrowserRouter>
          <MyNavbar />
          <Switch>
            <Route component={Register} path="/register" />
            <Route component={Login} path="/login" />
            <Route component={Cart} path="/cart" />
            <Route component={History} path="/history" />
            <Route component={Admin} path="/admin" />
            <Route
              component={ProductDetail}
              path="/product-detail/:productId"
            />
            <Route component={Home} path="/" />
          </Switch>
        </BrowserRouter>
      );
    }

    return <div>Loading...</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
  };
};

const mapDispatchToProps = {
  userKeepLogin,
  checkStorage,
  getCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
