import React, { useEffect, useState } from 'react';
import './StoryHome.css';

const StoryHome = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('children');
  const [stories, setStories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  const userEmail = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');

  const fetchStories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost/story_portal/story.php');
      const data = await response.json();

      const storiesWithLikes = await Promise.all(
        data.map(async (story) => {
          const likeRes = await fetch(`http://localhost/story_portal/get_likes.php?story_id=${story.id}`);
          const likeData = await likeRes.json();
          return { ...story, likes: likeData.count || 0 };
        })
      );

      setStories(storiesWithLikes);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) {
      alert('Please fill out all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost/story_portal/post_story.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          category,
          created_by: userId,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert('Story posted successfully!');
        setTitle('');
        setContent('');
        setCategory('children');
        fetchStories();
      } else {
        alert('Failed to post story: ' + result.message);
      }
    } catch (err) {
      console.error("Post error:", err);
      alert("An error occurred while posting the story.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (storyId) => {
    if (!userId) {
      alert('User not logged in');
      return;
    }

    try {
      const response = await fetch('http://localhost/story_portal/like_story.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story_id: storyId, user_id: userId }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        fetchStories();
      } else {
        alert('Failed to like story: ' + result.message);
      }
    } catch (error) {
      console.error('Error liking story:', error);
      alert('Network error occurred while liking.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
  };

  const filteredStories =
    filterCategory === 'all'
      ? stories
      : stories.filter((story) => (story.category || '').toLowerCase() === filterCategory.toLowerCase());

  return (
    <div className="story-home">
      <button className="logout-btn" onClick={handleLogout}>
        Sign Out
      </button>
      <h1>Welcome to Story Portal 🌟</h1>

      <form className="story-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Story Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your story here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="children">Children</option>
          <option value="love">Love</option>
          <option value="emotion">Emotion</option>
          <option value="motivation">Motivation</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Story'}
        </button>
      </form>

      <div className="filter-section">
        <label>Filter:</label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="children">Children</option>
          <option value="love">Love</option>
          <option value="emotion">Emotion</option>
          <option value="motivation">Motivation</option>
        </select>
      </div>

      <div className="story-list">
        {loading ? (
          <p>Loading stories...</p>
        ) : filteredStories.length === 0 ? (
          <p>No stories to display.</p>
        ) : (
          filteredStories.map((story) => (
            <div key={story.id} className="story-card">
              <h3>{story.title}</h3>
              <p>{story.content}</p>
              <span className="badge">{story.category}</span>
              <p>
                <small>Posted on: {story.created_at}</small>
              </p>
              <div className="story-actions">
                <button onClick={() => handleLike(story.id)}>
                  👍 Like ({story.likes || 0})
                </button>
              </div>

              {/* Embedded Comment Section */}
              <div className="comment-section">
                <CommentBlock storyId={story.id} userId={userId} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Embedded CommentBlock Component
const CommentBlock = ({ storyId, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost/story_portal/get_comments.php?story_id=${storyId}`);
      const data = await res.json();
      if (data.status === 'success') setComments(data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch('http://localhost/story_portal/add_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story_id: storyId, user_id: userId, comment_text: newComment }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setNewComment('');
        fetchComments();
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch('http://localhost/story_portal/delete_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: commentId, user_id: userId }),
      });
      const data = await res.json();
      if (data.status === 'success') fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="comment-block">
      <h4>Comments</h4>
      <input
        type="text"
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
        placeholder="Write a comment..."
      />
      <button onClick={postComment}>Post</button>
      <ul>
        {comments.map(c => (
          <li key={c.id}>
            <b>{c.username}:</b> {c.comment_text}
            {c.user_id === userId && (
              <button onClick={() => deleteComment(c.id)} style={{ marginLeft: '10px' }}>
                🗑️
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryHome;
