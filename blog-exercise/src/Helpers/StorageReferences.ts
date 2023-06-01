import { auth, db, storage } from "../firebase";
import { StorageReference, ref } from "firebase/storage";
import { useContext } from "react";
import { AuthStoreContext } from "../Components/Auth/AuthStore";
import { doc } from "@firebase/firestore";

const GetAuthUserMail = () => {
  const AuthStore = useContext(AuthStoreContext);
  const currUserMail: string = AuthStore.currUser?.email || "No current user";

  return currUserMail;
};

const likedPhotosCollectionRef = doc(
  db,
  "Photos",
  `${auth.currentUser?.email}`
);

const pictureListRef: StorageReference = ref(storage, `projectFiles`);

export { pictureListRef, likedPhotosCollectionRef, GetAuthUserMail };
