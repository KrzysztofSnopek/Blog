import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import { auth, db } from "../../firebase";
import { observer } from "mobx-react";

export const AddPicture = observer(() => {
  const [comment, setComment] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);

  const commentsRef = collection(db, "Photos");

  useEffect(() => {
    const queryMessages = query(commentsRef);
    onSnapshot(queryMessages, (snapshot) => {
      let messages: any[] = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
  }, []);

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
      <div>
        {messages.map((message, key) => (
          <div key={key}>{message.text}</div>
        ))}
      </div>
    </div>
  );
});
