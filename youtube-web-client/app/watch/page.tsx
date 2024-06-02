"use client"
import React from "react";
import { useSearchParams } from "next/navigation";
import { User } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";
import { Video, getVideos } from "../Utilities/firebase/functions";
import styles from "./page.module.css"
import { onAuthStateChangedHelper } from "../Utilities/firebase/firebase";

async function RelatedFeed() {
    const videos = await getVideos();
    return (
      <main className={styles.relatedFeedContainer}>
        {
          videos.map((video) => (
            <Link href={`watch?v=${video.filename}`}>
              <Image src={`/thumbnail.png`} alt='video' width={120} height={80} className={styles.thumbnail}/>
              <div>{video.title}</div>
            </Link>
          ))
        }
  
      </main>
    );
  }

export default function Watch() {
    const videoPrefix = 'https://storage.googleapis.com/swaz-yt-processed-videos/';
    const videoSrc = useSearchParams().get('v');
    const videoId = useSearchParams().get('v')?.split("-")[1].split(".")[0];
    
    return (
        <main className={styles.container}>

            <div className={styles.videoWrapper}>
                <video controls src={videoPrefix + videoSrc} className={styles.video}/>
                    <LikeDislike videoId={videoId}/>

                
            </div>

            <div className={styles.RelatedFeed}>
                <RelatedFeed/>
            </div>
            

        </main>
        
    );
}

async function LikeDislike(videoId: any) {
    const videos = await getVideos();
    
    const selectedVideo = videos.find((vid) => vid.id === videoId);

    return (
      <main>
        <div>
          <button>Like</button>
          {selectedVideo?.likes}
          <button>Dislike</button>
          {selectedVideo?.dislikes}
        </div>
      </main>
    );
}




  
