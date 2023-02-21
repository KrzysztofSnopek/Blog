import { uid } from "uid";
import { useState, useEffect } from "react";
import { ref, set } from "firebase/database";

export function AddPicture() {
  const [comment, setComment] = useState<string>("");

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  // const addTextToDatabase = () => {
  //   const uuid = uid();
  //   set(ref(db, `/${uuid}`), {
  //     comment,
  //     uuid,
  //   });
  //   setComment("");
  // };

  return (
    <div>
      <form action="">
        <input
          type="text"
          placeholder="Add a comment"
          value={comment}
          onChange={handleCommentChange}
        />
        <button
        // onClick={addTextToDatabase}
        >
          Add comment
        </button>
      </form>
    </div>
  );
}
