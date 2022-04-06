import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostAuthor from './PostAuthor';
import { TimeAgo } from "./TimeAgo";
import {ReactionButtons} from './ReactionButtons';

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params;
  // The component will re-render any time the value returned from useSelector changes to a new reference. Components should always try to select the ***smallest possible amount of data they need from the store***, which will help ensure that it only renders when it actually needs to.
  const post = useSelector(
    state => state.posts.find(post => post.id === postId)
  );

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  } else {
    return (
      <section>
        <article className="post">
          <h2>{post.title}</h2>
          <div>
            <PostAuthor userId={post.user} />
            <TimeAgo timestamp={post.date} />
          </div>
          <p className="post-content">{post.content}</p>
          <ReactionButtons post={post} />
          <Link to={`/editPost/${post.id}`} className="button">
            Edit Post
          </Link>
        </article>
      </section>
    )
  }
};