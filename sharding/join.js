const fs = require("fs");

function mergeImageChunks(chunkFiles, outputPath) {
    const name=(chunkFiles[0].split('.')[0])
    outputPath=`${name}restor.png`
    const buffers = chunkFiles.map(file => fs.readFileSync(file));
    const merged = Buffer.concat(buffers);
    fs.writeFileSync(outputPath, merged);
    console.log(`Image successfully merged into: ${outputPath}`);
}

// Example usage
mergeImageChunks(
    ["aryan.webp.part1", "aryan.webp.part2", "aryan.webp.part3", "aryan.webp.part4", "aryan.webp.part5"],
    ""
);
