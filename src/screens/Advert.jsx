import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import baseURL from '../assets/baseURL';
import { BeatLoader } from 'react-spinners';

const Advert = () => {
  const [advertImages, setAdvertImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);


  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // Adjust the breakpoint based on your design
        settings: {
          slidesToShow: 2, // Show 2 slides on screens larger than or equal to 1024px
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // Show 1 slide on screens larger than or equal to 768px
        },
      },
    ],
  };

  useEffect(() => {
    const fetchAdvertImages = async () => {
      try {
        const response = await fetch(`${baseURL}advert`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAdvertImages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching advert images:', error.message);
        setLoading(false);
      }
    };

    const fetchProductCount = async () => {
        try {
          const response = await fetch(`${baseURL}advert/count`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const productCount = await response.json();
          console.log('Product Count:', productCount);
          setProductCount(productCount); // Set the count in the state
        } catch (error) {
          console.error('Error fetching product count:', error.message);
        }
      };

    fetchAdvertImages();
    fetchProductCount();
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto pt-16 px-4 sm:px-6 lg:px-8">
      {loading ? (
        // Render a loading indicator or placeholder while fetching data
        <div className="flex items-center justify-center w-full h-full">
        <BeatLoader color={'#36D7B7'} loading={loading} />
      </div>
      ) : (
        <Slider {...settings}>
          {advertImages.map((image, index) => (
            <div key={index}>
              <img
                src={image.picture}
                alt={`Slide ${index + 1}`}
                className="w-full h-96 rounded"
             
              />
            </div>
          ))}
        </Slider>
      )}
      <h1 className='text-center text-lg pt-10 font-bold font-uniquifier'>Totlal Advert: {productCount}</h1>
    </div>
  );
};

export default Advert;
