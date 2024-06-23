'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper} from "../Utilities/firebase/firebase";
import { User } from "firebase/auth";
import UploadIcon from "./upload";
import { FaYoutube } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
    // init user state
    const [user, setUser] = useState<User | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });


        // Cleanup subscription on unmount
        return () => unsubscribe();
    });

    return (
        <nav className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-6">
                <div><Rowbar/></div>
                <Link href="/">
                <div className="flex items-center gap-1">
                        <FaYoutube size={30} className="text-red-500"/>
                        <span className="text-xl">YouTube</span>
                </div>
                </Link>
            </div>
            <div className="flex justify-center w-full max-w-xl">
                <input
                placeholder="Search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full px-4 py-2 text-zinc-200 bg-zinc-900 border-[1px] border-zinc-700 focus:bg-black rounded-tl-full rounded-bl-full focus:outline-none focus:ring-[1px] focus:ring-sky-500 placeholder:text-zinc-400"/>
                <div className="px-4 py-2 bg-zinc-900 border-[1px] border-zinc-700 text-zinc-200 rounded-tr-full rounded-br-full focus:outline-none focus:ring-[1px] focus:ring-sky-500 hover:bg-zinc-700">
                    <SearchButton/></div>
            </div>
            <div className="flex items-center gap-6">
                {user && <UploadIcon />}
                <SignIn user={user} />
            </div>
        </nav>
    );
}


function Rowbar() {
    return (
        <div><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
        </div>
    );
}

function SearchButton() {
    return (
        <button className="px-4 py-2">
            <FaSearch size={18}/>
        </button>
    );
}

