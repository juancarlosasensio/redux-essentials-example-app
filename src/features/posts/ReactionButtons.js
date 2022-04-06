import React from 'react';
import { useDispatch } from 'react-redux';
import { reactionAdded } from './postsSlice';

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
}

export const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch();

  //Object.entries...very useful Object method
  //Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
  // Clean use of destructuring the array of args in the map func
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button 
        key={name} 
        type="button" 
        className="muted-button reaction-button"
        //The order of the params passed to reactionAdded needs to match the order defined in the reducer in postsSlice
        onClick={() => 
          dispatch(reactionAdded({postId: post.id, reaction: name}))
        }
      >
        {emoji} {post.reactions[name]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
