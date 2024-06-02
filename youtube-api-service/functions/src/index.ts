import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "swaz-yt-raw-videos";
const videoCollectionId = 'videos';

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string
  likes?: number;
  dislikes?: number;
  views?: number;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  username: string;
  text: string;
}

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});


export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
    // Check if the user is authentication
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }
  
    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);
  
    // Generate a unique filename for upload
    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;
  
    // Get a v4 signed URL for uploading file
    const [url] = await bucket.file(fileName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
  
    return {url, fileName};
  });

  export const getVideos = onCall({maxInstances: 1},  async () => {
    const snapshot = await firestore.collection(videoCollectionId).limit(10).get();
    return snapshot.docs.map((doc) => doc.data());
  });

  export const updateVideoLikes = async (videoId: string, newLikes: number) => {
    const videoRef = firestore.collection(videoCollectionId).doc(videoId);
    await videoRef.update({ likes: newLikes });
  };
  
  export const updateVideoDislikes = async (videoId: string, newDislikes: number) => {
    const videoRef = firestore.collection(videoCollectionId).doc(videoId);
    await videoRef.update({ dislikes: newDislikes });
  };

  export const getVideoById = functions.https.onCall(async (data, context) => {
    const { videoId } = data;
  
    if (!videoId) {
      throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a videoId.');
    }
  
    try {
      const videoRef = firestore.collection(videoCollectionId).doc(videoId);
      const videoDoc = await videoRef.get();
  
      if (!videoDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Video not found');
      }
  
      const videoData = videoDoc.data();
      return videoData;
    } catch (error) {
      throw new functions.https.HttpsError('unknown', 'Fetching failed');
    }
  });