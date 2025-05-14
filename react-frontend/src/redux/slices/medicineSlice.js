import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  medicines: [],
  Error: null,
  Loading: false,
};

const medicineSlice = createSlice({
  name: "medicines",
  initialState,
  reducers:{
     f_start : function (state,action){
         state.Loading = true;
     }
     ,
     f_success: function(state,action){
        state.Loading = false;
        state.medicines = action.payload;
     }
     ,
     f_failure: function (state,action){
        state.Loading = false;
        state.Error = action.payload;
     }
  }
});


export const {f_start,f_success,f_failure}  = medicineSlice.actions
export default medicineSlice.reducer