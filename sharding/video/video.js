const fs = require("fs");
const path = require("path");

function splitVideo(filePath, chunkSizeMB) {
    const chunkSize = chunkSizeMB * 1024 * 1024; // MB → bytes
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    const totalSize = fileBuffer.length;

    console.log(`Total file size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

    let start = 0;
    let part = 1;

    while (start < totalSize) {
        const end = Math.min(start + chunkSize, totalSize);
        const chunk = fileBuffer.slice(start, end);
        const chunkName = `${fileName}.part${part}`;

        fs.writeFileSync(chunkName, chunk);
        console.log(`Created chunk: ${chunkName} (${(chunk.length / 1024 / 1024).toFixed(2)} MB)`);

        start = end;
        part++;
    }
}

// Example usage: split into 50 MB chunks
splitVideo("backinblack.mp4", 2);
