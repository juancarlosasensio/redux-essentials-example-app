import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const initialState = [];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  // You may have noticed that this time the case reducer isn't using the state variable at all. Instead, we're returning the action.payload directly. Immer lets us update state in two ways: either mutating the existing state value, or returning a new result. If we return a new value, that will replace the existing state completely with whatever we return.
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
        return action.payload
    })
  }
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await client.get('/fakeApi/users');
  return response.data
});

export const selectAllUsers = (state) => state.users;
export const selectUserById = (state, userId) => state.users.find(user => user.id === userId);


export default usersSlice.reducer;
