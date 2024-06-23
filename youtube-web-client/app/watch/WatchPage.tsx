import styles from "./WatchPage.module.css"
import { AppUser, Video, getUserById, getVideoById } from "../Utilities/firebase/functions";
import { LikeDislike } from "./LikeDislike";
import Link from "next/link";
import { useEffect, useState } from "react";


export default async function WatchPage({ videoId }: any) {
    const videoPrefix = 'https://storage.googleapis.com/swaz-yt-processed-videos/';
    const video = await getVideoById(videoId);

    return (
        <main className="p-4 bg-zinc-900 text-zinc-200 min-h-screen">
            <div className="w-full max-w-4xl mx-auto">
                <div className="mb-4">
                    <div className="relative"> {/* 16:9 Aspect Ratio */}
                        <video controls src={`${videoPrefix}${video.filename}`} className="top-0 left-0 w-full max-h-[500px] rounded-lg shadow-lg" />
                    </div>
                </div>
                <h1 className="text-2xl font-semibold mb-2">{video.title}</h1>
                <div className="flex items-center justify-between mb-4">
                    <ProfilePic video={video} />
                    <div className="flex items-center">
                        <LikeDislike video={video} />
                    </div>
                </div>
                <Description video={video} />
            </div>
        </main>
    );
}

function Description({ video }: any) {
    return (
        <section className="p-4 bg-zinc-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-sm">{video.description}</p>
        </section>
    );
}

function ProfilePic({ video }: any) {
    const [user, setUser] = useState<AppUser | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const user = await getUserById(video.uid);
            setUser(user);
        };

        getUser();
    }, [video]);

    if (!user) {
        return null;
    }

    return (
        <Link href={`channels?u=${user.uid}`}>
            <div className="flex items-center gap-2 cursor-pointer">
                <img src={user.photoUrl} alt="ProfilePic" className="w-10 h-10 rounded-full" />
                <div className="text-sm">{user.email.split("@")[0]}</div>
            </div>
        </Link>
    );
}






  
