import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AiOutlinePlusCircle, AiOutlineVideoCamera } from "react-icons/ai";
import baseURL from "../../assets/baseURL";
import { useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import SectionHeading from "../../components/ui/SectionHeading";

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100";

const ServiceesForm = ({ item }) => {
  const [picture, setPicture] = useState(null);
  const [picturesec, setPicturesec] = useState(null);
  const [video, setVideo] = useState(null);
  const [name, setName] = useState("");
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
      setName(item.name);
      setVideo(item.video);
      setPhone(item.phone);
      setPrice(item.price);
      setDescription(item.description);
      setRegion(item.region);
      setTown(item.town);
      setPicturesec(item.picturesec);
      setLocation(item.location);
      setWhatsapp(item.whatsapp);
      setCondition(item.condition);
    }

    fetch(`${baseURL}servcat`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, [item]);

  const handleImageChange = (setImage) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
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
    if (!name || !phone || !description || !location || !category) {
      alert("Please fill in all required fields, including Name, Phone, Description, and Location.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("region", region);
      formData.append("town", town);
      formData.append("whatsapp", whatsapp);
      formData.append("condition", condition);
      formData.append("category", category);
      formData.append("userId", login.user);

      if (picture) formData.append("picture", await fetchFile(picture));
      if (picturesec) formData.append("picturesec", await fetchFile(picturesec));
      if (video) formData.append("video", await fetchFile(video));

      const response = await fetch(`${baseURL}services`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Product submitted successfully!");
        console.log("Submitted product:", result);
        navigate("/servmana");
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
            title="List a service"
            subtitle="Add a couple of photos and the details customers need to reach you."
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
                onChange={handleImageChange(setPicture)}
              />
            </div>
            <div className="relative">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-dashed border-ink-200 bg-ink-50">
                {picturesec && (
                  <img src={picturesec} alt="Secondary" className="h-full w-full object-cover" />
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
                onChange={handleImageChange(setPicturesec)}
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
              onChange={handleImageChange(setVideo)}
            />
          </div>

          <div className="mt-6 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Service name"
              className={inputClass}
            />

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className={inputClass}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your service"
              rows={4}
              className={inputClass}
            ></textarea>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="WhatsApp number"
              className={inputClass}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="">Select category</option>
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

export default ServiceesForm;
