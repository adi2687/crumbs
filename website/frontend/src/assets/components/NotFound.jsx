import FuzzyText from './FuzzyText';

const NotFound = () => {
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
    </div>
  );
};

export default NotFound;
