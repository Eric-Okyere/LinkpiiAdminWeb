import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  AiOutlineCloudUpload,
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineSwap,
  AiOutlineVideoCamera,
} from "react-icons/ai";
import baseURL from "../../assets/baseURL";
import { useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import SectionHeading from "../../components/ui/SectionHeading";
import { GHANA_REGIONS, TOWNS_BY_REGION, withCustomOption } from "../../data/ghanaLocations";

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100";
const errorInputClass =
  "w-full rounded-xl border border-red-300 bg-red-50/40 p-3 text-sm text-ink-800 placeholder:text-ink-400 focus:border-red-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100";

const fieldClass = (hasError) => (hasError ? errorInputClass : inputClass);

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs font-medium text-red-600">{message}</p> : null;

const STEPS = [
  { key: "photos", label: "Photos & Video" },
  { key: "details", label: "Product Details" },
  { key: "contact", label: "Contact & Location" },
];

const SingleProductForm = ({ item }) => {
  const [primaryFile, setPrimaryFile] = useState(null);
  const [primaryPreview, setPrimaryPreview] = useState(null);
  const [secondaryFile, setSecondaryFile] = useState(null);
  const [secondaryPreview, setSecondaryPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);

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

  const [currentStep, setCurrentStep] = useState(0);
  const [attemptedSteps, setAttemptedSteps] = useState(() => new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const login = useSelector((state) => state);
  const navigate = useNavigate();
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

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
      setDescription(description || "");
      setRegion(region || "");
      setTown(town || "");
      setLocation(location || "");
      setWhatsapp(whatsapp || "");
      setCondition(condition || "");
      setDiscount(discount || "");
      setPrimaryPreview(picture || null);
      setSecondaryPreview(pictureSec || null);
      setVideoPreview(video || null);
    }
  }, [item]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseURL}fashion`);
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const revokeIfBlob = (url) => {
    if (url && url.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        // ignore - nothing to clean up
      }
    }
  };

  const assignIncomingPhotos = (fileList) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;

    const hasPrimary = Boolean(primaryFile || primaryPreview);
    const hasSecondary = Boolean(secondaryFile || secondaryPreview);

    if (hasPrimary && hasSecondary) {
      toast.info("Both photo slots are full. Remove one before adding another.");
      return;
    }

    const queue = [...files];
    if (!hasPrimary && queue.length) {
      const f = queue.shift();
      setPrimaryFile(f);
      setPrimaryPreview(URL.createObjectURL(f));
    }
    if (!hasSecondary && queue.length) {
      const f = queue.shift();
      setSecondaryFile(f);
      setSecondaryPreview(URL.createObjectURL(f));
    }
  };

  const handleSlotFile = (which) => (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (which === "primary") {
      revokeIfBlob(primaryPreview);
      setPrimaryFile(file);
      setPrimaryPreview(URL.createObjectURL(file));
    } else {
      revokeIfBlob(secondaryPreview);
      setSecondaryFile(file);
      setSecondaryPreview(URL.createObjectURL(file));
    }
    e.target.value = "";
  };

  const removeSlot = (which) => {
    if (which === "primary") {
      revokeIfBlob(primaryPreview);
      setPrimaryFile(null);
      setPrimaryPreview(null);
    } else {
      revokeIfBlob(secondaryPreview);
      setSecondaryFile(null);
      setSecondaryPreview(null);
    }
  };

  const swapPhotos = () => {
    setPrimaryFile(secondaryFile);
    setPrimaryPreview(secondaryPreview);
    setSecondaryFile(primaryFile);
    setSecondaryPreview(primaryPreview);
  };

  const handleVideoFile = (file) => {
    if (!file) return;
    revokeIfBlob(videoPreview);
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    revokeIfBlob(videoPreview);
    setVideoFile(null);
    setVideoPreview(null);
  };

  const handlePhotoDrop = (e) => {
    e.preventDefault();
    setIsDraggingPhotos(false);
    assignIncomingPhotos(e.dataTransfer.files);
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("video/"));
    if (file) handleVideoFile(file);
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

  const getStepErrors = (stepIndex) => {
    const stepErrors = {};
    if (stepIndex === 1) {
      if (!name.trim()) stepErrors.name = "Give your product a name.";
      if (!price) stepErrors.price = "Enter a price.";
    }
    if (stepIndex === 2) {
      if (!phone.trim()) stepErrors.phone = "Add a phone number buyers can reach you on.";
      if (!description.trim()) stepErrors.description = "Add a short description.";
      if (!location.trim()) stepErrors.location = "Add a location.";
    }
    return stepErrors;
  };

  const stepHasRequiredErrors = (stepIndex) => Object.keys(getStepErrors(stepIndex)).length > 0;

  const currentStepErrors = getStepErrors(currentStep);
  const showErrorsForCurrentStep = attemptedSteps.has(currentStep) || submitAttempted;

  const markAttempted = (stepIndex) =>
    setAttemptedSteps((prev) => {
      const next = new Set(prev);
      next.add(stepIndex);
      return next;
    });

  const goToStep = (index) => {
    if (index <= currentStep) {
      setCurrentStep(index);
      return;
    }
    for (let i = currentStep; i < index; i += 1) {
      if (stepHasRequiredErrors(i)) {
        markAttempted(i);
        setCurrentStep(i);
        return;
      }
    }
    setCurrentStep(index);
  };

  const handleNext = () => {
    markAttempted(currentStep);
    if (stepHasRequiredErrors(currentStep)) return;
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleRegionChange = (e) => {
    const nextRegion = e.target.value;
    setRegion(nextRegion);
    const validTowns = TOWNS_BY_REGION[nextRegion] || [];
    if (!validTowns.includes(town)) {
      setTown("");
    }
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    const badStep = stepHasRequiredErrors(1) ? 1 : stepHasRequiredErrors(2) ? 2 : null;
    if (badStep !== null) {
      markAttempted(badStep);
      setCurrentStep(badStep);
      toast.error("Please fill in the highlighted fields before submitting.");
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

      if (primaryFile) {
        formData.append("picture", primaryFile);
      } else if (primaryPreview) {
        const f = await fetchFile(primaryPreview);
        if (f) formData.append("picture", f);
      }

      if (secondaryFile) {
        formData.append("picturesec", secondaryFile);
      } else if (secondaryPreview) {
        const f = await fetchFile(secondaryPreview);
        if (f) formData.append("picturesec", f);
      }

      if (videoFile) {
        formData.append("video", videoFile);
      } else if (videoPreview) {
        const f = await fetchFile(videoPreview);
        if (f) formData.append("video", f);
      }

      const response = await fetch(`${baseURL}fashionpost`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await response.json();
        toast.success("Product submitted successfully!");
        navigate("/user", { state: { activeTab: "general" } });
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown server error" }));
        toast.error(errorData.error || "Something went wrong! Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong! Please try again.");
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

          <div className="mb-6">
            <div className="hidden items-center sm:flex">
              {STEPS.map((step, index) => {
                const isActive = index === currentStep;
                const isDone = index < currentStep;
                return (
                  <React.Fragment key={step.key}>
                    <button type="button" onClick={() => goToStep(index)} className="flex items-center gap-2 text-left">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          isDone
                            ? "bg-brand-600 text-white"
                            : isActive
                            ? "border-2 border-brand-600 text-brand-600"
                            : "border border-ink-200 text-ink-400"
                        }`}
                      >
                        {isDone ? <AiOutlineCheck size={14} /> : index + 1}
                      </span>
                      <span className={`text-xs font-bold ${isActive || isDone ? "text-ink-900" : "text-ink-400"}`}>
                        {step.label}
                      </span>
                    </button>
                    {index < STEPS.length - 1 && <span className="mx-3 h-px flex-1 bg-ink-200" aria-hidden="true" />}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="sm:hidden">
              <p className="mb-2 text-xs font-bold text-ink-500">
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].label}
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all"
                  style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {currentStep === 0 && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingPhotos(true);
                }}
                onDragLeave={() => setIsDraggingPhotos(false)}
                onDrop={handlePhotoDrop}
                className={`rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
                  isDraggingPhotos ? "border-brand-400 bg-brand-50" : "border-ink-200 bg-ink-50"
                }`}
              >
                <AiOutlineCloudUpload className="mx-auto mb-1 text-ink-400" size={24} />
                <p className="text-xs text-ink-500">
                  Drag photos here, or{" "}
                  <button
                    type="button"
                    onClick={() => photoInputRef.current && photoInputRef.current.click()}
                    className="font-bold text-brand-600 underline underline-offset-2"
                  >
                    browse your device
                  </button>
                </p>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    assignIncomingPhotos(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
                    {primaryPreview && <img src={primaryPreview} alt="Primary" className="h-full w-full object-cover" />}
                  </div>
                  <span className="absolute left-2 top-2 rounded-full bg-ink-900/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Main photo
                  </span>
                  {primaryPreview ? (
                    <button
                      type="button"
                      onClick={() => removeSlot("primary")}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-white shadow-soft hover:bg-ink-800"
                      aria-label="Remove main photo"
                    >
                      <AiOutlineClose size={14} />
                    </button>
                  ) : (
                    <label
                      htmlFor="primaryImage"
                      className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white shadow-soft transition-colors hover:bg-brand-700"
                    >
                      <AiOutlineCloudUpload size={18} />
                    </label>
                  )}
                  <input type="file" id="primaryImage" accept="image/*" className="hidden" onChange={handleSlotFile("primary")} />
                </div>

                <div className="relative">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
                    {secondaryPreview && <img src={secondaryPreview} alt="Secondary" className="h-full w-full object-cover" />}
                  </div>
                  {secondaryPreview ? (
                    <button
                      type="button"
                      onClick={() => removeSlot("secondary")}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-white shadow-soft hover:bg-ink-800"
                      aria-label="Remove second photo"
                    >
                      <AiOutlineClose size={14} />
                    </button>
                  ) : (
                    <label
                      htmlFor="secondaryImage"
                      className="absolute -bottom-2 -right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white shadow-soft transition-colors hover:bg-brand-700"
                    >
                      <AiOutlineCloudUpload size={18} />
                    </label>
                  )}
                  <input type="file" id="secondaryImage" accept="image/*" className="hidden" onChange={handleSlotFile("secondary")} />
                </div>
              </div>

              {primaryPreview && secondaryPreview && (
                <button type="button" onClick={swapPhotos} className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700">
                  <AiOutlineSwap size={14} />
                  Make the second photo the main one
                </button>
              )}

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingVideo(true);
                }}
                onDragLeave={() => setIsDraggingVideo(false)}
                onDrop={handleVideoDrop}
                className={`relative flex h-28 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
                  isDraggingVideo ? "border-brand-400 bg-brand-50" : "border-ink-200 bg-ink-50"
                }`}
              >
                {videoPreview ? (
                  <>
                    <video src={videoPreview} controls className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-white shadow-soft hover:bg-ink-800"
                      aria-label="Remove video"
                    >
                      <AiOutlineClose size={14} />
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => videoInputRef.current && videoInputRef.current.click()} className="flex flex-col items-center gap-1 text-ink-400">
                    <AiOutlineVideoCamera size={20} />
                    <span className="text-xs">Drag a video here, or tap to add one (optional)</span>
                  </button>
                )}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    handleVideoFile(e.target.files && e.target.files[0]);
                    e.target.value = "";
                  }}
                />
              </div>
              <p className="text-xs text-ink-400">
                Listings with at least one clear photo get noticed first - photos and video are optional but recommended.
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product Name"
                  className={fieldClass(showErrorsForCurrentStep && currentStepErrors.name)}
                />
                {showErrorsForCurrentStep && <FieldError message={currentStepErrors.name} />}
              </div>
              <div>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (/^[^0+]\d*$/.test(inputValue) || inputValue === "") {
                      setPrice(inputValue);
                    }
                  }}
                  placeholder="Price"
                  className={fieldClass(showErrorsForCurrentStep && currentStepErrors.price)}
                />
                {showErrorsForCurrentStep && <FieldError message={currentStepErrors.price} />}
              </div>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Give a discount. It is optional. 5, 10 ,15..."
                className={inputClass}
              />
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className={inputClass}>
                <option value="">Select Condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
              <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number +233, +44, +234"
                  className={fieldClass(showErrorsForCurrentStep && currentStepErrors.phone)}
                />
                {showErrorsForCurrentStep && <FieldError message={currentStepErrors.phone} />}
              </div>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^[^0+]\d*$/.test(inputValue) || inputValue === "") {
                    setWhatsapp(inputValue);
                  }
                }}
                placeholder="WhatsApp Number 233, 44, 234"
                className={inputClass}
              />
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product Description"
                  rows={4}
                  className={fieldClass(showErrorsForCurrentStep && currentStepErrors.description)}
                ></textarea>
                {showErrorsForCurrentStep && <FieldError message={currentStepErrors.description} />}
              </div>
              <select value={region} onChange={handleRegionChange} className={inputClass}>
                <option value="">Select Region</option>
                {withCustomOption(region, GHANA_REGIONS).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <select
                value={town}
                onChange={(e) => setTown(e.target.value)}
                disabled={!region}
                className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <option value="">{region ? "Select Town" : "Select a region first"}</option>
                {withCustomOption(town, TOWNS_BY_REGION[region] || []).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className={fieldClass(showErrorsForCurrentStep && currentStepErrors.location)}
                />
                {showErrorsForCurrentStep && <FieldError message={currentStepErrors.location} />}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1 rounded-xl border border-ink-200 bg-white py-3 text-sm font-bold text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-50"
              >
                Back
              </button>
            )}
            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`flex-1 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700 ${
                  isLoading ? "opacity-50" : ""
                }`}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SingleProductForm;
