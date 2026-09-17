import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AiOutlinePlusCircle, AiOutlineVideoCamera } from "react-icons/ai";
import baseURL from "../../assets/baseURL";
import { useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import SectionHeading from "../../components/ui/SectionHeading";

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100";

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
    <div className="min-h-screen bg-ink-50 pt-20 sm:pt-24 pb-12">
      <Container>
        <div className="mx-auto max-w-2xl rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
          <SectionHeading
            eyebrow="Post"
            title="List a product"
            subtitle="Add a couple of photos and the details buyers need to reach you."
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-dashed border-ink-200 bg-ink-50">
                {picture && (
                  <img src={picture} alt="Primary" className="h-full w-full object-cover" />
                )}
              </div>
              <label
                htmlFor="primaryImage"
                className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white shadow-soft transition-colors hover:bg-brand-700"
              >
                <AiOutlinePlusCircle size={20} />
              </label>
              <input
                type="file"
                id="primaryImage"
                className="hidden"
                onChange={handleFileChange(setPicture)}
              />
            </div>
            <div className="relative">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-dashed border-ink-200 bg-ink-50">
                {pictureSec && (
                  <img src={pictureSec} alt="Secondary" className="h-full w-full object-cover" />
                )}
              </div>
              <label
                htmlFor="secondaryImage"
                className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white shadow-soft transition-colors hover:bg-brand-700"
              >
                <AiOutlinePlusCircle size={20} />
              </label>
              <input
                type="file"
                id="secondaryImage"
                className="hidden"
                onChange={handleFileChange(setPictureSec)}
              />
            </div>
          </div>

          <div className="relative mt-4">
            <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-ink-200 bg-ink-50">
              {video ? (
                <video src={video} controls className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm text-ink-400">No video selected</span>
              )}
            </div>
            <label
              htmlFor="videoPicker"
              className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-accent-500 text-white shadow-soft transition-colors hover:bg-accent-600"
            >
              <AiOutlineVideoCamera size={18} />
            </label>
            <input
              type="file"
              id="videoPicker"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange(setVideo)}
            />
          </div>

          <div className="mt-6 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product Name"
              className={inputClass}
            />
            <input
              type="number"
              value={price}
              onChange={(e) => {
                const inputValue = e.target.value;

                // Allow only numbers and ensure it doesn't start with '0' or '+'
                if (/^[^0+]\d*$/.test(inputValue) || inputValue === "") {
                  setPrice(inputValue);
                }
              }}
              placeholder="Price"
              className={inputClass}
            />
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Give a discount. It is optional. 5, 10 ,15..."
              className={inputClass}
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number +233, +44, +234"
              className={inputClass}
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
              className={inputClass}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product Description"
              rows={4}
              className={inputClass}
            ></textarea>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Region"
              className={inputClass}
            />
            <input
              type="text"
              value={town}
              onChange={(e) => setTown(e.target.value)}
              placeholder="Town"
              className={inputClass}
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className={inputClass}
            />

            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className={inputClass}
            >
              <option value="">Select Condition</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
            <select
              className={inputClass}
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
              disabled={isLoading}
              className={`w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700 ${
                isLoading ? "opacity-50" : ""
              }`}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SingleProductForm;
