"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import axios from "axios";

import PostCard from "../../components/post-card/PostCard";
import CommentSection from "../../components/post-card/comment-section/CommentSection";

export default function ViewPost() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);

  const searchParams = useSearchParams()
  const postId = searchParams.get('postId')

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://3.110.161.150:4000/post/v2?id=${postId}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        setPost(data);
        setComments(data.comments);

      } catch (error) {
        console.error("Error occurred while fetching post state:", error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return (
    <div>
      {post ? <PostCard post={post} setPost={setPost} totalComments={comments.length}/> : <div>Loading...</div>}
      <div className="my-[1rem] h-[0.25rem] bg-blue-500"></div>
      {post ? (
        <CommentSection postId={postId} comments={comments} setComments={setComments} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
