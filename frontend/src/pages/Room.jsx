import React, { useCallback, useEffect, useState } from "react"
import { useSocket } from "../providers/Socket"
import { usePeer } from "../providers/Peer";
import ReactPlayer from "react-player";

const Room = () => {

    const { socket } = useSocket();
    const {peer , createOffer , createAnswer , setRemoteAnswer ,sendStream , remoteStream} = usePeer();
    const [mystream , setMyStream] = useState(null);
    const [remoteEmailId , setRemoteEmailId] = useState("");

    const handleUserJoined = useCallback(async ({emailId}) => {
        console.log(`User is joined , email ${emailId}`);

        const offer = await createOffer();
        socket.emit("call-user" , {emailId , offer});
        setRemoteEmailId(emailId);
    },[socket , createOffer]);

    const handleIncomingCall = useCallback(async (data) => {

        const {from , offer} = data;
        console.log(`Offer from email ${from}`)
        const answer = await createAnswer(offer);
        socket.emit("call-accepted" , {emailId : from , answer});
        setRemoteEmailId(from);

    },[socket , createAnswer]);

    const handleCallAccepted = useCallback(async (data) => {
        const {answer} = data;
        console.log(`Call got accepted ${answer}`)
        await setRemoteAnswer(answer);
    }, [])

    const getUserMediaStream = useCallback(async() => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio : true,
            video : true
        });
        setMyStream(stream);
    },[])

    const handleNegotiation = useCallback(async () => {
        const localOffer = await createOffer();
        await peer.setLocalDescription(localOffer);
        socket.emit("call-user", { emailId: remoteEmailId, offer: localOffer });
    }, [peer.localDescription , remoteEmailId , socket]);

    useEffect(() => {
        socket.on("user-joined" , handleUserJoined);
        socket.on("incoming-call" , handleIncomingCall);
        socket.on("call-accepted", handleCallAccepted);

        return () => {
            socket.off("user-joined" , handleUserJoined);
            socket.off("incoming-call" , handleIncomingCall);
            socket.on("call-accepted", handleCallAccepted); 
        }
    }, [handleUserJoined , handleIncomingCall, handleCallAccepted ,socket])

    useEffect(() => {
        getUserMediaStream();
    }, [getUserMediaStream]);

    useEffect(() => {
        peer.addEventListener("negotiationneeded",handleNegotiation);

        return () => {
            peer.removeEventListener("negotiationneeded",handleNegotiation);
        }
    },[peer , handleNegotiation])

    return (
        <div>
            Room page
            <button onClick={(e) => sendStream(mystream)}>Share myself</button>
            <ReactPlayer url={mystream} playing muted/>
            <ReactPlayer url={remoteStream} playing muted/>
        </div>
    )
}


export default Room