import { getVideos } from "../Utilities/firebase/functions";
import styles from "./WatchPage.module.css"
import Link from "next/link";
import Image from "next/image";
import Page from "./Client";
import { VideoComponent } from "../page";

export default function app() {
    return (
      <main className={styles.container}>
        <Page/>
        <div className={styles.relatedFeedContainer}>
                <RelatedFeed/>
            </div>
      </main>
    );
}


export async function RelatedFeed() {
    const videos = await getVideos();
  
    return (
      <main className="flex flex-wrap flex-col gap-4">
        {
          videos.map((video) => (
            <VideoComponent video={video}/>
          ))
        }
  
      </main>
    );
  }