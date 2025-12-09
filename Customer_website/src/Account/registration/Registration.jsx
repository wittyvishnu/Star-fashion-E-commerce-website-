import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { Scissors } from 'lucide-react';
import PersonalInfo from './PersonalInfo';
import LocationInfo from './LocationInfo';
import ServicesInfo from './ServicesInfo';
import TailorReg from '../../Utiles/RegBgImg.jpg';

const Registration = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const progressAnimation = useSpring({
    width: `${((step - 1) / 2) * 100}%`,
    config: { tension: 300, friction: 10 },
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit registration and navigate to dashboard
      navigate('/tailor-dashboard');
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center px-4 bg-cover bg-center" 
      style={{ backgroundImage: `url(${TailorReg})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md inset-y-0" />
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl relative z-10">
        <div className="flex items-center justify-center mb-8">
          <Scissors className="text-blue-600 w-12 h-12 mr-4" />
          <h1 className="text-3xl font-bold text-blue-800">Tailor Registration</h1>
        </div>

        <div className="relative mb-8">
          <div className="stepper-line">
            <animated.div className="stepper-line-progress" style={progressAnimation} />
          </div>
          <div className="flex justify-between relative z-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'} transition-all duration-300`}>
                {i}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && <PersonalInfo />}
        {step === 2 && <LocationInfo />}
        {step === 3 && <ServicesInfo />}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button onClick={handlePrevious} className="btn-secondary">
              Previous
            </button>
          )}
          <button onClick={handleNext} className="btn-primary ml-auto">
            {step === 3 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
