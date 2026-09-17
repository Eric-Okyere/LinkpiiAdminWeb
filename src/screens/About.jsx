import React from 'react';
import { Helmet } from 'react-helmet-async';
import Apple from '../assets/AppleQr.jpg';
import MyCall from '../assets/picc.png';
import Downl from '../assets/downl.jpeg';
import Android from "../assets/Android.jpeg"
import AndroidQr from "../assets/AndroidQrC.jpeg"
import MyCar from '../assets/Car.png';
import MyOptions from '../assets/picx.png';
import { MdOutlineMailOutline } from "react-icons/md";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { Link } from 'react-router-dom';
import Vidd from "../assets/Viddx.mp4"

const offerings = [
  "Sell your products to the world",
  "Hire professional drivers for your daily activities",
  "Rent a car",
  "Rent an apartment",
  "Rent an equipments",
  "Hire a skill personnel",
  "Advertise your products",
  "Advertise your company",
  "Buy all the products you want",
  "Connect with customers all over the world",
  "and so on",
];

const About = () => {
  return (
    <div className="min-h-screen bg-ink-50 pb-16 pt-20 sm:pt-24">
      <Helmet>
        <title>About</title>
        <meta
          name="description"
          content="Linkpii helps you sell products, hire drivers, rent cars, apartments and equipment, hire skilled personnel, and advertise your business in Ghana."
        />
      </Helmet>

      <div className="bg-ink-950 px-4 pb-12 pt-8 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-300">
            About Linkpii
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-extrabold sm:text-4xl">
            One marketplace for everything you buy, sell or rent
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-brand-100 sm:text-base">
            Linkpii connects buyers and sellers across Ghana — products,
            services, housing, equipment, vehicles and more.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="-mt-6 grid gap-6 rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:-mt-8 sm:p-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">
              Linkpii is a market platform that helps you:
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {offerings.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-soft">
            <video autoPlay width="600" loop controls className="w-full">
              <source src={Vidd} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-5 text-center font-display text-2xl font-bold text-ink-900">
            Features
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <img
              src={MyCall}
              className="h-72 w-full rounded-2xl border border-ink-100 object-cover shadow-soft transition duration-500 hover:scale-[1.02]"
              alt="call"
            />
            <img
              src={MyCar}
              className="h-72 w-full rounded-2xl border border-ink-100 object-cover shadow-soft transition duration-500 hover:scale-[1.02]"
              alt="car"
            />
            <img
              src={MyOptions}
              className="h-72 w-full rounded-2xl border border-ink-100 object-cover shadow-soft transition duration-500 hover:scale-[1.02]"
              alt="options"
            />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-5 text-center font-display text-2xl font-bold text-ink-900">
            Contacts
          </h2>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <a
                href="mailto:linkpiiapp@gmail.com"
                className="flex items-center gap-3 rounded-xl bg-ink-50 p-4 transition-colors hover:bg-brand-50"
              >
                <MdOutlineMailOutline size={28} className="shrink-0 text-brand-600" />
                <span className="text-sm font-semibold text-ink-800">linkpiiapp@gmail.com</span>
              </a>

              <a
                href="https://wa.me/23309317581"
                className="flex items-center gap-3 rounded-xl bg-ink-50 p-4 transition-colors hover:bg-green-50"
              >
                <FaSquareWhatsapp size={28} className="shrink-0 text-green-600" />
                <span className="text-sm font-semibold text-ink-800">+233209317581</span>
              </a>

              <Link
                to="#"
                className="flex items-center gap-3 rounded-xl bg-ink-50 p-4 transition-colors hover:bg-green-50"
              >
                <IoCall size={24} className="shrink-0 text-green-600" />
                <span className="text-sm font-semibold text-ink-800">+233209317581</span>
              </Link>
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <div className="flex flex-col items-center gap-4 text-center">
                <img src={Downl} className="h-10 w-auto" alt="download on the app store" />
                <img src={Apple} className="h-40 w-40 rounded-xl border border-ink-100 object-cover" alt="iOS app QR code" />
                <Link
                  className="rounded-full bg-ink-900 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-700"
                  to={"https://apps.apple.com/gh/app/linkpii/id6502578883"}
                >
                  Press me to download for iOS
                </Link>
              </div>

              <div className="flex flex-col items-center gap-4 text-center">
                <img src={Android} className="h-9 w-auto" alt="get it on google play" />
                <img src={AndroidQr} className="h-40 w-40 rounded-xl border border-ink-100 object-cover" alt="Android app QR code" />
                <Link
                  className="rounded-full bg-ink-900 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-700"
                  to={"https://play.google.com/store/apps/details?id=com.ericok.palm"}
                >
                  Press me, download for android
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-between text-sm text-ink-500">
          <Link to={"terms"} className="font-semibold hover:text-brand-700">
            Terms of Use
          </Link>
          <a
            href="https://linkpii.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-brand-700"
          >
            &copy; 2025 Linkpii. Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;
