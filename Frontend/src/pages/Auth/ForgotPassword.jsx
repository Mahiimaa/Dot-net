import React, { useState } from 'react';
import fp from "../../assets/Images/forgotpassword.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:5127/api/PasswordReset/initiate', {
                email
            });
            setSuccess(response.data);
            // Store email in localStorage to pass to next steps
            localStorage.setItem('resetEmail', email);
            setTimeout(() => {
                navigate('/otpverification');
            }, 2000);
        } catch (err) {
            if (err.response) {
                setError(err.response.data || 'Failed to send OTP. Please try again.');
            } else {
                setError('Unable to connect to the server. Please check your connection.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <a href="/login" className="text-gray-600 flex items-center mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Go back
                </a>
                <div className="flex justify-center mb-6">
                    <div className="w-84 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <img
                            src={fp}
                            alt="Illustration"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Forgot Password?</h2>
                <p className="text-center text-gray-600 mb-6">
                    Please enter your registered email address. We will send you a confirmation OTP.
                </p>
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
                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full outline-none text-gray-700"
                                required
                            />
                        </div>
                    </div>
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

export default ForgotPassword;