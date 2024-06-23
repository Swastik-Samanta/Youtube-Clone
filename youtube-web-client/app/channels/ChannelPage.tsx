import { AppUser, getUserById, saveDescription } from "../Utilities/firebase/functions";
import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "../Utilities/firebase/firebase";
import { User } from "firebase/auth";

export default function ChannelPage({ channelId }: any) {
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

        getUser();
        return () => unsubscribe();
    }, [channelId]);

    const save = async () => {
        await saveDescription(channelId, description);
        setDescription(user?.description || "");
    }

    return (
        <main className="p-4 bg-zinc-900 text-zinc-200 min-h-screen flex flex-col items-center">
            <div className="relative h-48 w-full max-w-4xl mb-6">
                <Image src="/default-banner.jpg" alt="banner" layout="fill" objectFit="cover" className="rounded-lg shadow-lg" />
            </div>
            <div className="flex flex-col md:flex-row items-center bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                    <img src={user?.photoUrl} alt="Profile" className="w-24 h-24 rounded-full" />
                    <div className="text-xl font-semibold ml-4">{user?.email.split("@")[0]}</div>
                </div>
                <div className="flex flex-col flex-grow ml-4">
                    <textarea
                        value={description}
                        placeholder="Add a description..."
                        className="w-full p-3 bg-zinc-700 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
                        onChange={(event) => setDescription(event.target.value)}
                        disabled={!(user?.uid === current?.uid)}
                        rows={4}
                        style={{ overflow: 'hidden' }}
                    />
                    {user?.uid === current?.uid && (
                        <button
                            onClick={save}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 self-start"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                            </svg>
                            <span>Save</span>
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}
