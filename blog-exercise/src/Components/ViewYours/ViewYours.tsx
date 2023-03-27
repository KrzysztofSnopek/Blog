import { useState, useEffect } from "react";
import { storage } from "../../firebase";
import {
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
  FullMetadata,
} from "firebase/storage";
import { auth } from "../../firebase";

export function ViewYours() {
  const [pictureList, setPictureList] = useState([]);
  const [oMetadata, setOMetadata] = useState<FullMetadata>();

  const userName = auth.currentUser?.displayName;
  const pictureListRef = ref(storage, "projectFiles/");

  // const obtainedMetadata = getMetadata(pictureListRef).then((metadata) =>
  //   setOMetadata(metadata)
  // );
  // console.log(obtainedMetadata);

  useEffect(() => {
    let subscribed = true;
    listAll(pictureListRef).then((response) => {
      response.items.forEach((item) => {
        getMetadata(item).then((data) => setOMetadata(data));
      });
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          if (subscribed) {
            setPictureList((prev): any => [...prev, url]);
          }
        });
      });
    });
    return () => {
      subscribed = false;
    };
  }, []);

  console.log(oMetadata?.customMetadata.createdBy);

  return (
    <div>
      {pictureList.map((url) => {
        return <img src={url} key={url} />;
      })}
    </div>
  );
}
