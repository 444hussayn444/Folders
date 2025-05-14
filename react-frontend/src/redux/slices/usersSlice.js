import {createSlice} from '@reduxjs/toolkit';


const initialState = {
    user: []
    ,
    data_loading:false,
    data_error:""
}

const usersSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        register_start:function(state,action){
            state.data_loading = true
            state.data_error = ""
        },
        register_success:function(state,action){
            state.data_loading = false
            state.data_error = ""
            state.user = action.payload
        },
        register_faliure:function(state,action){
            state.data_loading = false
            state.data_error = action.payload
        },
        login_start:function(state,action){
            state.data_loading = true
            state.data_error = ""
        },
        login_success:function(state,action){
            state.data_loading = false
            state.data_error = ""
            state.user = action.payload
        },
        login_faliure:function(state,action){
            state.data_loading = false
            state.data_error = action.payload
        },

    }
})


export const {register_start,register_success,register_faliure,login_start,login_success,login_faliure} = usersSlice.actions

export default usersSlice.reducer