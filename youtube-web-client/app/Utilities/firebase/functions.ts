import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";


const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, `getVideos`);
const getVideoByIdFunction = httpsCallable(functions, 'getVideoById');
const updateLikesFunction = httpsCallable(functions, 'updateVideoLikes');
const updateDislikesFunction = httpsCallable(functions, 'updateVideoDislikes');
const getUserByIdFunction = httpsCallable(functions, 'getUserById');


export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string
    likes?: number | 0;
    dislikes?: number | 0;
    views?: number | 0;
    comments?: Comment[];
}

export interface Comment {
  id: string;
  username: string;
  text: string;
}

export interface User {
    uid: string,
    email: string,
    photoUrl: string,
    name: string
}


export async function uploadVideo(file: File) {
    const response: any = await generateUploadUrl({
        fileExtension: file.name.split(".").pop()
    });

    // Upload the file via the signed url
    const uploadResult = await fetch(response?.data?.url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type
        }
    });
    return uploadResult;
}

export async function getVideos() {
    const response = await getVideosFunction();
    return response.data as Video[];
}

export async function getVideoById(videoId: string) {
    const response = await getVideoByIdFunction({ videoId });
    return response.data as Video;
}

export async function updateLikes(videoId: string) {
    const response = await updateLikesFunction({ videoId });
    return response;
}

export async function updateDisikes(videoId: string) {
    const response = await updateDislikesFunction({ videoId });
    return response;
}

export async function getUserById(uid: any) {
    const response = await getUserByIdFunction({uid});
    return response.data as User;
}