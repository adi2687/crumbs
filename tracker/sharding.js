import fs from "fs";
import crypto from "crypto";
import path from "path";
import axios from "axios";
import FormData from "form-data";
const address='192.168.137.249'
const port=7000
const SERVER = `http://${address}:${port}`; // change this
const CHUNK_SIZE = 100 * 1024; // 100 KB per shard

// Split file into shards
function splitFileStream(filePath, chunkSize = CHUNK_SIZE) {
    const fileName = path.basename(filePath);
    const readStream = fs.createReadStream(filePath, { highWaterMark: chunkSize });
    const shards = [];
    let part = 1;

    return new Promise((resolve) => {
        readStream.on("data", (chunk) => {
            const hash = crypto.createHash("sha256").update(chunk).digest("hex");
            const shardName = `${fileName}.${hash}.part${part}`;
            fs.writeFileSync(shardName, chunk);
            console.log(`Created shard: ${shardName} (${chunk.length} bytes)`);
            shards.push({ shardName, hash });
            part++;
        });

        readStream.on("end", () => resolve(shards));
    });
}

// Upload a shard to the server
async function uploadShard(shardFilePath) {
    const form = new FormData();
    form.append("file", fs.createReadStream(shardFilePath));
    const res = await axios.post(`${SERVER}/upload`, form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
    });
    console.log(`Uploaded shard: ${res.data.filename}`);
    return res.data.filename;
}

// Upload all shards
async function uploadFile(filePath) {
    const shards = await splitFileStream(filePath);

    const uploadedShards = [];
    for (const shard of shards) {
        const uploadedName = await uploadShard(shard.shardName);
        uploadedShards.push({ hash: shard.hash, serverFile: uploadedName });
        fs.unlinkSync(shard.shardName); // delete local shard
    }

    fs.writeFileSync(`${filePath}.map.json`, JSON.stringify(uploadedShards, null, 2));
    console.log("Shard map saved:", `${filePath}.map.json`);
}

// Merge shards back into original file
async function downloadShard(serverFileName, savePath) {
    const res = await axios.get(`${SERVER}/files/${serverFileName}`, { responseType: "stream" });
    const writer = fs.createWriteStream(savePath);
    res.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on("finish", () => resolve(savePath));
        writer.on("error", reject);
    });
}

async function mergeFile(filePath) {
    const mapFile = `${filePath}.map.json`;
    if (!fs.existsSync(mapFile)) throw new Error("Shard map not found!");

    const shards = JSON.parse(fs.readFileSync(mapFile));
    const outputFile = `merged_${path.basename(filePath)}`;
    const writeStream = fs.createWriteStream(outputFile);

    for (const shard of shards) {
        const shardPath = `temp_${shard.hash}.part`;
        await downloadShard(shard.serverFile, shardPath);
        const data = fs.readFileSync(shardPath);
        writeStream.write(data);
        fs.unlinkSync(shardPath);
    }

    writeStream.end();
    console.log(`File reconstructed: ${outputFile}`);
}

// Example usage
(async () => {
    await uploadFile("./aryan.png");    // Split and upload
    await mergeFile("./aryan.png");     // Download and merge
})();
