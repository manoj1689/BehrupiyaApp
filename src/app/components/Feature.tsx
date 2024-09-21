/* eslint-disable @next/next/no-img-element */
"use client";
import "../globals.css";
import { MdFileUpload } from "react-icons/md";
import { RiCloseCircleFill } from "react-icons/ri";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import { IoCameraSharp } from "react-icons/io5";
import { useSession } from "next-auth/react";
import { handleDeductCredit } from "../components/creditButton";
interface Prompt {
  id: string;
  src: string;
  alt: string;
}

interface Category {
  name: string;
  prompts: Prompt[];
}

export default function HomePage() {
  //   useEffect(() => {
  //     // Disable right-click (context menu)
  //     const handleContextMenu = (e: { preventDefault: () => any }) =>
  //       e.preventDefault();

  //     // Disable copy (cut/copy/paste)
  //     const handleCopyCut = (e: { preventDefault: () => any }) =>
  //       e.preventDefault();

  //     // Add event listeners
  //     document.addEventListener("contextmenu", handleContextMenu);
  //     document.addEventListener("copy", handleCopyCut);
  //     document.addEventListener("cut", handleCopyCut);
  //     document.addEventListener("paste", handleCopyCut);

  //     return () => {
  //       // Clean up event listeners
  //       document.removeEventListener("contextmenu", handleContextMenu);
  //       document.removeEventListener("copy", handleCopyCut);
  //       document.removeEventListener("cut", handleCopyCut);
  //       document.removeEventListener("paste", handleCopyCut);
  //     };
  //   }, []);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
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
    setSelectedImageSize("512px*512px");
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

  const handleGenerate = async () => {
    if (uploadedImages.length === 0 || !positivePrompt) {
      alert("Please upload an image and enter positive/negative prompts.");
      return;
    }

    const modifiedPrompt = positivePrompt
      ?.replace(/{cinematic_style}/gi, selectedModel)
      .replace(/{image_size}/gi, selectedImageSize)
      .replace(/{dress_style}/gi, selectedDressStyle);

    console.log("Modified Prompt:", modifiedPrompt);
    console.log("Style:", selectedModel);
    console.log("Parsed Width:", imageWidth);
    console.log("Parsed Height:", imageHeight);

    const formData = new FormData();
    uploadedImages.forEach((file) => formData.append("files", file));
    formData.append("prompt", modifiedPrompt || "");
    formData.append("style", selectedModel || "");
    formData.append("width", imageWidth.toString());
    formData.append("height", imageHeight.toString());
    formData.append("steps", "50");
    formData.append(
      "negative_prompt",
      "Multiple faces, nudity, cartoonish, deformed, ugly, blurry, noisy, low-quality, text, watermark, grainy, glitch, distorted, low-resolution, off-center, mutated, disfigured, missing limbs, extra limbs, unnatural lighting, overly stylized, excessive shadows, incorrect anatomy, inappropriate expressions" ||
        ""
    );

    setIsGenerating(true);

    try {
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

      const result = await response.json();
      setGeneratedImage(result.image_url);

      const img = new window.Image();
      img.src = result.image_url;
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
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
    const files = Array.from(event.target.files || []);
    setUploadedImages(files); // Reset the uploaded images with the new files
  };

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
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isButtonDisabled = uploadedImages.length === 0 || !positivePrompt;
  const buttonClassName = isButtonDisabled
    ? "px-6 py-3 bg-red-600 text-white rounded-lg cursor-not-allowed"
    : "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors";

  return (
    <>
      <div className="bg-black">
        <div className="w-full py-2 text-white text-center">
          <h1 className="text-xl font-sans font-bold uppercase">
            Unleash your innea
            <span className="normal-case font-normal">
              {" "}
              - where Tradition meets Technology-
            </span>
          </h1>
        </div>
       {/* Main Content Area for mobile View */}
       <div className="block sm:hidden w-full bg-white">
  <div>
    <h1 className="text-xl lg:text-2xl font-light text-gray-400 px-2 my-4">
      Recommended Images
    </h1>
    
   
    </div>
   
  <div className="flex mb-4">
  <div
      className="w-11/12 grid grid-flow-col gap-2 overflow-x-auto scroll-smooth "
    
    >
      {getVisibleImages().map((prompt) => (
        <div
          key={prompt.id}
          className={`bg-white shadow-lg rounded-xl cursor-pointer w-32 ${
            selectedImageId === prompt.id
              ? "border-[6px]  border-blue-500"
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
      ))}
    </div>
    <div    className={` shadow-lg flex w-1/12 justify-end items-center  ${
        hasMoreImages() ? "bg-blue-600 text-white" : "bg-slate-400 text-white"
      }`}
      onClick={handleLoadMore}>
    <MdKeyboardArrowRight size={40} />
  
  </div>
  </div>

  
</div>

        <div className="flex ">
          <div className=" flex  lg:1/4 xl:w-1/3 ">
            {/* Sidebar */}
            <div className="w-full sm:w-1/4 flex flex-col  items-center gap-2">
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
                      className="pt-2"
                    />
                    <span
                      className={`flex max-w-24 text-xs justify-center items-center pt-1 pb-2 px-2 md:px-0 ${
                        isSelected
                          ? "text-blue-600 font-semibold "
                          : "text-white "
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
            <div className="max-sm:hidden block  sm:w-3/4 p-4 bg-white">
              <div className=" h-5/6 ">
                <h1 className="text-xl lg:text-2xl font-light text-gray-400 my-4">
                  Recommended Images
                </h1>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
                  style={{
                    maxHeight: "550px",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                  }} // Enable auto scrollbar visibility
                >
                  {getVisibleImages().map((prompt) => (
                    <div
                      key={prompt.id}
                      className={`bg-white shadow-lg rounded-xl  cursor-pointer ${
                        selectedImageId === prompt.id
                          ? "border-[6px]  border-blue-500"
                          : "border-4  border-white"
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
                  ))}
                </div>
              </div>

              <div className="flex flex-col h-1/6 justify-between items-center">
                <div>
                  <button
                    className={`px-12 py-2 rounded-full ${
                      hasMoreImages()
                        ? "bg-blue-600 text-white"
                        : "bg-slate-400 text-white"
                    }`}
                    onClick={handleLoadMore}
                  >
                    Load more
                  </button>
                </div>
                <div className="mb-4">
                  <span className="text-blue-600 font-sans">
                    sponsored results by{" "}
                  </span>
                  <span className="font-bold uppercase text-blue-600 font-sans">
                    ERAM LABS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel for large desktop */}
          <div className="hidden xl:block w-2/3">
            <div className=" flex w-11/12 mx-auto mb-8 p-8 gap-10 border-4 border-dotted border-gray-500 bg-[#24272c] shadow-lg rounded-3xl  flex-row items-center justify-end">
              <div className="flex  flex-col items-center bg-[#464950] rounded-xl xl:w-1/2 2xl:w-2/5 justify-end ">
                {/* Image Upload Section */}
                <div className="flex mb-4 w-full justify-center items-center">
                  <label className="cursor-pointer flex w-full flex-col items-center">
                    {" "}
                    {/* Image Upload Section */}
                    <div
                      className="relative w-full min-h-[400px]  text-center rounded-lg hover:bg-[#3b3e44] flex flex-col items-center justify-center"
                      style={{ backgroundColor: "", color: "#ffffff" }}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <img
                        src="/icons.png"
                        alt="Upload Icon"
                        className="mb-2 w-24 h-24 text-gray-600"
                      />
                      <span className="text-gray-500 text-xl">
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
                <div className="mb-8 flex w-full ">
                  <div className="flex flex-col w-full ">
                    {/* Models and Aspect Ratio in One Row */}
                    <div className="flex flex-col xl:flex-row w-full justify-center items-center gap-2 px-4 ">
                      {/* Models Dropdown */}
                      <div className="flex relative w-full ">
                        <button
                          onClick={() => setIsModalOpen(!isModalOpen)}
                          className="flex items-center text-white  py-2 w-full justify-center rounded-full border-4 border-gray-700"
                          style={{ backgroundColor: "#24272c" }}
                        >
                          <div>
                            <IoCameraSharp size={30} />
                          </div>
                          <div className="flex flex-col ">
                            <span className="px-4 text-md font-light">
                              Models
                            </span>
                            <span className="text-blue-400 text-xs">
                              {models.find(
                                (model) =>
                                  model.toLowerCase() ===
                                  selectedModel.toLowerCase()
                              ) || "Artistic"}
                            </span>
                          </div>
                        </button>
                        {isModalOpen && (
                          <div className="absolute mt-2 bg-gray-800 text-white py-2 w-48 rounded-lg z-10">
                            {models.map((model) => (
                              <button
                                key={model}
                                onClick={() => {
                                  setSelectedModel(model.toLowerCase());
                                  setIsModalOpen(false);
                                }}
                                className={`block w-full text-left px-4 py-2 hover:bg-gray-600 ${
                                  selectedModel === model.toLowerCase()
                                    ? "bg-gray-600"
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
                          className="flex items-center rounded-full w-full border-4  justify-center border-gray-700 text-white  py-4"
                          style={{ backgroundColor: "#24272c" }}
                        >
                          <div
                            className="px-1 text-white rounded-0 text-sm ml-1 border-2 border-white"
                            style={{ backgroundColor: "#24272c" }}
                          >
                            {selectedAspectRatioLabel}
                          </div>
                          <span className="ml-2 text-sm">Aspect Ratio</span>
                        </button>
                      </div>
                    </div>

                    {/* Change Image Button in the Next Row */}
                    <div className="flex justify-center items-center">
                      <button
                        className="w-full m-4 bg-blue-600 text-white text-sm flex items-center justify-center py-2 gap-5 rounded-3xl"
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
                        <MdFileUpload size={36} />
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
                        <h3 className="text-lg text-black font-bold mb-4">
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
                                  ? "border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <span className="text-xl">{ratio.icon}</span>
                              <span className="mt-2">{ratio.label}</span>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setIsModalOpen1(false)}
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Generated Image Section */}
              <div className="flex-grow flex pt-4 flex-col xl:w-1/2 2xl:w-3/5  justify-end">
                {/* Image Container with Fixed Height */}
                <div
                  className="flex-grow flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden"
                  style={{ height: "350px", backgroundColor: "#24272c" }}
                >
                  {isGenerating ? (
                    <div className="flex justify-center items-center h-full">
                      <ClipLoader color="#0000FF" size={50} />
                    </div>
                  ) : generatedImage ? (
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="max-w-full max-h-full object-contain"
                      style={{ height: "100%", width: "auto" }}
                    />
                  ) : (
                    <div className="text-gray-500 h-full flex flex-col items-center justify-center text-2xl">
                      <img src="/icon.png" alt="Upload Icon" />
                      <div>No image generated</div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                {generatedImage && (
                  <div
                    className="flex space-x-4 p-4"
                    style={{ backgroundColor: "#24272c" }}
                  >
                    <button
                      onClick={handleDownload}
                      className="w-1/2 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Download Image
                    </button>
                    <button
                      onClick={handleGenerateNewImage}
                      className="w-1/2 bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition-colors"
                    >
                      Generate New Image
                    </button>
                  </div>
                )}
                {!generatedImage && (
                  <div
                    className="p-4 flex justify-center items-center h-full"
                    style={{ backgroundColor: "#24272c" }}
                  >
                    <button
                      onClick={() => {
                        if (isGenerating) {
                          return;
                        }

                        handleGenerate();

                        // Deduct credit after generation
                        handleDeductCredit(
                          session?.user?.email!,
                          setCredits,
                          setMessage,
                          setLoading
                        ); // Make sure session and user email are available
                      }}
                      className={` text-white p-4  w-2/3 mt-20 rounded-full transition-colors ${
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
          {/* Laptop screens resolutions   */}
          <div className="block xl:hidden w-full sm:w-3/4 px-2 ">
            <div className=" flex flex-col w-full sm:w-11/12 mx-auto mb-8  p-4 md:p-8 gap-10 border-4 border-dotted border-gray-500 bg-[#24272c] shadow-lg rounded-3xl   items-center justify-end">
              <div className="flex  flex-col items-center bg-[#464950] rounded-xl w-full justify-end ">
                {/* Image Upload Section */}
                <div className="flex mb-4 w-full justify-center items-center">
                  <label className="cursor-pointer flex w-full flex-col items-center">
                    {" "}
                    {/* Image Upload Section */}
                    <div
                      className="relative w-full min-h-[250px]  text-center rounded-lg hover:bg-[#3b3e44] flex flex-col items-center justify-center"
                      style={{ backgroundColor: "", color: "#ffffff" }}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <img
                        src="/icons.png"
                        alt="Upload Icon"
                        className="mb-2 w-24 h-24 "
                      />
                      <span className="text-gray-500 text-xl">
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
                <div className=" flex w-full p-4 ">
                  <div className="flex flex-col w-full  ">
                    {/* Models and Aspect Ratio in One Row */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full justify-center items-center ">
                      {/* Models Dropdown */}
                      <div className="flex  relative w-full ">
                        <button
                          onClick={() => setIsModalOpen(!isModalOpen)}
                          className="flex items-center text-white   py-2 w-full justify-center rounded-full border-4 border-gray-700"
                          style={{ backgroundColor: "#24272c" }}
                        >
                          <div>
                            <IoCameraSharp size={30} />
                          </div>
                          <div className="flex flex-col ">
                            <span className="px-4 text-md font-light">
                              Models
                            </span>
                            <span className="text-blue-400 text-xs">
                              {models.find(
                                (model) =>
                                  model.toLowerCase() ===
                                  selectedModel.toLowerCase()
                              ) || "Artistic"}
                            </span>
                          </div>
                        </button>
                        {isModalOpen && (
                          <div className="absolute mt-2 bg-gray-800 text-white py-2 w-48 rounded-lg z-10">
                            {models.map((model) => (
                              <button
                                key={model}
                                onClick={() => {
                                  setSelectedModel(model.toLowerCase());
                                  setIsModalOpen(false);
                                }}
                                className={`block w-full text-left px-4 py-2 hover:bg-gray-600 ${
                                  selectedModel === model.toLowerCase()
                                    ? "bg-gray-600"
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
                          className="flex items-center rounded-full w-full border-4 sm:mx-2  justify-center border-gray-700 text-white  py-4"
                          style={{ backgroundColor: "#24272c" }}
                        >
                          <div
                            className="px-1 text-white rounded-0 text-sm ml-1 border-2 border-white"
                            style={{ backgroundColor: "#24272c" }}
                          >
                            {selectedAspectRatioLabel}
                          </div>
                          <span className="ml-2 text-sm">Aspect Ratio</span>
                        </button>
                      </div>
                      <div className="hidden lg:block w-full justify-center items-center">
                      <button
                        className="w-full  bg-blue-600  text-white text-sm flex items-center justify-center py-4  rounded-full"
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
                    </div>

                    {/* Change Image Button in the Next Row */}
                    <div className="block lg:hidden w-full mx-auto max-sm:mt-4 sm:p-4 justify-center items-center">
                      <button
                        className="w-full  bg-blue-600 text-white  text-sm flex items-center justify-center py-2  rounded-3xl"
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
                        <MdFileUpload size={36} />
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
                        <h3 className="text-lg text-black font-bold mb-4">
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
                                  ? "border-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <span className="text-xl">{ratio.icon}</span>
                              <span className="mt-2">{ratio.label}</span>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setIsModalOpen1(false)}
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Generated Image Section */}
              <div className="flex-grow flex flex-col w-full  justify-end">
                {/* Image Container with Fixed Height */}
                <div
                  className="flex-grow flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden"
                  style={{ height: "250px", backgroundColor: "#24272c" }}
                >
                  {isGenerating ? (
                    <div className="flex justify-center items-center h-full">
                      <ClipLoader color="#0000FF" size={50} />
                    </div>
                  ) : generatedImage ? (
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="max-w-full max-h-full object-contain"
                      style={{ height: "100%", width: "auto" }}
                    />
                  ) : (
                    <div className="text-gray-500  flex flex-col items-center justify-center text-xl sm:text-2xl">
                      <img src="/icon.png" alt="Upload Icon" />
                      <div>No image generated</div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                {generatedImage && (
                  <div
                    className="flex space-x-4 sm:p-4"
                    style={{ backgroundColor: "#24272c" }}
                  >
                    <button
                      onClick={handleDownload}
                      className="w-full md:w-1/2 bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Download Image
                    </button>
                    <button
                      onClick={handleGenerateNewImage}
                      className="w-full md:w-1/2 bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition-colors"
                    >
                      Generate New Image
                    </button>
                  </div>
                )}
                {!generatedImage && (
                  <div
                    className="p-4 flex justify-center items-center h-full"
                    style={{ backgroundColor: "#24272c" }}
                  >
                    <button
                      onClick={() => {
                        if (isGenerating) {
                          return;
                        }

                        handleGenerate();

                        // Deduct credit after generation
                        handleDeductCredit(
                          session?.user?.email!,
                          setCredits,
                          setMessage,
                          setLoading
                        ); // Make sure session and user email are available
                      }}
                      className={` text-white p-4  w-full md:w-2/3 mt-20 rounded-full transition-colors ${
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
      </div>
    </>
  );
}
