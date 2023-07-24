import { db, storage } from "../firebase";
import { StorageReference, ref } from "firebase/storage";
import { doc } from "@firebase/firestore";

// const currentUserMail: string =
//   window.localStorage.getItem("user")?.replace(/"/g, "") ?? "no current user";

// const likedPhotosCollectionRef = doc(db, "Photos", currentUserMail);

const pictureListRef: StorageReference = ref(storage, `projectFiles`);

export { pictureListRef };
