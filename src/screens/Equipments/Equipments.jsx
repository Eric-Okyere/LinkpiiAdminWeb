import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AiOutlinePlusCircle, AiOutlineVideoCamera } from "react-icons/ai";
import baseURL from "../../assets/baseURL";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const Equipments = ({ item }) => {
  const [picture, setPicture] = useState(null);
  const [picturesec, setPicturesec] = useState(null);
  const [video, setVideo] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("");
  const [town, setTown] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const login = useSelector((state) => state);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setVideo(item.video);
      setPhone(item.phone);
      setPrice(item.price);
      setDescription(item.description);
      setRegion(item.region);
      setTown(item.town);
      setPicture(item.picture);
      setPicturesec(item.picturesec);
      setLocation(item.location);
      setWhatsapp(item.whatsapp);
      setCondition(item.condition);
    }

    fetch(`${baseURL}equipmentcat`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, [item]);

  const handleImageChange = (setImage) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone || !price || !description || !location) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);

    // Implement form submission logic here
    setIsLoading(false);
  };

  return (
    <>
     <div className="pt-16 md:pt-28 m-6 ">
      {/* <Link to={"/dash"} className="flex justify-between md:justify-normal">
      <IoArrowBack size={30} />
     
      <h1 className="text-xl font-bold md:ml-96">Post Your Equiments</h1>
     
      </Link> */}
      </div>

    <div className="flex flex-col items-center sm:mx-8 md:mx-8">

      <div className="grid gap-6 grid-cols-2 mx-4">
        <div className="relative">
          <img
            src={picture}
            alt="No Image"
            className="w-60 md:w-80 md:h-40 h-24 rounded-lg object-cover border-4 border-black"
          />
          <label htmlFor="primaryImage" className="absolute bottom-0 right-0 cursor-pointer">
            <AiOutlinePlusCircle size={24} />
          </label>
          <input
            type="file"
            id="primaryImage"
            className="hidden"
            onChange={handleImageChange(setPicture)}
          />
        </div>
        <div className="relative">
          <img
            src={picturesec}
            alt="No Image"
            className="w-50 md:w-80 md:h-40 h-24 rounded-lg object-cover border-4 border-black"
          />
          <label htmlFor="secondaryImage" className="absolute bottom-0 right-0 cursor-pointer">
            <AiOutlinePlusCircle size={24} />
          </label>
          <input
            type="file"
            id="secondaryImage"
            className="hidden"
            onChange={handleImageChange(setPicturesec)}
          />
        </div>
        <div className="relative justify-center">
          <video src={video} controls className="w-44 h-32 md:w-96 border border-black"></video>
          <label htmlFor="videoPicker" className="absolute bottom-0 ml-20 cursor-pointer">
            <AiOutlineVideoCamera size={24} className="bg-slate-300 md:ml-80 ml-14" />
          </label>
          <input
            type="file"
            id="videoPicker"
            className="hidden"
            accept="video/*"
            onChange={handleImageChange(setVideo)}
          />
        </div>
      </div>

      <div className="w-80 md:w-1/2 mt-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product Description"
          className="w-full mb-4 p-2 border rounded"
        ></textarea>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Region"
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          value={town}
          onChange={(e) => setTown(e.target.value)}
          placeholder="Town"
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="WhatsApp Number"
          className="w-full mb-4 p-2 border rounded"
        />
        {/* <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select Condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select> */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select> 
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full p-2 text-white bg-black rounded mb-10 ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
    </>
  );
};

export default Equipments;
