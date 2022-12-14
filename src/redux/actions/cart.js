import Axios from "axios";
import { API_URL } from "../../constants/API";

export const getCartData = (userId) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId,
      },
    }).then((result) => {
      //dispatch ke cart reducer dengan payload : result.data
      dispatch({
        type: "FILL_CART",
        payload: result.data,
      }).catch(() => {
        alert("terjadi kesalahan");
      });
    });
  };
};
