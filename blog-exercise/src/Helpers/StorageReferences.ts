import { doc } from "@firebase/firestore";
import { db, auth, storage } from "../firebase";
import { StorageReference, ref } from "firebase/storage";
import { useContext, useState } from "react";
import { AuthStoreContext } from "../Components/Auth/AuthStore";

const GetAuthUserMail = () => {
  const AuthStore = useContext(AuthStoreContext);
  const currUserMail: string = AuthStore.currUser?.email || "No current user";

  return currUserMail;
};

const pictureListRef: StorageReference = ref(storage, `projectFiles`);

export { pictureListRef, GetAuthUserMail };
