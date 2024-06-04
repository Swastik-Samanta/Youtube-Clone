import { useState } from "react";
import styles from "./WatchPage.module.css"
import { stringify } from "querystring";


interface Comment {
    text: string;
    user: string;
    comments: Array<Comment>
}

const dummyComments: Array<Comment> = [
    {
        user: '1',
        text: 'this is comment one',
        comments: [],
    },
    {
        user: '2',
        text: 'this is comment two',
        comments: [],
    },
    {
        user: '3',
        text: 'this is comment three',
        comments: [],
    },
]



export default function Comments({ video }: any) {
    const [comments, setComments] = useState(dummyComments);

    const onComment = (newComment: Comment) => {
        setComments((prev) => [newComment, ...prev]);
    };
    return (
        <main className={styles.descriptionBox}>
            <h2 className={styles.descriptionHeading}>Comments</h2>
                <div className={styles.postComment}>
                    <CommentInput onComment={onComment}/>
                </div>
                <div className={styles.postComment}>
                    {comments.map((comment) => (
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
    const [isReplying, setIsReplying] = useState(false);
    const [comments, setComments] = useState(comment.comments);

    const onComment = (newComment: Comment) => {
        setComments((prev) => [newComment, ...prev]);
    };

    return (
        <div className="flex flex-col">
            <span>{comment.text}</span>
            {isReplying ? (<button onClick={() => setIsReplying(false)}>Cancel</button>
            ) : (
                (<button onClick={() => setIsReplying(true)}>Reply</button>)
            )}

            {isReplying && <CommentInput onComment={onComment}/>}
            <div className={styles.postComment}>
                    {comments.map((comment) => (
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

    return (
        <div>
            <input 
            value={commentBody} 
            onChange={(event) => setCommentBody(event.target.value)} 
            placeholder="What are your thoughts?" className={styles.commentInput}/>
            <button onClick={() => {
                onComment({text: commentBody, comments: [], user: ""});
                setCommentBody("");
            }}>Comment</button>
        </div>

    );
}