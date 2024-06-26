"use client"
import { useSearchParams } from "next/navigation";
import ChannelPage from "./ChannelPage";
import { Suspense } from "react";

export default function Page() {
    const videoPrefix = 'https://storage.googleapis.com/swaz-yt-processed-videos/';
    const searchParams = useSearchParams();
    const channelId = searchParams.get("u");
    


    return (
            <main>
                <Suspense fallback={<div>Loading...</div>}>
                    <ChannelPage channelId={channelId}/>
                </Suspense>
            </main>
        
    );
}