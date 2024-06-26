import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";

const GameScreen = () => {
    const [userPoints, setUserPoints] = useState(0);
    const [hasChoosen, setHasChoosen] = useState(false);
    const roomId = localStorage.getItem('roomId');
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('roundWin', (data) => {
            setUserPoints(prevPoints => Math.min(prevPoints + 1, 3));
            setHasChoosen(false); // Reset choice for the next round
        });

        socket.on('roundLose', (data) => {
            setHasChoosen(false); // Reset choice for the next round
        });

        socket.on('winnerConfirmed', (data) => {
            alert(data.message);
            navigate("/");
        });

        socket.on("looserConfirmed", (data) => {
            alert(data.message);
            navigate("/");
        });

        socket.on("draw",() => {
            setHasChoosen(false); 
        })

        return () => {
            socket.off('roundWin');
            socket.off('roundLose');
            socket.off('winnerConfirmed');
            socket.off('looserConfirmed');
        };
    }, [navigate]);

    useEffect(() => {
        if (userPoints === 3) {
            socket.emit('winner', { roomId });
        }
    }, [userPoints, roomId]);

    const handleChoice = (choice) => {
        if (!hasChoosen) {
            console.log(`User chose: ${choice}`);
            setHasChoosen(true);
            socket.emit('userChoise', { choice, roomId });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-black">
            <h1 className="text-4xl text-white mb-8">Rock Paper Scissors</h1>
            <div className="flex space-x-4 mb-8">
                <div 
                    className={`w-24 h-24 bg-white flex items-center justify-center rounded-full shadow-lg cursor-pointer ${hasChoosen ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300'}`}
                    onClick={() => handleChoice('rock')}
                >
                    <img src="rock.png" alt="Rock" className="w-12 h-12" />
                </div>
                <div 
                    className={`w-24 h-24 bg-white flex items-center justify-center rounded-full shadow-lg cursor-pointer ${hasChoosen ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300'}`}
                    onClick={() => handleChoice('paper')}
                >
                    <img src="paper.png" alt="Paper" className="w-12 h-12" />
                </div>
                <div 
                    className={`w-24 h-24 bg-white flex items-center justify-center rounded-full shadow-lg cursor-pointer ${hasChoosen ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300'}`}
                    onClick={() => handleChoice('scissors')}
                >
                    <img src="scissors.png" alt="Scissors" className="w-12 h-12" />
                </div>
            </div>
            <div className="flex space-x-2">
                {[...Array(3)].map((_, index) => (
                    <div 
                        key={index} 
                        className={`w-6 h-6 border-2 border-white rounded-full ${index < userPoints ? 'bg-white' : 'bg-transparent'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default GameScreen;