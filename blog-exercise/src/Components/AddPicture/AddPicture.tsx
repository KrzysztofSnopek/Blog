import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { auth, db } from "../../firebase";

export function AddPicture() {
  const [comment, setComment] = useState<string>("");

  const commentsRef = collection(db, "Photos");

  const handleCommentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setComment(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment === "") return;

    await addDoc(commentsRef, {
      text: comment,
      timestamp: serverTimestamp(),
      user: auth.currentUser?.displayName,
    });

    setComment("");
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Add a comment"
          value={comment}
          onChange={handleCommentChange}
        />
        <button type="submit">Add comment</button>
      </form>
    </div>
  );
}
