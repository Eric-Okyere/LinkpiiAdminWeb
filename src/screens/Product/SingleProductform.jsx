import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AiOutlinePlusCircle, AiOutlineVideoCamera , AiOutlineClose} from "react-icons/ai";
import baseURL from "../../assets/baseURL";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";


const SingleProductForm = ({ item }) => {
  const [picture, setPicture] = useState(null);
  const [pictureSec, setPictureSec] = useState(null);
  const [video, setVideo] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
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
  const navigate = useNavigate();

  useEffect(() => {
    if (item) {
      const {
        name,
        price,
        phone,
        description,
        region,
        town,
        location,
        discount,
        whatsapp,
        condition,
        picture,
        pictureSec,
        video,
      } = item;

      setName(name || "");
      setPrice(price || "");
      setPhone(phone || "");
      setPhone(discount || "");
      setDescription(description || "");
      setRegion(region || "");
      setTown(town || "");
      setLocation(location || "");
      setWhatsapp(whatsapp || "");
      setCondition(condition || "");
      setPicture(picture || null);
      setPictureSec(pictureSec || null);
      setVideo(video || null);
    }

  }, [item]);


  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`${baseURL}fashion`);
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);
  

  const handleFileChange = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setter(URL.createObjectURL(file));
    }
  };


  const fetchFile = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const fileName = url.split("/").pop();
      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      console.error("Error fetching file:", error);
      return null;
    }
  };
  



  const handleSubmit = async () => {
    if (!name || !phone || !price || !description || !location) {
      alert("Please fill in all required fields, including Name, Phone, Price, Description, and Location.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("phone", phone);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("region", region);
      formData.append("town", town);
      formData.append("discount", discount);
      formData.append("whatsapp", whatsapp);
      formData.append("condition", condition);
      formData.append("category", category);
      formData.append("userId", login.user);
  
      if (picture) formData.append("picture", await fetchFile(picture));
      if (pictureSec) formData.append("picturesec", await fetchFile(pictureSec));
      if (video) formData.append("video", await fetchFile(video));
  
      const response = await fetch(`${baseURL}fashionpost`, {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        alert("Product submitted successfully!");
        console.log("Submitted product:", result);
        navigate("/user", { state: { activeTab: "general" } });
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown server error" }));
        alert(`Error: ${errorData.error || "Something went wrong!"}`);
      }
    } catch (error) {
      alert(`Error: ${error.message || "Something went wrong!"}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  







  return (
    <>
     <div className="pt-16 md:pt-28 m-6 ">
      {/* <Link to={"/user"} className="flex justify-between md:justify-normal">
      <IoArrowBack size={30} />
     
      <h1 className="text-xl font-bold md:ml-96">Post Your Product</h1>
     
      </Link> */}
      </div>

    <div className="flex flex-col items-center sm:mx-8 md:mx-8">
    
      
      <div className="grid gap-6 grid-cols-2 mx-4">
        <div className="relative">
          <img
            src={picture || ""}
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
            onChange={handleFileChange(setPicture)}
          />
        </div>
        <div className="relative">
          <img
            src={pictureSec || ""}
            alt="No Image"
            className="w-60 md:w-80 md:h-40 h-24 rounded-lg object-cover border-4 border-black"
          />
          <label htmlFor="secondaryImage" className="absolute bottom-0 right-0 cursor-pointer">
            <AiOutlinePlusCircle size={24} />
          </label>
          <input
            type="file"
            id="secondaryImage"
            className="hidden"
            onChange={handleFileChange(setPictureSec)}
          />
        </div>
        <div className="relative justify-center">
          <video
            src={video || ""}
            controls
            className="w-44 h-32 md:w-96 border border-black"
          ></video>
          <label htmlFor="videoPicker" className="absolute bottom-0 ml-20 cursor-pointer">
            <AiOutlineVideoCamera size={24} className="bg-slate-300 md:ml-80 ml-14" />
          </label>
          <input
            type="file"
            id="videoPicker"
            className="hidden"
            accept="video/*"
            onChange={handleFileChange(setVideo)}
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
         onChange={(e) => {
            const inputValue = e.target.value;

            // Allow only numbers and ensure it doesn't start with '0' or '+'
            if (/^[^0+]\d*$/.test(inputValue) || inputValue === "") {
              setPrice(inputValue);
            }}}
          placeholder="Price"
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="Give a discount. It is optional. 5, 10 ,15..."
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number +233, +44, +234"
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          value={whatsapp}
          onChange={(e) => {
            const inputValue = e.target.value;

            // Allow only numbers and ensure it doesn't start with '0' or '+'
            if (/^[^0+]\d*$/.test(inputValue) || inputValue === "") {
              setWhatsapp(inputValue);
            }
          }}
          placeholder="WhatsApp Number 233, 44, 234"
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
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full mb-4 p-2 border rounded"
        />
      
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select Condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
        <select
         className="w-full mb-4 p-2 border rounded"
  value={category}
  onChange={(e) => setCategory(e.target.value)} // Save the ID instead of name
>
  <option value="">Select a category</option>
  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>

        <button
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-black text-white rounded mb-14"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
    </>
  );
};

export default SingleProductForm;
