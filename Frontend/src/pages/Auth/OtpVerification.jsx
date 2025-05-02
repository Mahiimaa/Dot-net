import React, { useState, useRef, useEffect } from 'react';
import otpp from '../../assets/Images/OTP.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpVerification = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const inputRefs = useRef([]);

    const email = localStorage.getItem('resetEmail');

    useEffect(() => {
        if (!email) {
            setError('No email found. Please start the password reset process again.');
            setTimeout(() => navigate('/forgotpassword'), 2000);
        }
    }, [email, navigate]);

    const handleChange = (index, value) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to next input if value is entered
            if (value && index < 3) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const otpValue = otp.join('');
        if (otpValue.length !== 4) {
            setError('Please enter a 4-digit OTP.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5127/api/PasswordReset/verify-otp', {
                email,
                otp: otpValue
            });
            setSuccess(response.data);
            setTimeout(() => {
                navigate('/newpassword');
            }, 2000);
        } catch (err) {
            if (err.response) {
                setError(err.response.data || 'Invalid or expired OTP.');
            } else {
                setError('Unable to connect to the server. Please check your connection.');
            }
        }
    };

    const handleResend = async () => {
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('http://localhost:5127/api/PasswordReset/initiate', {
                email
            });
            setSuccess('OTP resent successfully.');
        } catch (err) {
            if (err.response) {
                setError(err.response.data || 'Failed to resend OTP.');
            } else {
                setError('Unable to connect to the server.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <a href="/forgotpassword" className="text-gray-600 flex items-center mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Go back
                </a>
                <div className="flex justify-center mb-6">
                    <div className="w-84 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <img
                            src={otpp}
                            alt="Illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Verification</h2>
                {error && (
                    <div className="text-white bg-red-600 text-sm mb-4 p-2 rounded-md">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="text-white bg-green-600 text-sm mb-4 p-2 rounded-md">
                        {success}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center mb-6">
                        <div className="flex space-x-4">
                            {otp.map((digit, index) => (
                                <div key={index} className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <input
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        className="w-8 h-8 text-center text-lg bg-transparent outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-center text-gray-600 mb-6">
                        If you didn’t receive a code.{' '}
                        <button type="button" onClick={handleResend} className="text-blue-600">Resend</button>
                    </p>
                    <button
                        type="submit"
                        className="w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition"
                    >
                        SUBMIT
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerification;