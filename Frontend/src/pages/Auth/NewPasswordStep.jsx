import React, { useState, useEffect } from 'react';
import newpw from '../../assets/Images/CPassword.png';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';

const NewPassword = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isResetComplete, setIsResetComplete] = useState(false); // New state to track reset completion

    const email = localStorage.getItem('resetEmail');

    // Check if the user is eligible to reset the password
    useEffect(() => {
        // Skip checks if reset is already complete
        if (isResetComplete) {
            return;
        }

        if (!email) {
            setError('No email found. Please start the password reset process again.');
            setTimeout(() => navigate('/forgotpassword'), 2000);
            return;
        }

        // Optional: Verify with backend if OTP has been verified
        const checkOtpStatus = async () => {
            try {
                const response = await axios.post('http://localhost:5127/api/PasswordReset/check-otp-status', {
                    email
                });
                if (!response.data.isOtpVerified) {
                    setError('OTP verification is required. Please verify the OTP first.');
                    setTimeout(() => navigate('/otpverification'), 2000);
                }
            } catch (err) {
                setError('Unable to verify OTP status. Please try again.');
                setTimeout(() => navigate('/forgotpassword'), 2000);
            }
        };

        checkOtpStatus();
    }, [email, navigate, isResetComplete]); // Add isResetComplete to dependencies

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5127/api/PasswordReset/reset', {
                email,
                newPassword,
                confirmPassword
            });
            setSuccess(response.data);
            setIsResetComplete(true); // Mark reset as complete
            localStorage.removeItem('resetEmail'); // Clean up
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            if (err.response) {
                setError(err.response.data || 'Failed to reset password.');
            } else {
                setError('Unable to connect to the server.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <a href="/otpverification" className="text-gray-600 flex items-center mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Go back
                </a>
                <div className="flex justify-center mb-6">
                    <div className="w-84 h-64 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                            src={newpw}
                            alt="Illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-4">New Password</h2>
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
                    <div className="mb-4">
                        <div className="flex items-center border border-gray-300 rounded-lg p-3">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full outline-none text-gray-700"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="ml-3 text-gray-500"
                            >
                                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center border border-gray-300 rounded-lg p-3">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full outline-none text-gray-700"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="ml-3 text-gray-500"
                            >
                                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#c7916c] text-white font-semibold py-3 rounded-lg hover:bg-[#b87b58] transition"
                    >
                        SUBMIT
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewPassword;