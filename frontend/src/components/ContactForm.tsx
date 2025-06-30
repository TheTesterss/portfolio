import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
// import { useTheme } from '../contexts/ThemeContext';
import useScrollAnimation from '../hooks/useScrollAnimation';
import axios from 'axios';

const ContactForm: React.FC = () => {
    const { translations } = useLanguage();
    // const { theme } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const sectionRef = useScrollAnimation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const success = await axios.post('http://localhost:3000/api/contact', {
                body: formData
            });
            if (success) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('Error sending contact form:', err);
            setStatus('error');
        }
    };

    return (
        <section ref={sectionRef} className="animate-on-scroll">
            <h2
                // className={`text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-primary' : 'text-gray-800'}`}
                className={`text-4xl font-bold text-center mb-12 text-gray-800`}
            >
                {translations.contactMe}
            </h2>

            <div
                // className={`max-w-2xl mx-auto p-8 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
                className={`max-w-2xl mx-auto p-8 rounded-lg shadow-lg bg-white`}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            // className={`block text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                            className={`block text-lg font-medium mb-2 text-gray-700`}
                        >
                            {translations.yourName}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            // className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary
                            // ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-50' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary
                           bg-gray-50 border-gray-300 text-gray-900`}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            // className={`block text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                            className={`block text-lg font-medium mb-2 =text-gray-700`}
                        >
                            {translations.yourEmail}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            // className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary
                            // ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-50' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary
                            bg-gray-50 border-gray-300 text-gray-900`}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="message"
                            // className={`block text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                            className={`block text-lg font-medium mb-2 text-gray-700`}
                        >
                            {translations.yourMessage}
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            // className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary
                            // ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-50' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary
                            bg-gray-50 border-gray-300 text-gray-900`}
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className={`w-full py-3 px-6 rounded-md text-white font-semibold transition-colors duration-300
              ${status === 'sending' ? 'bg-blue-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'}`}
                    >
                        {status === 'sending' ? translations.sending : translations.sendMessage}
                    </button>

                    {status === 'success' && (
                        <p className="mt-4 text-center text-green-500 font-semibold">
                            {translations.messageSentSuccess}
                        </p>
                    )}
                    {status === 'error' && (
                        <p className="mt-4 text-center text-red-500 font-semibold">{translations.messageSentError}</p>
                    )}
                </form>
            </div>
        </section>
    );
};

export default ContactForm;
