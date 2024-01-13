import { createContext , useCallback, useContext , useEffect, useMemo, useState} from "react";

const PeerContext = createContext(null);

export const usePeer = () => {
    return useContext(PeerContext);
}

export const PeerProvider = (props) => {

    const [remoteStream , setRemoteStream] = useState(null);
    const peer = useMemo(() => {
        return new RTCPeerConnection() // this basically provides the public ip to the peer using some ice servers
    }, []);

    // creates an offer - sets SDP
    const createOffer = async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }

    const createAnswer = async(offer) => {
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    }

    const setRemoteAnswer = async(answer) => {
        await peer.setRemoteDescription(answer);
    }

    const sendStream = async(stream) => {
        const tracks = stream.getTracks();
        for(const track of tracks){
            peer.addTrack(track,stream);
        }
    }

    const handleTrackEvent = useCallback((e) => {
            const streams = e.streams;
            setRemoteStream(streams[0]);
    },[]);

    useEffect(() => {
        peer.addEventListener("track" ,handleTrackEvent);
        
        
        return () => {
            peer.removeEventListener("track",handleTrackEvent);
            
        }
    },[peer])
    return (
        <PeerContext.Provider value={{peer , createOffer , createAnswer, setRemoteAnswer , sendStream , remoteStream}}>
            {props.children}
        </PeerContext.Provider>
    )
}