"use client"

import { IconType } from "react-icons";
import { TiHome } from "react-icons/ti";
import { MdSubscriptions } from "react-icons/md";
import { GrChannel } from "react-icons/gr";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "../Utilities/firebase/firebase";
import { User } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Item } from "firebase/analytics";

interface MenuItem {
    icon: IconType;
    text: string;
    pathname: string;
    id: string;
}




export default function Sidebar() {
     // init user state
     const [user, setUser] = useState<User | null>(null);

     useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });


        // Cleanup subscription on unmount
        return () => unsubscribe();
    });

    const [MenuItems, setMenuItems] = useState<Array<MenuItem>>([
        {
            icon: TiHome,
            text: "Home",
            pathname: "/",
            id: "/"
        },
        {
            icon: MdSubscriptions,
            text: "Subscriptions",
            pathname: "/subscriptions/undefined",
            id: "/subscriptions"
        },
        {
            icon: GrChannel,
            text: "Your Channel",
            pathname: "/channels/undefined",
            id: "/channels"
        },
    ]);

    useEffect(() => {
        if (user) {
            setMenuItems([
                {
                    icon: TiHome,
                    text: "Home",
                    pathname: "/",
                    id: "/"
                },
                {
                    icon: MdSubscriptions,
                    text: "Subscriptions",
                    pathname: `/subscriptions?u=${user.uid}`,
                    id: "/subscriptions"
                },
                {
                    icon: GrChannel,
                    text: "Your Channel",
                    pathname: `/channels?u=${user.uid}`,
                    id: "/channels"
                },
            ]);
        } else {
            setMenuItems([
                {
                    icon: TiHome,
                    text: "Home",
                    pathname: "/",
                    id: "/"
                },
                {
                    icon: MdSubscriptions,
                    text: "Subscriptions",
                    pathname: "/subscriptions/undefined",
                    id: "/subscriptions"
                },
                {
                    icon: GrChannel,
                    text: "Your Channel",
                    pathname: "/channels/undefined",
                    id: "/channels"
                },
            ]);
        }
    }, [user]);

    const pathname = usePathname();
    console.log("Pathname:", pathname)
    const router = useRouter();


    const handleItemClick = (item: MenuItem) => {
        router.push(item.pathname);
    }

    return (
        <div className="lg:w-[260px] p-1">
                {MenuItems.map((item) => (
                    <Link href={item.pathname}>
                        <div className={`flex flex-col lg:flex-row gap-1 lg:gap-6 p-4 lg:py-2 items-center hover:bg-zinc-700 
                            ${item.id === pathname && "bg-zinc-700 hover:bg-zinc-600"} rounded-lg cursor-pointer`} 
                            onClick={() => handleItemClick(item)}>
                            <item.icon/>
                            <span className="text-xs lg:text-base">{item.text}</span>
                        </div>
                    </Link>
                ))}
        </div>
    );
}