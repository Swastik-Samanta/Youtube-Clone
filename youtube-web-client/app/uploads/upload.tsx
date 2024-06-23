'use client';

import { Fragment, useState } from "react";


import styles from "./upload.module.css";
import { uploadVideo } from "../Utilities/firebase/functions";

export default function Upload() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.item(0);
        if (file) {
            handleUpload(file);
        }
    }

    const handleUpload = async (file: File) => {
        try {
            const response = await uploadVideo(file);
            alert(`File uploaded successfully. Response: ${JSON.stringify(response)}`);
        } catch (error) {
            alert(`Failed to upload file: ${error}`);
        }
    }


    return (
        <main className={styles.container}>
            <div className={styles.inputGroup}>
                    <label htmlFor="title" className={styles.label}>Title</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.textInput} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="description" className={styles.label}>Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.textareaInput} />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="thumbnail" className={styles.label}>Thumbnail</label>
                    <input id="thumbnail" type="file" accept="image/*"  className={styles.fileInput} />
                </div>
                <div className={styles.inputGroup}>
                    <Fragment>
                        <input id="upload" className={styles.uploadInput} type="file" accept="video/" 
                            onChange={handleFileChange}
                        />
                        <label htmlFor="upload" className={styles.uploadButton}>
                            Upload Video
                        </label>
                    </Fragment>
                </div>
        </main>
    );
}