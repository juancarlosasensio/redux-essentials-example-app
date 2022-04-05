import {createSlice, nanoid} from '@reduxjs/toolkit';

const initialState = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' }
]


/* 
 Within this file, postsSlice, "state" is only the "posts" data/object within state. We don't get access to the entire state object
 The posts slice only knows about the data it's responsible for, the state argument will be the array of posts by itself, and not the entire Redux state object.
*/

// createSlice will generate action creator functions for each reducer we add to a slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      /* We're using the "prepare" callback here in case we needed to dispatch the same action from different components, 
      or the logic for preparing the payload is complicated.
      Previously,  we'd have to duplicate that logic every time we wanted to 
      dispatch the action, calling it like dispatch(postAdded({id: nanoid(), title, content})), 
      forcing the component to know exactly what the payload for this action should look like. */
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title, 
            content,
            user: userId
          }
        }
      }
  },
    postUpdated: (state, action) => {
      const {title, content, id} = action.payload;
      const existingPost = state.find(post => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    }
  }  
});

//Q: Why is this exporting an action and not a reducer?
//A: createSlice provides action creators behind the scene. Here, we export the action creator, which is what we can then "dispatch" from our React components.
export const { postAdded, postUpdated } = postsSlice.actions

export default postsSlice.reducer