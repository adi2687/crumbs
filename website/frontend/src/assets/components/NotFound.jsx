import FuzzyText from './FuzzyText';
import {useNavigate} from 'react-router-dom'
const NotFound = () => {
  const navigate=useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <FuzzyText 
        baseIntensity={0.2} 
        hoverIntensity={0.6}   // pass numbers, not undefined variables
        enableHover={true}     // pass boolean, not undefined variable
      >
        404
      </FuzzyText>
      <FuzzyText 
        baseIntensity={0.2} 
        hoverIntensity={0.6}   // pass numbers, not undefined variables
        enableHover={true}     // pass boolean, not undefined variable
      >
        Not Found
      </FuzzyText>
      <br />
      <button className="bg-white text-black px-6 py-2 mono-text font-bold hover:bg-gray-200 transition-all neon-glow cursor-pointer rounded" 
      onClick={()=>navigate("/auth")}>
        JOIN_NETWORK
      </button>
      <br />
      <button className="bg-white text-black px-6 py-2 mono-text font-bold hover:bg-gray-200 transition-all neon-glow cursor-pointer rounded"
      onClick={()=>navigate('/')}>
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
