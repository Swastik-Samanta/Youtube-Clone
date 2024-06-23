import { getVideos } from "../Utilities/firebase/functions";
import Page from "./client";
import Link from "next/link";
import Image from "next/image";
import styles from "./ChannelPage.module.css"
import { VideoComponent } from "../page";


export default function app() {
    return (
        <main className="">
          <div className="flex flex-col gap-1">
            <Page/>
            <ChannelFeed/>
          </div>
        </main>
    );
}


export async function ChannelFeed() {
    const videos = await getVideos();
  
    console.log(videos);
  
    return (
      <main className="p-4 bg-zinc-900 text-zinc-200 min-h-screen flex flex-col items-center">
        <div className="flex gap-10 flex-row flex-wrap md:flex-row">
          {videos.map((video) => (
              <VideoComponent video={video}/>
            ))
          }
        </div>
        
      </main>
    );
  }