import styles from "./WatchPage.module.css"
import { AppUser, Video, getUserById, getVideoById } from "../Utilities/firebase/functions";
import { LikeDislike } from "./LikeDislike";
import Link from "next/link";
import { useEffect, useState } from "react";

export default async function WatchPage({videoId}: any) {
  const videoPrefix = 'https://storage.googleapis.com/swaz-yt-processed-videos/';
  const video = await getVideoById(videoId);


  return (
    <main>
          <div className={styles.videoWrapper}>
              <video controls src={videoPrefix + video.filename} className={styles.video}/>
          </div>
          <h1 className={styles.videoTitle}>{video.title}</h1>
          <div className={styles.titleLikeDislikeContainer}>
          <ProfilePic video={video}/>
            <div  className={styles.LikeDislikeContainer}>
                <LikeDislike video={video}/>
            </div>
          </div>
          <Description video={video}/>
    </main>
          
  );
}




export function Description({ video }: any) {
    return (
      <main className={styles.descriptionBox}>
        <h2 className={styles.descriptionHeading}>Description</h2>
        <p className={styles.description}>{video.description}</p>
      </main>
    );
}



export function ProfilePic( { video }: any) {
  const [user, setUser] = useState<AppUser | null>(null);
  useEffect(() => {
        

    const getUser = async () => {
        const user = await getUserById(video.uid);;
        setUser(user);
    }
    

    getUser()

  }, [video]);
  return (
    <main className={styles.profileContainer}>
      <Link href={`channels?u=${user?.uid}`}>
      <div className={styles.profileWrapper}>
            <img src={user?.photoUrl} className={styles.profilePic} width={40} height={40}></img>
          <div className={styles.userName}>{user?.email.split("@")[0]}</div>
      </div>
      </Link>
    </main>
  );
}






  
