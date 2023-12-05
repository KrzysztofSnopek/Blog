import { storage } from "../firebase";
import { StorageReference, ref } from "firebase/storage";

const pictureListRef: StorageReference = ref(storage, `projectFiles`);

export { pictureListRef };
