import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import PostCardFeed from './PostCardFeed';

export default function Posts({ post, muted, setMuted, onClick }) {
    const [likedState, setLikedState] = useState(null);
    const [followingState, setFollowingState] = useState(null);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState(0);
    
    const postRef = useRef(null);
    const playerRef = useRef(null);
    const [loadMedia, setLoadMedia] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const fetchPostState = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://3.110.161.150:4000/post/state?id=${post.id}`, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            });
            setLikes(response.data.likes);
            setComments(response.data.comments);
            setLikedState(response.data.isLiked);
            setFollowingState(response.data.isFollowing);
        } catch (error) {
            console.log('Error occurred while fetching post state: ', error);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setLoadMedia(true);
                        fetchPostState();
                        setIsActive(true);
                    } else {
                        setIsActive(false);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (postRef.current) {
            observer.observe(postRef.current);
        }

        return () => {
            if (postRef.current) {
                observer.unobserve(postRef.current);
            }
        };
    }, [post.id]);

    useEffect(() => {
        if (isActive) {
            playerRef.current?.getInternalPlayer()?.play().catch(error => {
                console.warn('Play interrupted: ', error);
            });
        } else {
            playerRef.current?.getInternalPlayer()?.pause();
        }
    }, [isActive]);

    return (
        <div ref={postRef} className="w-full bg-black" onClick={onClick}>
            <PostCardFeed
                loadMedia={loadMedia}
                likedState={likedState}
                setLikedState={setLikedState}
                followingState={followingState}
                setFollowingState={setFollowingState}
                likes={likes}
                setLikes={setLikes}
                comments={comments}
                post={post}
                isActive={isActive}
                muted={muted}
                setMuted={setMuted}
                playerRef={playerRef}
            />
        </div>
    );
}
