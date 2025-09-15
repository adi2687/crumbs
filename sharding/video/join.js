const fs=require("fs") 
function mergechunks(chunks,output){
    const name=(chunks[0].split('.')[0])
    output=`${name}restor.mp4`
    const buffers=chunks.map(file=>fs.readFileSync(file))
    const merged=Buffer.concat(buffers)
    fs.writeFileSync(output,merged)
    console.log(`Video successfully merged into: ${output}`)
}
mergechunks(["backinblack.mp4.part1", "backinblack.mp4.part2", "backinblack.mp4.part3", "backinblack.mp4.part4", "backinblack.mp4.part5"],"")
