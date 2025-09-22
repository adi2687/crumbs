import { useState, useEffect } from "react";
import UsersOnline from "../../Hooks/onlineusers";
const Joinnet = () => {
  const {peers,count}=UsersOnline()

  const handleSubmit = (e) => {
    e.preventDefault();
    const peerId = e.target.peerId.value;
    const address = e.target.address.value;
    console.log(peerId, address);
  };
  return (
    <div className="bg-white text-black">
      <h1>Crumbs</h1>
      <h2>{count} Online Peers</h2>

      {/* <ul>
        {peers.map((peer, index) => (
          <li key={index}>{peer.peerId} - {peer.address}</li>
        ))}
      </ul> */}
      <form onSubmit={handleSubmit}>
        {/* login form */}
        <div className="flex flex-col">
          <label htmlFor="peerId">Peer ID:</label>
          <input type="text" id="peerId" name="peerId" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="address">Email Address:</label>
          <input type="email" id="address" name="address" />
        </div>
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default Joinnet;
