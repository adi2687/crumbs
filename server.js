const Websocket=require("ws"); 
const wss=new Websocket.Server({port:8080})
const clients=new Set(); 
wss.on('connection',ws=>{
    clients.add(ws);
    console.log('peer joined')
    ws.on('message',message=>{
        console.log('files send man')
        for (const client of clients){
            if (client!=ws && client.readyState===Websocket.OPEN){
                client.send(message);
            }
        }
    }) 

    ws.on('close',()=>{
        clients.delete(ws);
        console.log('peer gone')
    })
})

console.log('server on port 8080')