export interface UploadedImage {
  url: string;
  alt: string;
  storagePathElement: string;
  likeCount: number;
}

export interface Like {
  isLiked: boolean;
  photoId: number;
}

export interface LikedPhotos {
  likedPhotos: string[];
}
