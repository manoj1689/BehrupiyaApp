/* eslint-disable @next/next/no-img-element */
"use client";
import "../globals.css";
import { MdFileUpload } from "react-icons/md";
import { RiCloseCircleFill } from "react-icons/ri";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import React, { useContext } from 'react';
import { MyContext } from '../context/CreditContex'; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { IoCameraSharp } from "react-icons/io5";
import { useSession, signIn } from "next-auth/react";
import handleDeductCredit  from "../components/creditButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CgPushChevronRight } from "react-icons/cg";
import FaceDetection from "./FaceDetection"
interface Prompt {
  id: string;
  src: string;
  alt: string;
  name: string;
}

interface Category {
  name: string;
  prompts: Prompt[];
}

export default function HomePage() {
  const { data: session } = useSession();
  const { state, setState } = useContext(MyContext);

  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const imagesPerPage = 9;
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [promptMap, setPromptMap] = useState<Map<string, string>>(new Map());
  const [positivePrompt, setPositivePrompt] = useState<string | null>(null);
  const [negativePrompt, setNegativePrompt] = useState<string | null>("");
  const [selectedCinematic, setSelectedCinematic] =
    useState<string>("cinematic");
  // const [selectedImageSize, setSelectedImageSize] = useState<string>("1:1");
  const [selectedDressStyle, setSelectedDressStyle] =
    useState<string>("traditional");
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const [selectedModel, setSelectedModel] = useState("cinematic");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const models = ["Cinematic", "Artistic", "Photographic"];

  const [selectedImageSize, setSelectedImageSize] = useState("512px*512px");
  const [isModalOpen1, setIsModalOpen1] = useState(false);

  const aspectRatios = [
    { label: "1:1", value: "512px*512px", icon: "□" },
    { label: "4:3", value: "680px*384px", icon: "▭" },
    { label: "3:4", value: "384px*680px", icon: "▯" },
    { label: "3:2", value: "768px*344px", icon: "▭" },
    { label: "2:3", value: "344px*768px", icon: "▯" },
    { label: "4:5", value: "408px*640px", icon: "▯" },
    { label: "5:4", value: "640px*408px", icon: "▭" },
  ];

  const selectedAspectRatioLabel =
    aspectRatios.find((ratio) => ratio.value === selectedImageSize)?.label ||
    "1:1";

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data.json");
      const data = await response.json();

      const categoryMap: Record<string, Prompt[]> = {};

      data.forEach((item: any) => {
        Object.keys(item).forEach((category) => {
          if (!categoryMap[category]) {
            categoryMap[category] = [];
          }
          if (item[category].length > 0) {
            item[category].forEach((imgData: any) => {
              categoryMap[category].push({
                id: imgData["Prompt ID"],
                src: imgData["Image URL"].startsWith("/")
                  ? imgData["Image URL"]
                  : `/${imgData["Image URL"]}`,
                alt: imgData["Prompt"],
                name: imgData["Name"],
              });
            });
          }
        });
      });

      const categoryList = Object.keys(categoryMap).map((name) => ({
        name,
        prompts: categoryMap[name],
        icon: `/icons/${name.toLowerCase().replace(/\s+/g, "-")}.png`,
      }));

      setCategories(categoryList);

      setPromptMap(
        new Map(
          categoryList.flatMap((cat) => cat.prompts.map((p) => [p.id, p.alt]))
        )
      );

      if (categoryList.some((cat) => cat.name === "Sikh Culture")) {
        setSelectedCategory("Sikh Culture");
      }
      window.scrollTo(0, 0);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setCurrentPage(1); // Reset page when category changes
    }
  }, [selectedCategory]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat.name === selectedCategory);
      if (category && category.prompts.length > 0) {
        const firstImage = category.prompts[0];
        setSelectedImageId(firstImage.id);
        setPositivePrompt(firstImage.alt); // Set the prompt for the first image
      }
    }
  }, [selectedCategory, categories]);
  const getVisibleImages = () => {
    if (!selectedCategory) return [];
    const category = categories.find((cat) => cat.name === selectedCategory);
    if (!category) return [];

    const startIndex = (currentPage - 1) * imagesPerPage;
    const endIndex = startIndex + imagesPerPage;
    return category.prompts.slice(0, endIndex);
  };

  const hasMoreImages = () => {
    if (!selectedCategory) return false;
    const category = categories.find((cat) => cat.name === selectedCategory);
    if (!category) return false;

    return category.prompts.length > currentPage * imagesPerPage;
  };

  const resetParameters = () => {
    // setUploadedImages([]);
    setGeneratedImage(null);
    setImageDimensions(null);
    // setSelectedCategory(null);
    setSelectedPrompt(null);
    setSelectedImageId(null);
    setPositivePrompt(null);
    setNegativePrompt("");
    setSelectedCinematic("cinematic");
    setSelectedDressStyle("traditional");
    setSelectedModel("cinematic");
    setSelectedImageSize("1024px*1024px");
    setIsModalOpen(false);
    setIsModalOpen1(false);
  };

  const handleGenerateNewImage = () => {
    resetParameters();
    window.scrollTo(0, 0);
  };

  // Parse the selected image size
  const [imageWidth, imageHeight] = selectedImageSize
    .split("*")
    .map((s) => parseInt(s.replace("px", ""), 10));
   
   
    const handleDeductCredit = async (email: string) => {
      setLoading(true);
      setMessage(null);
      console.log("handle deduct Credit");
      try {
        const response = await axios.post("/api/update-credits", {
          email,
          credits: -1, // Deduct 1 credit
        });
    
        setCredits(response.data.credits);
        setState(response.data.credits); // Update context state
        setMessage(`Credits updated! Remaining credits: ${response.data.credits}`);
      } catch (error) {
        console.error("Error updating credits:", error);
        setMessage("Failed to update credits.");
      } finally {
        setLoading(false);
      }
    };
    
    const handleGenerate = async () => {
      // Check if there are uploaded images and a valid prompt
      if (uploadedImages.length === 0 || !positivePrompt) {
        alert("Please upload an image and enter positive/negative prompts.");
        return;
      }
    
      // Modify the positive prompt based on selected values
      const modifiedPrompt = positivePrompt
        ?.replace(/{cinematic_style}/gi, selectedModel)
        .replace(/{image_size}/gi, selectedImageSize)
        .replace(/{dress_style}/gi, selectedDressStyle);
    
      console.log("Modified Prompt:", modifiedPrompt);
      console.log("Style:", selectedModel);
      console.log("Parsed Width:", imageWidth);
      console.log("Parsed Height:", imageHeight);
    
      // Prepare the form data
      const formData = new FormData();
      uploadedImages.forEach((file) => formData.append("files", file));
      formData.append("prompt", modifiedPrompt || "");
      formData.append("style", selectedModel || "");
      formData.append("width", imageWidth.toString());
      formData.append("height", imageHeight.toString());
      formData.append("steps", "50");
      formData.append(
        "negative_prompt",
        "Multiple faces, nudity, cartoonish, deformed, ugly, blurry, noisy, low-quality, text, watermark, grainy, glitch, distorted, low-resolution, off-center, mutated, disfigured, missing limbs, extra limbs, unnatural lighting, overly stylized, excessive shadows, incorrect anatomy, inappropriate expressions"
      );
    
      setIsGenerating(true);
      console.log("Credit values at feature page:", state);
    
      try {
        // Make a POST request to the image generation API
        const response = await fetch("/api/generate-image", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Failed to generate image");
        }
    
        // Process the response
        const result = await response.json();
        setGeneratedImage(result.image_url);
    
        // Load the image to get its dimensions
        const img = new window.Image();
        img.src = result.image_url;
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
        };
    
      // console.log("Image URL successful");
    
        // Deduct the user's credit
        if (session?.user?.email ) {
          await handleDeductCredit(session.user.email);
        }
      } catch (error) {
        console.error("Error generating image:", error);
      } finally {
        setIsGenerating(false);
      }
    };
    

  const handleImageSelect = (id: string) => {
    const prompt = promptMap.get(id);
    if (prompt) {
      setPositivePrompt(prompt);
      setSelectedImageId(id);
      if (cardsRef.current) {
        const rect = cardsRef.current.getBoundingClientRect();
        window.scrollTo({
          top: window.scrollY + rect.top,
          left: window.scrollX + rect.left,
          behavior: "smooth",
        });
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handle image called");
    const files = Array.from(event.target.files || []);
    setUploadedImages(files); // Reset the uploaded images with the new files
  };
  console.log("lemgth of uploaded Images", uploadedImages.length);
  // Handle "Change Image" click to clear the uploaded images
  const handleChangeImage = () => {
    setUploadedImages([]);
    // Clear all previously uploaded images
  };

  const handleImageRemove = (index: number) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setUploadedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handlePromptChange = (id: string, newPrompt: string) => {
    setPromptMap((prevMap) => new Map(prevMap.set(id, newPrompt)));
    if (selectedImageId === id) {
      setPositivePrompt(newPrompt);
    }
  };



  const handleDownload = () => {
    if (generatedImage) {
      window.open(generatedImage, "_blank"); // Open the image in a new tab
    }
  };

  const handleGenerateImage = () => {
    if (uploadedImages.length === 0) {
      toast.error("Please upload an image."); // Show error toast
      return;
    }

    if (!positivePrompt) {
      toast.error("Please enter positive/negative prompts."); // Show error toast
      return;
    }
    if (!session) {
      signIn("google"); // Redirects to Google sign-in
      return;
    }
   if(state >0){
      // Proceed with image generation if session exists
    handleGenerate();    
   }else{
    toast.error("Not Enough Credits ,Add Credits");
   }
   

  };

 
  
  const isButtonDisabled = uploadedImages.length === 0 || !positivePrompt;
  const buttonClassName = isButtonDisabled
    ? "px-6 py-3 bg-red-600 text-white rounded-lg cursor-not-allowed"
    : "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors";

  return (
    <>
      <div className="bg-black">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    
        <div className="w-full p-2 text-white text-center">
          <h1 className="text-lg:sm:text-xl font-raleway font-bold uppercase">
            Unleash your inner Behrupiya
            <span className="normal-case font-raleway font-normal">
              {" "}
              - where Tradition meets Technology-
            </span>
          </h1>
        </div>
        {/* Main Content Area for mobile View */}
        <div className="block sm:hidden w-full bg-white">
          <div>
            <h1 className="text-xl lg:text-2xl font-raleway font-normal text-gray-500 px-4 sm:my-4">
              Recommended Images
            </h1>
          </div>

          <div className="flex mb-4">
            <div className="w-11/12 grid grid-flow-col gap-2 overflow-x-auto scroll-smooth ">
              {getVisibleImages().map((prompt) => (
                <div className="flex flex-col pt-2" key={prompt.id}>
                  <div
                    className={`bg-white shadow-lg rounded-xl cursor-pointer  transition-transform duration-300   w-32 m-2 ${
                      selectedImageId === prompt.id
                        ? "scale-105 border-4 border-blue-400 bg-blue-400  shadow-sky-600"
                        : "border-4  border-white"
                    }`}
                    onClick={() => handleImageSelect(prompt.id)}
                  >
                    <Image
                      src={prompt.src}
                      alt={prompt.alt}
                      width={100}
                      height={100}
                      className="w-32 h-auto object-cover rounded-md"
                    />
                  </div>
                  <div className="flex text-gray-500 font-raleway font-normal text-sm  pb-2 justify-center">
                    {prompt.name}
                  </div>
                </div>
              ))}
            </div>
            <div
              className={` shadow-lg flex w-1/12 justify-center items-center  ${
                hasMoreImages() ? " text-blue-600" : " text-gray-500"
              }`}
              onClick={handleLoadMore}
            >
              {hasMoreImages() ? (
                <MdKeyboardArrowRight size={50} />
              ) : (
                <CgPushChevronRight size={50} />
              )}
            </div>
          </div>
        </div>

        <div className="flex ">
          <div className=" flex  lg:1/4 xl:w-1/3 ">
            {/* Sidebar */}
            <div className="w-full sm:w-1/4 md:1/5 flex flex-col  items-center gap-2">
              {categories.map((category) => {
                const isClickable =
                  category.name === "Muslim Influences" ||
                  category.name === "Sikh Culture" ||
                  category.name === "Freedom Fighter" ||
                  category.name === "Identity Mixing" ||
                  category.name === "Indian Superhero" ||
                  category.name === "Religional Attire";

                const isSelected = selectedCategory === category.name;

                return (
                  <button
                    key={category.name}
                    className={`relative flex flex-col items-center text-white  mx-2  w-full ${
                      isClickable
                        ? isSelected
                          ? "bg-gray-800" // Apply this background when selected
                          : "bg-black" // Default background
                        : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (isClickable) {
                        setSelectedCategory(category.name);
                      }
                    }}
                    disabled={!isClickable}
                  >
                    {/* Change the icon if selected */}
                    <img
                      src={`/icons/${
                        isSelected
                          ? `${category.name
                              .toLowerCase()
                              .replace(/\s+/g, "-")}-00`
                          : category.name.toLowerCase().replace(/\s+/g, "-")
                      }.png`}
                      alt={`${category.name} icon`}
                      className="pt-2 w-8"
                    />
                    <span
                      className={`flex max-w-24 text-sm xl:text-md  justify-center items-center pt-1 pb-2 px-2 md:px-0 ${
                        isSelected
                          ? "text-blue-600 font-raleway font-bold "
                          : "text-white font-raleway font-normal"
                      }`}
                    >
                      {category.name}
                    </span>

                    {/* Add a pointer if the category is selected */}
                    {isSelected && (
                      <span className="max-sm:hidden absolute  right-[-8px] top-1/4 transform-translate-y-1/2 border-t-8 border-b-8 border-l-8 border-gray-800 border-t-transparent border-b-transparent" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="max-sm:hidden block  sm:w-3/4 md:4/5 p-2  bg-white">
              <div className="flex flex-col h-4/5 ">
                <h1 className="text-xl lg:text-2xl font-raleway font-normal  text-gray-400 m-2 ">
                  Recommended Images
                </h1>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2"
                  style={{
                    maxHeight: "550px",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                  }} // Enable auto scrollbar visibility
                >
                  {getVisibleImages().map((prompt) => (
                    <div key={prompt.id} className="flex flex-col">
                      <div
                        className={`bg-white shadow-lg  rounded-xl cursor-pointer transition-transform duration-300 ${
                          selectedImageId === prompt.id
                            ? "scale-105 border-4 border-blue-400 bg-blue-400  shadow-sky-600"
                            : "border-4 border-white"
                        }`}
                        onClick={() => handleImageSelect(prompt.id)}
                      >
                        <Image
                          src={prompt.src}
                          alt={prompt.alt}
                          width={100}
                          height={100}
                          className="w-full h-auto object-cover rounded-md"
                        />
                      </div>
                      <div className="flex text-gray-500 font-raleway font-normal text-sm pt-2 justify-center">
                        {prompt.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col  h-1/5 justify-center items-center">
                <div>
                  <button
                    className={`px-4 md:px-12 py-2 rounded-full ${
                      hasMoreImages()
                        ? "bg-[#2563ec] text-white"
                        : "bg-slate-400 text-white"
                    }`}
                    onClick={handleLoadMore}
                  >
                    <span className="flex items-center ">
                      <span className="flex w-full text-md font-raleway font-normal">
                        Load more
                      </span>
                      <span>
                        <MdKeyboardArrowRight size={20} />
                      </span>
                      {hasMoreImages() ? (
                        <span>
                          <MdKeyboardArrowRight size={20} />
                        </span>
                      ) : (
                        <span>
                          <CgPushChevronRight size={20} />
                        </span>
                      )}
                    </span>
                  </button>
                </div>
                <div className="my-4 flex flex-col lg:flex-row justify-center items-center lg:gap-2">
                  <div className="text-[#2563ec] font-raleway font-normal  ">
                    sponsored results by{" "}
                  </div>
                  <div className="uppercase text-[#2563ec] font-raleway font-extrabold">
                    ERAM LABS
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel for large desktop */}
          <div className="hidden xl:block m-8 justify-center border-4 border-dotted border-gray-500 bg-[#3f4044] rounded-3xl  flex-row items-center w-2/3">

            <div className=" flex px-8 py-12 h-full ">
              <div className="flex flex-col rounded-3xl bg-[#3a3b40] xl:w-1/2 2xl:w-2/5 ">
                {/* Image Upload Section */}
                <div className="flex w-full h-2/3">
                  {" "}
                  {/* Image Upload Section */}
                  <div
                    className="relative w-full text-center rounded-2xl hover:bg-[#3f5061] gap-12 flex flex-col items-center justify-center"
                    style={{ color: "#ffffff" }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <img
                      src="/images/New/default_img.png"
                      alt="Upload Icon"
                      className=" w-35 h-35 mt-16 text-gray-600"
                    />
                    <span className="text-gray-400  font-raleway font-medium text-xl">
                      No Photo edit yet
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(event) => {
                        handleChangeImage(); // Reset previously uploaded images
                        handleImageUpload(event); // Upload new images
                      }}
                      className="hidden"
                    />
                    <label className="cursor-pointer flex flex-col items-center">
                      {uploadedImages.length > 0 && (
                        <div
                          className={`absolute inset-0 p-2 rounded-lg overflow-auto grid gap-2`}
                          style={{
                            backgroundColor: "#35383d",
                            gridTemplateColumns:
                              uploadedImages.length === 1
                                ? "1fr"
                                : uploadedImages.length === 2 ||
                                  uploadedImages.length === 4
                                ? "repeat(2, 1fr)"
                                : "repeat(3, 1fr)", // Adjust grid columns
                            gridAutoRows: "auto",
                          }}
                        >
                          {uploadedImages.map((file, index) => (
                            <div
                              key={index}
                              className="relative bg-gray-200  rounded-lg overflow-hidden flex items-center justify-center"
                            >
                            
                              {/* <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-contain bg-[#35383d]"
                              /> */}
                             <FaceDetection uploadedImage={file}/>
                             
                              <RiCloseCircleFill
                                size={30}
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() => handleImageRemove(index)} // Remove the image
                              />
                            </div>
                          ))}
                       
                        </div>
                      )}{" "}
                    </label>
                  </div>
                </div>

                {/* Models and Aspect Ratio Buttons */}
                <div className=" flex w-full h-1/3 justify-center items-center">
                  <div className="flex flex-col w-full ">
                    {/* Models and Aspect Ratio in One Row */}
                    <div className="flex flex-col xl:flex-row w-full justify-center items-center gap-2 px-4 ">
                      {/* Models Dropdown */}
                      <div className="flex relative w-full ">
                        <button
                          onClick={() => setIsModalOpen(!isModalOpen)}
                          className="flex items-center text-white  py-2 w-full justify-center rounded-full border bg-[#3a3b40] hover:bg-[#313236] border-white"
                        >
                          <div>
                            <IoCameraSharp size={30} />
                          </div>
                          <div className="flex flex-col ">
                            <span className="px-4 text-md font-raleway font-normal">
                              Models
                            </span>
                            <span className="text-blue-400 text-xs font-raleway font-normal">
                              {models.find(
                                (model) =>
                                  model.toLowerCase() ===
                                  selectedModel.toLowerCase()
                              ) || "Artistic"}
                            </span>
                          </div>
                        </button>
                        {isModalOpen && (
                          <div className="absolute mt-2 bg-slate-800 text-white py-2 w-48 rounded-lg z-10">
                            {models.map((model) => (
                              <button
                                key={model}
                                onClick={() => {
                                  setSelectedModel(model.toLowerCase());
                                  setIsModalOpen(false);
                                }}
                                className={`block w-full text-left font-raleway font-normal px-4 py-2 hover:bg-slate-500 hover:text-black ${
                                  selectedModel === model.toLowerCase()
                                    ? "bg-gray-600 "
                                    : ""
                                }`}
                              >
                                {model}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Aspect Ratio Button */}
                      <div className="flex relative w-full ">
                        <button
                          onClick={() => setIsModalOpen1(true)}
                          className="flex items-center rounded-full w-full justify-center border bg-[#3a3b40] hover:bg-[#313236] border-white text-white  py-4"
                        >
                          <div className="px-1 text-white rounded-0 text-sm ml-1 border-2 border-white">
                            {selectedAspectRatioLabel}
                          </div>
                          <span className="ml-2 text-sm font-raleway font-normal">
                            Aspect Ratio
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Change Image Button in the Next Row */}
                    <div className="flex justify-center items-center">
                      <button
                        className="w-full m-4 bg-[#2563ec] hover:bg-blue-700 text-white text-sm font-raleway font-normal flex items-center justify-center py-2 gap-5 rounded-3xl"
                        onClick={() => {
                          // Trigger file input click to upload/change images
                          const fileInput =
                            document.getElementById("image-upload-input");
                          if (fileInput) {
                            fileInput.click(); // Programmatically click the hidden file input
                          }
                        }}
                      >
                        <MdFileUpload size={36} />
                        {uploadedImages.length > 0
                          ? "Change Images"
                          : "Upload Images"}
                      </button>

                      {/* Hidden file input for uploading images */}
                      <input
                        type="file"
                        id="image-upload-input"
                        multiple={true} // Only allow one image to be uploaded at a time
                        accept="image/*"
                        onChange={(event) => {
                          handleImageUpload(event); // Upload new image, replacing the old one
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Aspect Ratio Modal */}
                  {isModalOpen1 && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                      <div className="bg-white rounded-lg p-6 max-w-lg">
                        <h3 className="text-lg text-black font-raleway font-bold mb-4">
                          Aspect Ratio
                        </h3>
                        <div className="grid grid-cols-3 text-black gap-4">
                          {aspectRatios.map((ratio) => (
                            <button
                              key={ratio.label}
                              onClick={() => {
                                setSelectedImageSize(ratio.value);
                                setIsModalOpen1(false);
                              }}
                              className={`border rounded-lg px-4 py-2 flex  flex-col items-center justify-center ${
                                selectedImageSize === ratio.value
                                  ? "border-blue-500 text-blue-500 "
                                  : "border-gray-500 text-gray-500 "
                              }`}
                            >
                              <span className="text-xl">{ratio.icon}</span>
                              <span className="m-2">{ratio.label}</span>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setIsModalOpen1(false)}
                          className="mt-4 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-full font-raleway font-normal text-white "
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Generated Image Section */}
              <div className="flex flex-col  xl:w-1/2 2xl:w-3/5 ">
                {/* Image Container with Fixed Height */}
                <div className="flex items-center justify-center ml-4 rounded-lg h-3/4  ">
                  {isGenerating ? (
                    <div className="flex justify-center items-center">
                      <ClipLoader color="#0000FF" size={50} />
                    </div>
                  ) : generatedImage ? (
                    <>
                      <div className="flex w-full  justify-center  items-center">
                        <img
                          src={generatedImage}
                          alt="Generated"
                          className="rounded-lg w-[60%]  object-contain"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500 py-8 flex flex-col  items-center justify-center text-xl">
                      <img src="/icon.png" alt="Upload Icon" />
                      <div className="mt-8 font-raleway font-normal text-gray-400">
                        No Image
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex w-full flex-col justify-center  pt-4  h-1/4">
                  {/* Footer Buttons */}
                  {generatedImage && (
                    <div className="flex flex-col gap-5 justify-center items-center ">
                      <button
                        onClick={handleGenerateNewImage}
                        className="flex w-full xl:w-2/3   bg-[#2563ec] justify-center font-raleway font-normal text-white py-4 rounded-full hover:bg-sky-700 "
                      >
                        Re-Genreate
                      </button>

                      <div
                        onClick={handleDownload}
                        className="flex w-full justify-center items-center text-white"
                      >
                        <span className="inline-block border-b-2 font-raleway font-normal border-white">
                          Download Image
                        </span>
                      </div>
                    </div>
                  )}
                  {!generatedImage && (
                    <div className=" flex justify-center items-center ">
                      <button
                        onClick={() => {
                          if (isGenerating) {
                            return; // Prevent multiple generations if already in progress
                          }

                          handleGenerateImage(); // Check session before generating
                        }}
                        className={`text-white p-4 w-full xl:w-2/3 rounded-full transition-colors ${
                          isGenerating
                            ? "bg-[#2563ec] cursor-not-allowed font-raleway font-normal"
                            : "bg-[#2563ec] hover:bg-blue-700 font-raleway font-normal"
                        }`}
                        disabled={isGenerating}
                      >
                        {isGenerating
                          ? "Generating Image ..."
                          : "Generate Image"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Laptop screens resolutions   */}
          <div className="block xl:hidden w-full m-4 justify-center border-4 border-dotted border-gray-500 bg-[#24272c] rounded-3xl flex-col sm:w-3/4 p-2 ">
            <div className="flex  flex-col items-center bg-[#464950]  h-1/2 rounded-xl w-full  ">
              {/* Image Upload Section */}
              <div className="flex  w-full h-1/2 sm:h-2/3">
                <label className="cursor-pointer flex w-full flex-col">
                  {" "}
                  {/* Image Upload Section */}
                  <div
                    className="relative w-full h-full  text-center rounded-lg hover:bg-[#3b3e44] flex flex-col items-center justify-center"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <img
                      src="/images/New/default_img.png"
                      alt="Upload Icon"
                      className="mb-2 w-24 h-24 "
                    />
                    <span className="text-gray-400 font-raleway font-normal text-xl mt-4">
                      No Photo edit yet
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(event) => {
                        handleChangeImage(); // Reset previously uploaded images
                        handleImageUpload(event); // Upload new images
                      }}
                      className="hidden"
                    />

                    {uploadedImages.length > 0 && (
                      <div
                        className={`absolute inset-0 p-2 rounded-lg overflow-auto grid gap-2`}
                        style={{
                          backgroundColor: "#35383d",
                          gridTemplateColumns:
                            uploadedImages.length === 1
                              ? "1fr"
                              : uploadedImages.length === 2 ||
                                uploadedImages.length === 4
                              ? "repeat(2, 1fr)"
                              : "repeat(3, 1fr)", // Adjust grid columns
                          gridAutoRows: "auto",
                          gridTemplateRows:
                            uploadedImages.length === 1
                              ? "1fr"
                              : uploadedImages.length === 2
                              ? "1fr"
                              : uploadedImages.length === 4 ||
                                uploadedImages.length === 6
                              ? "repeat(2, 1fr)"
                              : "repeat(3, 1fr)",
                        }}
                      >
                        {uploadedImages.map((file, index) => {
                          return (
                            <div
                              key={index}
                              className="relative bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
                              style={{
                                gridRow: `span 1`,
                              }}
                            >
                              {/* Image Styling */}
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-contain bg-[#35383d]"
                              />

                              {/* Close Button */}

                              <RiCloseCircleFill
                                size={30}
                                className="absolute top-2 right-2 "
                                onClick={() => handleImageRemove(index)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Models and Aspect Ratio Buttons */}
              <div className=" flex w-full h-1/2 sm:h-1/3  justify-center items-center px-2 ">
                <div className="flex flex-col w-full  ">
                  {/* Models and Aspect Ratio in One Row */}
                  <div className="flex flex-row gap-2  w-full justify-center items-center ">
                    {/* Models Dropdown */}
                    <div className="flex  relative w-full ">
                      <button
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        className="flex items-center text-white  py-1 text-sm w-full justify-center rounded-full border bg-[#3a3b40] hover:bg-[#313236]  border-white"
                      >
                        <div className="mx-1 sm:mx-2">
                          <IoCameraSharp size={20} />
                        </div>

                        <div className="flex flex-col ">
                          <span className=" text-xs sm:text-sm md:text-md font-raleway font-normal">
                            Models
                          </span>
                          <span className="text-blue-400 text-[10px] font-raleway font-normal sm:text-xs">
                            {models.find(
                              (model) =>
                                model.toLowerCase() ===
                                selectedModel.toLowerCase()
                            ) || "Artistic"}
                          </span>
                        </div>
                      </button>
                      {isModalOpen && (
                        <div className="absolute mt-2 bg-gray-800 text-white font-raleway font-normal  py-2 w-48 rounded-lg z-10">
                          {models.map((model) => (
                            <button
                              key={model}
                              onClick={() => {
                                setSelectedModel(model.toLowerCase());
                                setIsModalOpen(false);
                              }}
                              className={`block w-full text-left px-4 py-2  hover:bg-slate-800 hover:text-gray-800 ${
                                selectedModel === model.toLowerCase()
                                  ? "bg-gray-600  "
                                  : ""
                              }`}
                            >
                              {model}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="hidden lg:block w-full justify-center items-center">
                      <button
                        className="w-full bg-[#2563ec] hover:bg-blue-700 font-raleway font-normal text-white text-xs sm:text-sm md:text-md flex items-center justify-center py-2  rounded-full"
                        onClick={() => {
                          if (uploadedImages.length > 0) {
                            // If images exist, trigger the change image functionality
                            handleChangeImage(); // Clear the uploaded images
                          } else {
                            // Check if the element exists before triggering the file input click
                            const fileInput =
                              document.getElementById("image-upload-input");
                            if (fileInput) {
                              fileInput.click(); // Programmatically click the hidden file input
                            }
                          }
                        }}
                      >
                        <MdFileUpload size={30} />
                        {uploadedImages.length > 0
                          ? "Remove Image"
                          : "Upload Images"}
                      </button>

                      {/* Hidden file input for uploading images */}
                      <input
                        type="file"
                        id="image-upload-input"
                        multiple
                        accept="image/*"
                        onChange={(event) => {
                          handleChangeImage(); // Clear previously uploaded images
                          handleImageUpload(event); // Upload new images
                        }}
                        className="hidden"
                      />
                    </div>
                    {/* Aspect Ratio Button */}
                    <div className="flex relative w-full ">
                      <button
                        onClick={() => setIsModalOpen1(true)}
                        className="flex items-center rounded-full w-full justify-center border bg-[#3a3b40] hover:bg-[#313236] border-white text-white  sm:py-3"
                      >
                        <div className="px-1 text-white rounded-0 text-xs sm:text-sm md:text-md ml-1 border-2 border-white">
                          {selectedAspectRatioLabel}
                        </div>
                        <span className="hidden sm:block font-raleway font-normal ml-2 text-xs sm:text-sm md:text-md">
                          Aspect Ratio
                        </span>
                        <div className="block sm:hidden font-raleway font-normal flex-col ml-2 text-xs sm:text-sm md:text-md py-1">
                          <div>Aspect</div>
                          <div>Ratio</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Change Image Button in the Next Row */}
                  <div className="block lg:hidden w-full mx-auto mt-2 justify-center items-center">
                    <button
                      className="w-full  bg-blue-600 text-white font-raleway font-normal text-sm flex items-center justify-center py-2  rounded-3xl"
                      onClick={() => {
                        if (uploadedImages.length > 0) {
                          // If images exist, trigger the change image functionality
                          handleChangeImage(); // Clear the uploaded images
                        } else {
                          // Check if the element exists before triggering the file input click
                          const fileInput =
                            document.getElementById("image-upload-input");
                          if (fileInput) {
                            fileInput.click(); // Programmatically click the hidden file input
                          }
                        }
                      }}
                    >
                      <MdFileUpload size={25} />
                      {uploadedImages.length > 0
                        ? "Remove Image"
                        : "Upload Images"}
                    </button>

                    {/* Hidden file input for uploading images */}
                    <input
                      type="file"
                      id="image-upload-input"
                      multiple
                      accept="image/*"
                      onChange={(event) => {
                        handleChangeImage(); // Clear previously uploaded images
                        handleImageUpload(event); // Upload new images
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Aspect Ratio Modal */}
                {isModalOpen1 && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white rounded-lg p-6 max-w-lg">
                      <h3 className="text-lg text-black font-raleway  font-bold mb-4">
                        Aspect Ratio
                      </h3>
                      <div className="grid grid-cols-3 text-black gap-4">
                        {aspectRatios.map((ratio) => (
                          <button
                            key={ratio.label}
                            onClick={() => {
                              setSelectedImageSize(ratio.value);
                              setIsModalOpen1(false);
                            }}
                            className={`border rounded-lg px-4 py-2 flex flex-col items-center justify-center ${
                              selectedImageSize === ratio.value
                                ? "border-blue-500 text-blue-500"
                                : "border-gray-400 text-gray-600"
                            }`}
                          >
                            <span className="text-xl">{ratio.icon}</span>
                            <span className="mt-2">{ratio.label}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setIsModalOpen1(false)}
                        className="mt-4 px-4 py-2 bg-blue-500 font-raleway font-normal w-full rounded-full text-white "
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Generated Image Section */}
            <div className=" flex flex-col w-full h-1/2  justify-end">
              {/* Image Container with Fixed Height */}
              <div className="flex items-center justify-center h-3/4 rounded-lg ">
                {isGenerating ? (
                  <div className="flex justify-center items-center h-full">
                    <ClipLoader color="#0000FF" size={50} />
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className=" w-48  rounded-xl object-contain"
                  />
                ) : (
                  <div className="text-gray-400  flex flex-col font-raleway font-normal items-center justify-center text-xl sm:text-2xl">
                    <img src="/icon.png" alt="Upload Icon" className="w-40" />
                    <div className="font-raleway font-normal mt-4">
                      No Image{" "}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              {generatedImage && (
                <div className="flex flex-col  justify-center h-1/4 items-center">
                  <button
                    onClick={handleGenerateNewImage}
                    className="flex w-full sm:w-1/2 bg-[#2563ec] justify-center font-raleway font-normal text-white py-2 rounded-full hover:bg-sky-700 "
                  >
                    Re-Genreate
                  </button>

                  <div
                    onClick={handleDownload}
                    className="flex w-full justify-center items-center text-white"
                  >
                    <span className="inline-block border-b-2 font-raleway font-normal border-white text-sm my-2">
                      Download Image
                    </span>
                  </div>
                </div>
              )}

              {!generatedImage && (
                <div
                  className="p-4 flex justify-center items-center h-1/4"
                  style={{ backgroundColor: "#24272c" }}
                >
                  <button
                    onClick={() => {
                      if (isGenerating) {
                        return; // Prevent multiple generations if already in progress
                      }

                      handleGenerateImage(); // Check session before generating
                    }}
                    className={`text-white p-3 w-full md:w-2/3 font-raleway font-normal rounded-full transition-colors ${
                      isGenerating
                        ? "bg-blue-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating Image ..." : "Generate Image"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
