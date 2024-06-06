import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";


const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, `getVideos`);
const getVideoByIdFunction = httpsCallable(functions, 'getVideoById');
const updateLikesFunction = httpsCallable(functions, 'updateVideoLikes');
const updateDislikesFunction = httpsCallable(functions, 'updateVideoDislikes');
const getUserByIdFunction = httpsCallable(functions, 'getUserById');
const getCommentsByIdFunction = httpsCallable(functions, 'getCommentsById');
const setCommentsByIdFunction = httpsCallable(functions, 'setCommentsById');


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

interface Comment {
    text: string;
    user: string;
    comments: Array<Comment>
    id: string;
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

export async function getCommentsById(id: any) {
    const response = await getCommentsByIdFunction({id});
    return response.data as Comment[]
}

export async function setCommentsById(id: any, commentData: any) {
    const response = await setCommentsByIdFunction({id, commentData});
    return response;
}