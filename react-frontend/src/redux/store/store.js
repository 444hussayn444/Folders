import Prediction_Reducer from "../slices/predictionSlice";
import { configureStore } from "@reduxjs/toolkit";
import Auth_Reducer from "../slices/usersSlice";
import Medicine_Reducer from "../slices/medicineSlice";
import CartReducer from "../slices/CaritemsSlice";
const store = configureStore({
  reducer: {
    predict: Prediction_Reducer,
    auth: Auth_Reducer,
    medicines: Medicine_Reducer,
    cart: CartReducer,
  },
});

export default store;
