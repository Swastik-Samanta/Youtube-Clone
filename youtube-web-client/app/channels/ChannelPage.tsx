import { AppUser, getUserById, saveDescription } from "../Utilities/firebase/functions";
import Image from "next/image";
import styles from "./ChannelPage.module.css";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "../Utilities/firebase/firebase";
import { User } from "firebase/auth";


export default function ChannelPage({channelId}: any) {

    const [user, setUser] = useState<AppUser | null>(null);
    const [description, setDescription] = useState("");
    const [current, setCurrent] = useState<User | null>(null);
    
    useEffect(() => {

        const unsubscribe = onAuthStateChangedHelper((current) => {
            setCurrent(current);
        });

        const getUser = async () => {
            const newUser = await getUserById(channelId);
            setUser(newUser);
            setDescription(newUser.description || "");
        }


        

        getUser()
        // Cleanup subscription on unmount
        return () => unsubscribe();

    }, [channelId]);

    const save = async () => {
        await saveDescription(channelId, description);
        setDescription(user?.description || "");
    }
  
    return (
      <main className={styles.container}>
        <div className={styles.bannerContainer}>
            <Image src={`/default-banner.jpg`} alt='banner' layout="fill" objectFit="cover" className={styles.banner}/>
        </div>
        <div className={styles.profileAndDescription}>
                <div className={styles.profileContainer}>
                    <img src={user?.photoUrl} className={styles.profilePicture} />
                    <div className={styles.username}>{user?.email.split("@")[0]}</div>
                    {(user?.uid === current?.uid) && <button onClick={save} className={styles.saveButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                        </svg>
                        <div className={styles.saveText}>Save</div>
                    </button>}
                    <textarea 
                    value={description} placeholder="Add a description..." 
                    className={styles.descriptionInput} onChange={(event) => setDescription(event.target.value)} disabled={!(user?.uid === current?.uid)}/>
                </div>
            </div>
      </main>
            
    );
  }
  