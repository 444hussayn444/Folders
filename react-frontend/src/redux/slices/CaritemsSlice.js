import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  load_cart: false,
  user_quantity:0,
  error: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    get_quantity: (state,action)=>{
        state.user_quantity = state.cartItems?.length
    },
    set_cart_items: (state, action) => {
      const user = JSON.parse(localStorage.getItem("user"))
      const newItems = action.payload;
      const updatedCartItems = [...state.cartItems];
      
      newItems.map((item) => {
        return {
          ...item,
          Cart_ID: user?.userdata.id,
          quantity: item.quantity || 1,
        }
      })

      console.log("newItems", newItems);

      newItems.forEach((newItem) => {
        const existingItemIndex = updatedCartItems.findIndex(
          (item) => item.Medication_ID === newItem.Medication_ID && item.Cart_ID === newItem.Cart_ID
        );
        if (existingItemIndex >= 0) {
          updatedCartItems[existingItemIndex] = {
            ...updatedCartItems[existingItemIndex],
            ...newItem,
            quantity: newItem.quantity || updatedCartItems[existingItemIndex].quantity || 1,
          };
        } else {
          updatedCartItems.push({ ...newItem, quantity: newItem.quantity || 1 });
        }
      });

      state.cartItems = updatedCartItems;
    },
    add_to_cart: (state, action) => {
      const payloadItem = action.payload;
      const isExist = state.cartItems.find(
        (item) => item.Medication_ID === payloadItem.Medication_ID && item.Cart_ID === payloadItem.Cart_ID
      );
      if (isExist) {
        state.cartItems = state.cartItems.map((item) =>
          item.Medication_ID === payloadItem.Medication_ID && item.Cart_ID === payloadItem.Cart_ID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        state.cartItems.push({
          ...payloadItem,
          quantity: 1,
          Cart_ID: payloadItem.Cart_ID,
        });
      }
    },
    decrease: (state, action) => {
      state.cartItems = state.cartItems
        .map((product) => {
          if (action.payload.Medication_ID === product.Medication_ID && action.payload.Cart_ID === product.Cart_ID) {
            if (product.quantity > 1) {
              return { ...product, quantity: product.quantity - 1 };
            }
            return null;
          }
          return product;
        })
        .filter((item) => item !== null);
    },
    clearCart : (state,action) =>{
      state.cartItems = []
    }
  },
});

export const { add_to_cart, decrease, set_cart_items ,clearCart,get_quantity} = cartSlice.actions;
export default cartSlice.reducer;