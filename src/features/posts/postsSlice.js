import {createSlice, nanoid} from '@reduxjs/toolkit';
import { sub } from 'date-fns';

const initialState = [
  { 
    id: '1', 
    title: 'First Post!', 
    content: 'Hello!', 
    date: sub(new Date(), {minutes: 10}).toISOString(),
    reactions: {thumbsUp: 0, hooray: 0}
  },
  { 
    id: '2', 
    title: 'Second Post', 
    content: 'More text',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {thumbsUp: 4, hooray: 1, rocket: 2}
  }
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
      prepare(title, content, userId, reactions) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title, 
            content,
            user: userId,
            reactions
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
    },
    // Action objects should contain the minimum amount of info needed to describe what happened. We know which post we need to update, and which reaction name was clicked on. We could have calculated the new reaction counter value and put that in the action, but it's always better to keep the action objects as small as possible, and do the state update calculations in the reducer. This also means that reducers can contain as much logic as necessary to calculate the new state.
    reactionAdded: (state, action) => {
      const {postId, reaction} = action.payload;
      const existingPost = state.find(post => post.id === postId);

      if (existingPost) {
        if (existingPost.reactions[reaction]) {
          existingPost.reactions[reaction]++
        } else {
          existingPost.reactions[reaction] = 1  
        }
      }
    }
  }  
});

//Q: Why is this exporting an action and not a reducer?
//A: createSlice provides action creators behind the scene. Here, we export the action creator, which is what we can then "dispatch" from our React components.
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

//The reusable selector functions below allow components to use those selectors to extract the data they need instead of repeating the selector logic in each component. That way, if we do change our state structure again, we only need to update the code in the slice file.

export const selectAllPosts = (state) => state.posts;
export const selectPostById = (state, postId) => state.posts.find(post => post.id === postId);