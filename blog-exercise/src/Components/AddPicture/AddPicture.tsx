import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where /* around 47th min, allows to add statements to the snapshots */,
} from "@firebase/firestore";
import { auth, db } from "../../firebase";
import { observer } from "mobx-react";

interface Messages {
  id: string;
  text: string;
  user: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export const AddPicture = observer(() => {
  const [comment, setComment] = useState<string>("");
  const [messages, setMessages] = useState<Messages[]>([]);

  const commentsRef = collection(db, "Photos");

  useEffect(() => {
    const queryMessages = query(commentsRef, orderBy("timestamp"));
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messagesArr: Messages[] = [];
      snapshot.forEach((doc) => {
        messagesArr.push({ ...doc.data(), id: doc.id } as Messages);
      });
      setMessages(messagesArr);
    });

    return () => unsuscribe();
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
      <h1 className="font-bold p-2">Comments section</h1>
      <div className="p-2">
        {messages.map((message) => (
          <div key={message.id}>
            <span className="font-bold pr-2">{message.user}</span>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleFormSubmit} className="p-2 bg-orange-300">
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
});
