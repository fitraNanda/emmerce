import UserReducer from "./user";
import { combineReducers } from "redux";
import cartReducer from "./cart";

export default combineReducers({
  user: UserReducer,
  cart: cartReducer,
});
