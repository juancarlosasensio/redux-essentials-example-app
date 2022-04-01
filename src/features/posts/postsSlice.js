import {createSlice} from '@reduxjs/toolkit';

const initialState = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' }
]

// Within this file, postsSlice, "state" is only the "posts" data/object within state. We don't get access to the entire state object

/* 
 The posts slice only knows about the data it's responsible for, the state argument will be the array of posts by itself, and not the entire Redux state object
*/

// createSlice will generate action creator functions for each reducer we add to a slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: (state, action) => {
      state.push(action.payload)
    }
  }  
});

//Q: Why is this exporting an action and not a reducer?
//A: createSlice provides action creators behind the scene. Here, we export the action creator, which is what we can then "dispatch" from our React components.
export const { postAdded } = postsSlice.actions

export default postsSlice.reducer