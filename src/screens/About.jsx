import React from 'react';
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



const About = () => {
  return (
    <div className='p-4 min-h-screen font-serif pt-24 pb-10'>
      

      <h1 className='text-2xl md:text-3xl mb-4 flex justify-center'>About Us</h1>
      <div className='md:flex justify-between'>   
      <div className='flex-0.7 text-center md:ml-12 md:text-left font-serif md:text-2xl'>
          <p className='font-bold'>Linkpii is a market platform that helps you:</p>
            <li className=''>Sell your products to the world</li>
            <li>Hire professional drivers for your daily activities</li>
            <li>Rent a car</li>
            <li>Rent an apartment</li>
            <li>Rent an equipments</li>
            <li>Hire a skill personnel</li>
            <li>Advertise your products</li>
            <li>Advertise your company</li>
            <li>Buy all the products you want</li>
            <li>Connect with customers all over the world</li>
          <li>and so on</li>
        </div>

        <div className='mr-8 ml-10 md:ml-0 lg:ml-0'>
        <video autoPlay={true} width="600" loop={true} controls>
        <source src={Vidd} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
        </div>


      </div>

      <h1 className='text-xl flex md:text-2xl justify-center pt-3'>Features</h1>
      <div className='flex flex-wrap justify-center'>
        <img src={MyCall} className='w-80 h-[80vh] sm:w-1/2 md:w-1/5 p-2' alt='call' />
        <img src={MyCar} className='w-80 h-[82vh] sm:w-1/2 md:w-1/5 p-2' alt='car' />
        <img src={MyOptions} className='w-80 h-[82vh] sm:w-1/2 md:w-1/5 p-2' alt='options' />
      </div>


      <h1 className='text-xl flex md:text-2xl justify-center'>Contacts</h1>
    <div className='bg-gray-200  p-4 '>
    <div className='md:flex justify-between'>
   
    <Link to="mailto://linkpiiapp@gmail.com" className='flex'>
    <MdOutlineMailOutline size={50} /> <h1 className='pt-3'>linkpiiapp@gmail.com</h1>
  
    </Link>

    <Link to="https://wa.me/23309317581" className='flex'>
    <FaSquareWhatsapp size={50} color='green' />   <h1 className='pt-3'>+233209317581</h1>
    </Link>

    <Link className='flex'>
  
    <IoCall size={40} color='green' /> <h1  className='pt-2'> +233209317581</h1>
    </Link>
  

 

 
    </div>
    
    <div className='md:flex md:flex-row md:justify-between flex flex-col justify-center items-center'>
    <div className='justify-center font-serif pt-6 '>
    {/* <h1 className=' md:text-2xl pt-6 mr-2'>@Linkpii</h1> */}
    <img src={Downl} className='w-80 md:h-18 lg:h-18 h-10 ' alt='down' />
    <img src={Apple} className='w-80 h-80' alt='down' />



    <div className=' flex justify-center mt-6 items-center text-center font-bold'>
    <Link className='text-white bg-black py-2 px-4 rounded-full'  to={"https://apps.apple.com/gh/app/linkpii/id6502578883"}>
    Press me to download for iOS
    </Link>
    </div>
    </div>

    <div className='font-serif pt-6 '>
    {/* <h1 className=' md:text-2xl pt-6 mr-2'>@Linkpii</h1> */}
    <img src={Android} className='w-80 md:h-18 lg:h-18 h-9' alt='down' />
    <img src={AndroidQr} className='w-80 h-80' alt='down' />


<div className=' flex justify-center mt-6 items-center text-center font-bold'>
<Link className='text-white bg-black py-2 px-4 rounded-full'  to={"https://play.google.com/store/apps/details?id=com.ericok.palm"}>
    Press me, download for android
    </Link>
</div>
   
   
    </div>
    </div>


    </div>
   

   <div className='flex justify-between mt-10'>
    <Link to={"terms"}>Terms of Use</Link>
    <Link to={"policy"}>Privacy Policy</Link>
   </div>

    </div>
  );
}

export default About;
