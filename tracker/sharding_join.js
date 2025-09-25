import fs from "fs";    
import path from "path";
import axios from "axios";

const SERVER = "http://192.168.137.249:7000"; // change to your server address

// Download a single shard from the server
async function downloadShard(serverFileName, savePath) {
    try {
        const res = await axios.get(`${SERVER}/files/${serverFileName}`, { responseType: "stream" });
        const writer = fs.createWriteStream(savePath);
        res.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", () => resolve(savePath));
            writer.on("error", reject);
        });
    } catch (err) {
        console.error(`Failed to download shard ${serverFileName}:`, err.message);
    }
}

// Merge shards using the shard map
async function mergeFile(filePath) {
    const mapFile = `${filePath}.map.json`;
    if (!fs.existsSync(mapFile)) {
        console.error("Shard map not found!");
        return;
    }

    const shards = JSON.parse(fs.readFileSync(mapFile));
    const outputFile = `merged_${path.basename(filePath)}`;
    const writeStream = fs.createWriteStream(outputFile);

    for (const shard of shards) {
        const shardPath = `temp_${shard.hash}.part`;
        // Download the shard first
        await downloadShard(shard.serverFile, shardPath);

        // Append shard to the output file
        const data = fs.readFileSync(shardPath);
        writeStream.write(data);

        // Remove temporary shard file
        fs.unlinkSync(shardPath);
    }

    writeStream.end();
    console.log(`File reconstructed: ${outputFile}`);
}

// Example usage
(async () => {
    await mergeFile("./aryan.png"); // use the same original filename
})();
