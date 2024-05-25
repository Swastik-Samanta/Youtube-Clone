import React from "react";
import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/">
                <span className={styles.logoContainer}>
                    <Image width={90} height={20}
                    src="/youtube-logo.svg" alt="YouTube Logo" />
                </span>
            </Link>
        </nav>
    );
}