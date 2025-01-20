import React from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { signIn } from 'next-auth/react';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ open, onClose }) => {
  const handleSignIn = () => {
    signIn('google', { callbackUrl: 'http://localhost:3000/' })
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error("Sign in error:", error);
      });
  };

  return (
    <Modal open={open} onClose={onClose} center classNames={{ modal: 'xl:max-w-6xl rounded-3xl p-0'  }}>
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Section: Image (w-2/5) */}
        <div className="w-full max-md:h-60 md:w-1/2 flex justify-center items-end text-white p-6 relative" 
     style={{ backgroundImage: 'url(./images/New/modalBg.png)', backgroundPosition: 'center', backgroundSize: 'cover' }}>
  
  {/* Substitute Icon at the top-right corner */}
  <img 
    src="./images/New/substitute_icon.png" 
    alt="Substitute Icon" 
    className="absolute top-4 max-md:left-4 md:right-4 w-12 h-12" 
  />
  
  {/* Logo at the bottom */}
  <img 
    src="./images/New/logo.png" 
    alt="Model Logo" 
    className="w-40 sm:w-60 mx-auto" 
  />
</div>


        {/* Right Section: Google Sign-In (w-3/5) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center  p-8 bg-white">
          <h2 className="text-4xl text-gray-600 text-center font-semibold mb-6">Account Sign In</h2>
          <p className=" text-gray-400 text-center">
            Customize the sign-in with Google modal with your company brand and personal accounts.
          </p>
        <div className='flex justify-center items-center'>
          <img src="./images/New/Google.png" alt="Google Logo" className='w-48 my-12' />
        </div>
          <button
            onClick={handleSignIn}
            className="bg-blue-500 lg:w-2/3 mx-auto  text-white  rounded shadow-2xl hover:bg-blue-600"
          ><div className='flex  items-center '>
 <span><img src="./images/New/G-logo.png" alt="G Logo" className='w-16 bg-white p-4 border border-blue-500 flex' /></span> <div className='flex justify-center w-full text-xs sm:text-lg items-center'>Sign In with Google</div>
          </div>
          
          </button>
          <p className="mt-8 mb-12 text-sm text-center text-gray-500">Use your Google account</p>
          <div className='mt-4 flex justify-center items-center gap-2'>
          <span className=" text-xs text-center text-blue-500">Sponsered & Promoted By</span><span className=" text-xs text-center font-bold text-green-800">ERAMS LABS</span>
        </div>
        <div className='flex mt-2 justify-center items-center'>
          <span className=" text-xs text-center font-semibold text-gray-800">copyright @ Mobirizer 2024</span>
        </div>
        </div>
      
      </div>
    </Modal>
  );
};

export default SignInModal;


