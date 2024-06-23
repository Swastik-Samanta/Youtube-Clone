"use client"
import Image from "next/image";
import { AppUser, Video, getUserById, getVideos } from "./Utilities/firebase/functions";
import Link from "next/link";
import styles from './page.module.css';
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "./Utilities/firebase/firebase";
import { User } from "firebase/auth";



export default function Home() {
  const [videos, setVideos] = useState<Array<Video>>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect( () => {

    const get = async () => {
      const fetched = await getVideos();
      setVideos(fetched);
    }
    get()
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
        setUser(user);
    });


    // Cleanup subscription on unmount
    return () => unsubscribe();
});

  console.log(videos);

  return (
    <main className="flex-1">
      <div className="flex gap-10 flex-row flex-wrap md:flex-row">
        {videos.map((video) => (
            <VideoComponent video={video}/>
          ))
        }
      </div>
      
    </main>
  );
}


export function VideoComponent( { video }: any) {


  return (
    <div className="flex flex-col gap-3 w-[340px]">
            <Link href={`watch?v=${video.filename}`}>
                <div className="flex flex-col gap-3">
                  <div className=""><Image src={`/thumbnail.png`} alt='thumbnail' width={340} height={180} className="rounded-lg"/></div>
                  <div className="flex flex-col gap-3">
                  <span  className="font-semibold truncate w-150">{video.title}</span>
                    <Profile video={video}/>
                  </div>
                </div>
            </Link>
    </div>
  );
}


export function Profile( { video }: any) {
  const [user, setUser] = useState<AppUser | null>(null);
  useEffect(() => {
        

    const getUser = async () => {
        const user = await getUserById(video.uid);
        setUser(user);
    }
    

    getUser()

  }, [video]);

  if (!user) {
    return null;
  }

  return (
    <main className="flex items-center">
      <Link href={`channels?u=${user?.uid}`}>
      <div className="flex items-center gap-2">
            <img src={user?.photoUrl} alt="ProfilePic" className="w-8 h-8 rounded-full"></img>
          <div className="text-sm text-zinc-400">{user?.email.split("@")[0]}</div>
      </div>
      </Link>
    </main>
  );
}
