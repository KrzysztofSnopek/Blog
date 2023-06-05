import { auth, db, storage } from "../firebase";
import { StorageReference, ref } from "firebase/storage";
import { doc } from "@firebase/firestore";

const likedPhotosCollectionRef = doc(
  db,
  "Photos",
  `${auth.currentUser?.email}`
);

const pictureListRef: StorageReference = ref(storage, `projectFiles`);

export { pictureListRef, likedPhotosCollectionRef };
