import { useEffect, useState } from 'react';
import { socket } from '../socket';
import { FaCopy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoadScreen = () => {
    const [roomId, setRoomId] = useState('');
    const [usernames, setUsernames] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const handleRoomCreated = (data) => {
            setUsernames((prev) => {
              console.log(data)
              return [...prev,data.user]
            })
            setRoomId(data.roomId);
            localStorage.setItem('roomId', data.roomId)
        };

        const handleConnected = (data) => {
            localStorage.setItem("roomId", data.roomId);
          navigate('/game')
        }

        socket.on('roomCreated', handleRoomCreated);
        socket.on('connected',handleConnected);

        return () => {
            socket.off('roomCreated', handleRoomCreated);
            socket.off('connected', handleConnected);
        };
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomId);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black relative">
            {/* Loading Spinner */}
            <div className="border-t-4 border-white border-solid rounded-full w-16 h-16 animate-spin"></div>

            {/* Room ID and Copy Icon */}
            {roomId && (
                <div className="absolute top-4 left-4 text-white">
                    <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded">
                        <span>Room ID: {roomId}</span>
                        <button onClick={copyToClipboard} className="text-white">
                            <FaCopy />
                        </button>
                    </div>
                </div>
            )}

            {/* Usernames in the top right corner */}
            <div className="absolute top-4 right-4 text-white text-right">
                <div className="font-bold mb-2">Connected Users:</div>
                {usernames.map((user, index) => (
                    <div key={index} className="flex items-center bg-gray-800 p-2 mb-2 rounded min-w-[200px]">
                        <img src={user.imageUrl} alt={user.userName} className="w-10 h-10 rounded-full mr-2" />
                        <div className="text-gray-300">{user.userName}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoadScreen;