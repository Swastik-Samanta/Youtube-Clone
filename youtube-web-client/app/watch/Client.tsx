"use client"
import styles from "./WatchPage.module.css";
import React, { Suspense, useEffect, useState } from "react";
import { getVideoById, getVideos, updateDisikes, updateLikes } from "../Utilities/firebase/functions";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import WatchPage from "./WatchPage";



export default function Page() {
    const videoPrefix = 'https://storage.googleapis.com/swaz-yt-processed-videos/';
    const searchParams = useSearchParams();
    const videoSrc = searchParams.get("v");
    const firstHalf = videoSrc?.split("-")[1];
    const secondHalf = videoSrc?.split("-")[2].split(".")[0];
    const videoId = `${firstHalf}-${secondHalf}`;
  

    return (
            <div className={styles.videoContainer}>
            <Suspense fallback={<div>Loading...</div>}>
                <WatchPage videoId={videoId}/>
            </Suspense>
            </div>
        
    );
}
