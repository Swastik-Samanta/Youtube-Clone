import express from "express";


const app = express();
app.use(express.json()); // allows use of JSON w/ REST APIs


// Makes sure ffmpeg is installed locally and path is set
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);


app.post("/process-video", (req, res) => {
    // Get path of the input video file from the request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath || !outputFilePath) {
        res.status(400).send("Bad Request: Missing file path.");
    }

    ffmpeg(inputFilePath)
        .outputOptions('-vf', "scale=-1:360") // converting to 360p
        .on("end", () => {
            console.log("Processing finished successfully.");
            res.status(200).send("Video processing finished successfully.");
        })
        .on("error", (err: any) => {
            console.log(`An error occurred: ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});