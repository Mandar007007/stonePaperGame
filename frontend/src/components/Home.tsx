import { useState } from 'react';
import { socket } from '../socket';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [showInput, setShowInput] = useState(false);
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = async () => {
        try {
            socket.emit("createRoom", {
                user: {
                    userName: "User1",
                    imageUrl: "https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue.png"
                }
            });
            navigate('/loading');
        } catch (err) {
            console.log("Create Room error: " + err);
        }
    };

    const handleJoinRoom = async () => {
        try {
            socket.emit("joinRoom", { roomId, user: {
              userName: "User2",
              imageUrl: "https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue.png"
          }});
            navigate('/loading');
        } catch (err) {
            console.log("Join Room error: " + err);
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center flex-col bg-black">
            <button 
                onClick={handleCreateRoom} 
                className="w-40 mb-4 px-4 py-2 text-white border border-white bg-transparent hover:bg-white hover:text-black hover:shadow-[0_0_10px_white] transition-all duration-300"
            >
                Create Room
            </button>
            <button 
                onClick={() => setShowInput(!showInput)} 
                className="w-40 px-4 py-2 text-white border border-white bg-transparent hover:bg-white hover:text-black hover:shadow-[0_0_10px_white] transition-all duration-300"
            >
                Join Room
            </button>
            {showInput && (
                <div className="mt-4 flex flex-col items-center">
                    <input
                        type="text"
                        placeholder="Enter Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="mb-4 px-4 py-2 border border-white bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button 
                        onClick={handleJoinRoom} 
                        className="px-4 py-2 text-white border border-white bg-transparent hover:bg-white hover:text-black hover:shadow-[0_0_10px_white] transition-all duration-300"
                    >
                        Join
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
