import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios, { HttpStatusCode } from 'axios';
import { format } from 'date-fns'; 

export const addTask = createAsyncThunk("addTask", async (data) => {
    try {
         // Convert the date from milliseconds to a Date object
         const taskDate = new Date(data.date);
         const formattedDate = format(taskDate, 'yyyy-MM-dd');
         const requestData = {
            ...data,
            date: formattedDate
        };
        const response = await Axios.post("https://docket-m48z.vercel.app/addTask", requestData);
        return response.data
    } catch(error) {
        throw error.response.data
    }
})

export const getTask = createAsyncThunk("getTask", async (userId) => {
    try {
        const response = await Axios.get(`https://docket-m48z.vercel.app/getTask`, {
            params: {
                userID: userId
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
})

export const getOverDueTask = createAsyncThunk("getOverDueTask", async (userId) => {
    try {
        const response = await Axios.get(`https://docket-m48z.vercel.app/overDueTask`, {
            params: {
                userID: userId
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
})

const AddTask = createSlice({
    name: 'addTask',
    initialState: {
        task: '',
        description: '',
        date: Date.now()  
    },
    reducers: {
        setTask: (state,action) => {
            state.task = action.payload;
        },
        setDescription: (state,action) => {
            state.description = action.payload;
        },
        setDate: (state,action) => {
            state.date = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(addTask.fulfilled, (state, action) => {
            state.task = "";
            state.description = "";
            state.date = Date.now();
        })
        .addCase(getTask.fulfilled,(state,action) => {
            state.responseData = action.payload;
        })
        .addCase(getOverDueTask.fulfilled,(state,action) => {
            state.responseDelayData = action.payload;
        })
    }
})

export const {setTask, setDescription, setDate} = AddTask.actions;
export default AddTask.reducer;
