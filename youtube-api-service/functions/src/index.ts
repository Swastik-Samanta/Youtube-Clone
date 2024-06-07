import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {FieldValue, Firestore} from "firebase-admin/firestore";
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
    name: user.displayName
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

  export const getVideoById = functions.https.onCall(async (data, context) => {
    const snapshot = firestore.collection(videoCollectionId).doc(JSON.parse(JSON.stringify(data)).videoId);
    return (await snapshot.get()).data();
  })


  export const updateVideoLikes = functions.https.onCall(async (data, context) => {
    logger.info(`Data passed in ${JSON.stringify(data)}`);
    const videoRef = firestore.collection(videoCollectionId).doc(JSON.parse(JSON.stringify(data)).videoId);
    const response = await videoRef.update({ likes: FieldValue.increment(1) });
    return response;
  });

  export const updateVideoDislikes = functions.https.onCall(async (data, context) => {
    logger.info(`Data passed in ${JSON.stringify(data)}`);
    const videoRef = firestore.collection(videoCollectionId).doc(JSON.parse(JSON.stringify(data)).videoId);
    const response = await videoRef.update({ dislikes: FieldValue.increment(1) });
    return response;
  });
  
  export const getUserById = functions.https.onCall(async (data, context) => {
    logger.info(`Data passed in ${JSON.stringify(data)}`);
    const userRef = firestore.collection("users").doc(JSON.parse(JSON.stringify(data)).uid);
    return (await userRef.get()).data();
  })

  export const saveDescription = functions.https.onCall(async (data, context) => {
    logger.info(`Data passed in ${JSON.stringify(data)}`);
    const {id, description} = data;
    logger.info(`Channel ID: ${id}`);
    logger.info(`Description Data: ${JSON.stringify(description)}`);
    const userRef = firestore.collection("users").doc(id);
    const response = await userRef.update({description: description});
    return response;
  })

  export const getCommentsById = functions.https.onCall(async (data, context) => {
    logger.info(`Data passed in ${JSON.stringify(data)}`);
    const commentRef = firestore.collection("comments").doc(JSON.parse(JSON.stringify(data)).id);
    const response = (await commentRef.get()).data()?.comments;
    logger.info(`Response: ${response}`);
    return response;
  })

  export const setCommentsById = functions.https.onCall(async (data, context) => {
    logger.info(`Data passed in ${JSON.stringify(data)}`);
    const {id, commentData} = data;
    logger.info(`Comment ID: ${id}`);
    logger.info(`Comment Data: ${JSON.stringify(commentData)}`);
    const commentRef = firestore.collection("comments").doc(id);
    const response = await commentRef.set({comments: FieldValue.arrayUnion(commentData)}, {merge: true});
    logger.info(`Response: ${response}`);
    return response;
  })
