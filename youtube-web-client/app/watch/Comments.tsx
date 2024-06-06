import { useEffect, useState } from "react";
import styles from "./WatchPage.module.css"
import { onAuthStateChangedHelper } from "../Utilities/firebase/firebase";
import { User } from "firebase/auth";
import { getCommentsById, setCommentsById } from "../Utilities/firebase/functions";


interface Comment {
    text: string;
    user: string;
    comments: Array<Comment>
    id: string;
}

const dummyComments: Array<Comment> = [
    {
        user: '1',
        text: 'this is comment one',
        comments: [],
        id: '1',
    },
    {
        user: '2',
        text: 'this is comment two',
        comments: [],
        id: '2',
    },
    {
        user: '3',
        text: 'this is comment three',
        comments: [],
        id: '3',
    },
]



export default function Comments({ videoId }: any) {
    // init user state
    const [user, setUser] = useState<User | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });


        const fetchComments = async () => {
            const response = await getCommentsById(videoId);
            if (response) {
                setComments(response);
            } else {
                setComments([]);
            }
        };

        fetchComments();


        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [videoId]);



    const onComment = async (newComment: Comment) => {
        newComment.user = user?.photoURL as string;
        newComment.id = `${videoId}-${Date.now()}`;
        await setCommentsById(videoId, newComment);
        setComments((prev: any) => [newComment, ...(prev)]);
    };
    return (
        <main className={styles.descriptionBox}>
            <h2 className={styles.descriptionHeading}>Comments</h2>
                <div className={styles.postComment}>
                    {<CommentInput onComment={onComment}/>}
                </div>
                <div className={styles.postComment}>
                    {comments && comments.map((comment: Comment) => (
                        <CommentItem comment={comment}/>
                    ))}
                </div>
        </main>
    );
}


interface CommentItemProps {
    comment: Comment;
}

const CommentItem = ({comment}: CommentItemProps) => {
    // init user state
    const [user, setUser] = useState<User | null>(null);
    const [isReplying, setIsReplying] = useState(false);
    const [comments, setComments] = useState(comment.comments || []);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });

        // Fetch nested comments
        const fetchComments = async () => {
            const response = await getCommentsById(comment.id);
            if (response) {
                setComments(response);
                comment.comments = response;
            } else {
                setComments([]);
            }
        };

        fetchComments();

        return () => unsubscribe();
    }, [comment]);

    const onComment = async (newComment: Comment) => {
        newComment.user = user?.photoURL as string;
        newComment.id = `${comment.id}-${Date.now()}`;
        await setCommentsById(comment.id, newComment);
        setComments((prev) => [newComment, ...prev]);
    };

    return (
        <div className="flex flex-col">
            <span>{comment.text}</span>
            {isReplying ? (<button onClick={() => setIsReplying(false)} disabled={!user}>Cancel</button>
            ) : (
                (<button onClick={() => setIsReplying(true)} disabled={!user}>Reply</button>)
            )}

            {user && isReplying && <CommentInput onComment={onComment} />}
            <div className={styles.postComment}>
                    {(comments).map((comment: Comment) => (
                        <CommentItem comment={comment}/>
                    ))}
            </div>
        </div>
    );
}

interface CommentInputProps {
    onComment: (newComment: Comment) => void;
}

const CommentInput = ({onComment}: CommentInputProps) => {
    const [commentBody, setCommentBody] = useState("");

    // init user state
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });


        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <input 
            value={commentBody} 
            onChange={(event) => setCommentBody(event.target.value)} 
            placeholder="What are your thoughts?" className={styles.commentInput}/>
            <button onClick={() => {
                onComment({text: commentBody, comments: [], user: "", id: ""});
                setCommentBody("");
            }} disabled={!user}>Comment</button>
        </div>

    );
}