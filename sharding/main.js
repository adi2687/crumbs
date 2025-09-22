const fs = require("fs");
const path = require("path");

function splitImage(imagePath, chunkSize) {
    const fileName = path.basename(imagePath);
    const fileBuffer = fs.readFileSync(imagePath);
    const totalSize = fileBuffer.length;

    let start = 0;
    let part = 1;

    while (start < totalSize) {
        const end = Math.min(start + chunkSize, totalSize);
        const chunk = fileBuffer.slice(start, end);
        fs.writeFileSync(`${fileName}.part${part}`, chunk);
        console.log(`Created: ${fileName}.part${part} (${chunk.length} bytes)`);
        start = end;
        part++;
    }
}
splitImage("aryan.webp", 5 * 1024);