import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfUse from './components/legal/TermOfUse';
import React, { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Skills from './components/sections/Skills';
import Changelog from './components/project';
import ContactForm from './components/sections/ContactForm';
import Footer from './components/layout/Footer';
import CookieConsent from './components/layout/CookieConsent';
import { getCookieConsent, setCookieConsent } from './utils/cookieUtils';
import AboutMe from './components/sections/AboutMe';

const App: React.FC = () => {
    const theme = 'light';
    const [showCookieConsent, setShowCookieConsent] = useState(false);
    const [canInteract, setCanInteract] = useState(false);

    useEffect(() => {
        document.body.className = 'bg-white text-gray-900';
    }, [theme]);

    useEffect(() => {
        const consent = getCookieConsent();
        if (consent === null) {
            setShowCookieConsent(true);
            setCanInteract(false);
        } else {
            setCanInteract(true);
        }
    }, []);

    const handleAcceptCookies = () => {
        setCookieConsent('accepted');
        setShowCookieConsent(false);
        setCanInteract(true);
    };

    const handleDeclineCookies = () => {
        setCookieConsent('declined');
        setShowCookieConsent(false);
        setCanInteract(true);
    };

    return (
        <Router>
            <div className={`relative min-h-screen flex flex-col ${!canInteract ? 'overflow-hidden' : ''}`}>
                {}
                {!canInteract && showCookieConsent && <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>}

                {}
                <Header />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <Navigation />
                                <main
                                    className={`flex-grow container mx-auto p-4 ${!canInteract ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    <section id="aboutme" className="py-16">
                                        <AboutMe />
                                    </section>
                                    <section id="skills" className="py-16">
                                        <Skills />
                                    </section>
                                    <section id="projects" className="py-16">
                                        <Changelog />
                                    </section>
                                    <section id="contact" className="py-16">
                                        <ContactForm />
                                    </section>
                                </main>
                            </>
                        }
                    />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfUse />} />
                </Routes>
                <Footer />

                {}
                {showCookieConsent && <CookieConsent onAccept={handleAcceptCookies} onDecline={handleDeclineCookies} />}
            </div>
        </Router>
    );
};

export default App;
