import {useState,useEffect} from 'react'

const UsersOnline = () => {
    const backend_port = import.meta.env.VITE_BACKEND_PORT || 7000; 
    const backend_address = import.meta.env.VITE_BACKEND_ADDRESS || "localhost";
    const [peers, setPeers] = useState([]); 
    const [count,setCount]=useState(0)
    const baseAddress = `http://${backend_address}:${backend_port}`;
  
    useEffect(() => {
      const fetchPeers = async () => {
        try {
          const res = await fetch(`${baseAddress}/peers`);
          const data = await res.json();
          setPeers(data.online || []); 
          setCount(data.count)
          console.log("Fetched peers:", data.online);
        } catch (err) {
          console.error("Failed to fetch peers:", err);
        }
      };
  
      fetchPeers();
      const interval = setInterval(fetchPeers, 5000); // refresh every 5s
      return () => clearInterval(interval);
    }, [baseAddress]);
    return {peers,count}
} 
export default UsersOnline