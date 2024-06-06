import Image from "next/image";
import { getVideos } from "./Utilities/firebase/functions";
import Link from "next/link";
import styles from './page.module.css';



export default async function Home() {
  const videos = await getVideos();

  console.log(videos);

  return (
    <main className={styles.container}>
      {
        videos.map((video) => (
          <Link href={`watch?v=${video.filename}`}>
            <div className={styles.videoItem}>
                <Image src={`/thumbnail.png`} alt='video' width={120} height={80} className={styles.thumbnail}/>
              <div className={styles.title}>{video.title}</div>
            </div>
          </Link>
        ))
      }
      
    </main>
  );
}
