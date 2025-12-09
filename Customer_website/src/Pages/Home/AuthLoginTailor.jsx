import React, { useEffect, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { Link } from 'react-router-dom';

const AuthLoginTailor = () => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true); // Set to true after a short delay for the effect
        }, 100); // Small delay to ensure smooth animation on mount
    }, []);

    return (
        <div className="mt-[4rem] flex w-full justify-center gap-5">
            <div className={`flex w-[35rem] border-b mt-5 border-orange-500 px-12 py-1 transition-all duration-500 transform ${
                isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                <p>
                    Looking to register as a tailor?  
                    <Link to="/tailor-registration" className="text-blue-600 hover:font-bold ml-1">
                        Click here to get started!
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default AuthLoginTailor;
