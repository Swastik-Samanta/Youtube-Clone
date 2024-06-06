import { User, getUserById } from "../Utilities/firebase/functions";
import Image from "next/image";
import styles from "./ChannelPage.module.css";
import { useEffect, useState } from "react";

export default function ChannelPage({channelId}: any) {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        

        const getUser = async () => {
            const newUser = await getUserById(channelId);
            setUser(newUser);
        }
        

        getUser()

    }, [channelId]);

  
  
    return (
      <main className={styles.container}>
        <div className={styles.bannerContainer}>
            <Image src={`/default-banner.jpg`} alt='banner' layout="fill" objectFit="cover" className={styles.banner}/>
        </div>
        <div className={styles.profileAndDescription}>
                <div className={styles.profileContainer}>
                    <img src={user?.photoUrl} alt="profile" className={styles.profilePicture} />
                    <div className={styles.username}>{user?.email.split("@")[0]}</div>
                </div>
                <textarea placeholder="Add a description..." className={styles.descriptionInput}></textarea>
            </div>
      </main>
            
    );
  }
  