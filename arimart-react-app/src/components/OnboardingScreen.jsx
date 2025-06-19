// OnboardingScreen.jsx
import { Link, useNavigate } from 'react-router-dom';
import onboardingImage from '../assets/images/onboarding-screen/onboarding-1.png';

const OnboardingScreen = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth"); // ✅ send to AuthFlow next
  };
  return (
    <div
      className="bg-cover bg-no-repeat w-full h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${onboardingImage})` }}
    >
    <div className="relative w-full min-h-screen transition-colors">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-end">
          <Link
            to="/home"
            className="text-red-500 font-bold text-sm hover:underline"
          >
            Skip
          </Link>
        </div>

        <div className="absolute bottom-10 left-0 right-0 px-4">
      <button
         onClick={handleGetStarted}
        className="block md:w-80 w-full mx-auto text-center bg-red-500 dark:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition"
      >
        Get Started
      </button>
    </div>
      </div>
    </div>
    </div>
  );
};

export default OnboardingScreen;
