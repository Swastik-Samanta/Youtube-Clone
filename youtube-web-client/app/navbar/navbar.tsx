'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper} from "../Utilities/firebase/firebase";
import { User } from "firebase/auth";
import Upload from "./upload";

export default function Navbar() {
    // init user state
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });


        // Cleanup subscription on unmount
        return () => unsubscribe();
    });

    return (
        <nav className={styles.nav}>
            <Link href="/">
                <span className={styles.logoContainer}>
                    <Image width={90} height={20}
                    src="/youtube-logo.svg" alt="YouTube Logo" />
                </span>
            </Link>
            {
                user && <Upload />
            }
            <SignIn user={user}></SignIn>
        </nav>
    );
}