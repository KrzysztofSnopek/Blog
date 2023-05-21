import { makeAutoObservable } from "mobx";

class PhotoStore2 {
  constructor() {
    makeAutoObservable(this);
  }
  sharedData: string[] = [];

  setData(data: string[]) {
    this.sharedData = data;
  }
}

export default PhotoStore2;
