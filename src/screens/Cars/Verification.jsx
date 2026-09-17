import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaWhatsappSquare, FaPhoneAlt } from 'react-icons/fa';
import { TbShieldCheck } from 'react-icons/tb';
import baseURL from '../../assets/baseURL';
import Loader from '../../components/Loader';

const Verification = () => {
    const myProducts = useSelector((state) => state.user._id);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseURL}userbyid/${myProducts}`);
            setUserData(response.data);
            // console.log("User data response:", response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (myProducts) {
            fetchUserData();
        }
    }, [myProducts]);

    const openDial = () => {
        window.location.href = "tel:+233247747624";
    };

    const openWhatsApp = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            window.location.href = "https://wa.me/233209317581";
        } else {
            window.open("https://wa.me/233209317581", "_blank");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-ink-50 px-6 pb-10 pt-20 sm:pt-24">
            <div className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-card">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <TbShieldCheck size={28} />
                </div>

                <h1 className="font-display text-2xl font-bold text-ink-900">Call Requirements</h1>

                {loading ? (
                    <div className="mt-6 flex justify-center">
                        <Loader />
                    </div>
                ) : userData ? (
                    <>
                        <div className="mt-6 space-y-3 text-left">
                            <p className="text-sm text-ink-600">
                                Name: <span className="font-semibold text-ink-900">{userData.name} {userData.lastname}</span>
                            </p>
                            <p className="text-sm text-ink-600">
                                Email: <span className="font-semibold text-ink-900">{userData.email}</span>
                            </p>
                            <p className="text-sm text-ink-600">
                                Phone Number: <span className="font-semibold text-ink-900">{userData.phone}</span>
                            </p>
                            <p className="rounded-xl border border-accent-100 bg-accent-50 p-3.5 text-sm text-ink-700">
                                <span className="font-semibold text-accent-700">{userData.name}</span>, send your
                                picture and your Ghana card or any national ID for verification before you can
                                call a driver or a mechanic.
                            </p>
                        </div>

                        <div className="mt-8 flex justify-center gap-6">
                            <button
                                onClick={openWhatsApp}
                                aria-label="Open WhatsApp"
                                className="flex flex-col items-center gap-2 rounded-xl px-6 py-3 text-green-600 transition-colors hover:bg-green-50"
                            >
                                <FaWhatsappSquare size={36} />
                                <span className="text-sm font-semibold">WhatsApp</span>
                            </button>
                            <button
                                onClick={openDial}
                                aria-label="Call Phone Number"
                                className="flex flex-col items-center gap-2 rounded-xl px-6 py-3 text-brand-600 transition-colors hover:bg-brand-50"
                            >
                                <FaPhoneAlt size={32} />
                                <span className="text-sm font-semibold">Call</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="mt-6 text-sm text-red-500">Failed to load user data</p>
                )}
            </div>
        </div>
    );
};

export default Verification;
