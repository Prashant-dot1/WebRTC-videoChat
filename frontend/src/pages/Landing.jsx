import React, { useCallback, useEffect, useState } from 'react'
import '../App.css'
import { useSocket } from '../providers/Socket';
import { useNavigate } from 'react-router-dom';

const Landing = () => {

    const {socket} = useSocket();
    const [email , setEmail] = useState("");
    const [room, setRoom] = useState("");
    const pageRoute = useNavigate();
    
    const handleJoinRoom = () => {
        socket.emit("join-room", {roomId : room , emailId : email});
    }

    const handleRoomJoined = useCallback((roomId) => {
        console.log("Room joined")
        pageRoute(`/room/${roomId}`)
    }, [pageRoute]);

    useEffect(() => {
        socket.on("joined-room", handleRoomJoined)

        return () => {
            socket.off("joined-room",handleRoomJoined);
        }
    }, [handleRoomJoined ,socket])

    return (
        <div className="homepage-container">
            <div className="input-container">
                <input type="email" placeholder="Enter your email id" onChange={(e) => setEmail(e.target.value)}></input>
                <input type="text" placeholder="Enter Rood Id" onChange={(e) => setRoom(e.target.value)}></input>
                <button onClick={handleJoinRoom}>Enter Room</button>
            </div>
        </div>
    )
}

export default Landing