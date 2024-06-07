import { getVideos } from "../Utilities/firebase/functions";
import Page from "./client";
import Link from "next/link";
import Image from "next/image";
import styles from "./ChannelPage.module.css"


export default function app() {
    return (
        <main>
            <Page/>
            <ChannelFeed/>
        </main>
    );
}


export async function ChannelFeed() {
    const videos = await getVideos();
  
    console.log(videos);
  
    return (
      <main className={styles.channelFeedContainer}>
        {
          videos.map((video) => (
            <Link href={`watch?v=${video.filename}`}>
              <div className={styles.videoItem}>
                  <Image src={`/thumbnail.png`} alt='video' width={120} height={80} />
                <div className={styles.title}>{video.title}</div>
              </div>
            </Link>
          ))
        }
        
      </main>
    );
  }