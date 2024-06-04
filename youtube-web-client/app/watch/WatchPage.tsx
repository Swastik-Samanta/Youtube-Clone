import React, { useEffect, useState } from "react";
import styles from "./WatchPage.module.css"
import { getUserById, getVideoById, updateDisikes, updateLikes } from "../Utilities/firebase/functions";
import Image from "next/image";
import { LikeDislike } from "./LikeDislike";
import Comments from "./Comments";

export default async function WatchPage({videoId}: any) {
  const videoPrefix = 'https://storage.googleapis.com/swaz-yt-processed-videos/';
  const video = await getVideoById(videoId);


  return (
    <main>
          <div className={styles.videoWrapper}>
              <video controls src={videoPrefix + video.filename} className={styles.video}/>
          </div>
          <h1 className={styles.videoTitle}>{video?.title}</h1>
          <div className={styles.titleLikeDislikeContainer}>
          <ProfilePic video={video}/>
            <div  className={styles.LikeDislikeContainer}>
                <LikeDislike video={video}/>
            </div>
          </div>
          <Description video={video}/>
          <Comments video={video}/>
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

export async function ProfilePic( { video }: any) {
  const user = await getUserById(video.uid);
  return (
    <main className={styles.profileContainer}>
      <div className={styles.profileWrapper}>
          <img src={user.photoUrl} className={styles.profilePic} width={40} height={40}></img>
          <div className={styles.userName}>{user.email.split("@")[0]}</div>
      </div>
    </main>
  );
}






  
