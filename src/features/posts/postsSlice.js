import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const initialState = {
  posts: [],
  status: "idle",
  error: null
}


/* 
 Within the postsSlice file, "state" is only the "posts" data/object within state. We don't get access to the entire state object
 The posts slice only knows about the data it's responsible for, the state argument will be the array of posts by itself, and not the entire Redux state object.
*/

// createSlice will generate action creator functions for each reducer we add to a slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload);
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
      const existingPost = state.posts.find(post => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
    // Action objects should contain the minimum amount of info needed to describe what happened. We know which post we need to update, and which reaction name was clicked on. We could have calculated the new reaction counter value and put that in the action, but it's always better to keep the action objects as small as possible, and do the state update calculations in the reducer. This also means that reducers can contain as much logic as necessary to calculate the new state.
    reactionAdded: (state, action) => {
      const {postId, reaction} = action.payload;
      const existingPost = state.posts.find(post => post.id === postId);

      if (existingPost) {
        if (existingPost.reactions[reaction] !== 0) {
          existingPost.reactions[reaction]++
        } else {
          existingPost.reactions[reaction] = 1  
        }
      }
    }
  },
  // There are times when a slice reducer needs to respond to other actions that weren't defined as part of this slice's reducers field. We can do that using the slice extraReducers field instead.

  // The extraReducers option should be a function that receives a parameter called builder. The builder object provides methods that let us define additional case reducers that will run in response to actions defined outside of the slice
  extraReducers(builder) {
    builder.
    addCase(fetchPosts.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.posts = state.posts.concat(action.payload);
    })
    .addCase(fetchPosts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message
    })
  }
});

//Q: Why is this exporting an action and not a reducer?
//A: createSlice provides action creators behind the scenes. Here, we export the action creator, which is what we can then "dispatch" from our React components.
export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// Redux Toolkit's createAsyncThunk API generates thunks that automatically dispatch 
// "posts/fetchPosts/start/success/failure" actions for you.
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

//The reusable selector functions below allow components to use those selectors to extract the data they need instead of repeating the selector logic in each component. That way, if we do change our state structure again, we only need to update the code in the slice file.

//Note that the state parameter for these selector functions is the root Redux state object, as it was for the inlined anonymous selectors we wrote directly inside of useSelector.

//The two consecutive .posts.posts might seem strange but it's because the first one refers to the slice, which we named posts, and the second to the posts field within that slice.
export const selectAllPosts = (state) => state.posts.posts;
export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId);

