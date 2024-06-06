import { getVideos } from "../Utilities/firebase/functions";
import WatchPage from "./WatchPage";
import styles from "./WatchPage.module.css"
import Link from "next/link";
import Image from "next/image";
import Page from "./Client";

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