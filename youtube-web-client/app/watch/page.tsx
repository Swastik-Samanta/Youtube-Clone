"use client"
import WatchPage, { RelatedFeed } from "./WatchPage";
import styles from "./WatchPage.module.css";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";



export default function Page() {
  const videoPrefix = 'https://storage.googleapis.com/swaz-yt-processed-videos/';
  const videoSrc = useSearchParams().get('v');
  const firstHalf = videoSrc?.split("-")[1]
  const secondHalf = videoSrc?.split("-")[2].split(".")[0];
  const videoId = firstHalf + "-" + secondHalf;

    return (
        <main className={styles.container}>
            <div className={styles.videoContainer}>
            <Suspense fallback={<div>Loading...</div>}>
                <WatchPage videoId={videoId}/>
            </Suspense>
            </div>
            <div className={styles.relatedFeedContainer}>
                <RelatedFeed/>
            </div>
        </main>
        
    );
}
