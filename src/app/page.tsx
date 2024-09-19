/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import Footer from "./components/footer";
import Header from "./components/header";
import Follower from "./components/follow";
import Pricing from "./components/pricing";
import Adver from "./components/Adver";
import { useSession } from "next-auth/react";
import { handleDeductCredit } from "./components/creditButton";
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
        <Header />
        <div className="flex h-[620px] min-w-screen bg-black w-full">
          <div className=" flex w-2/5">
            {/* Sidebar */}
            <div className="1/7 bg-gray-900 flex flex-col items-center py-4 space-y-4 h-[620px]">
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
                    className={`relative flex flex-col items-center space-y-1 text-white pt-1 pb-1 pl-2 pr-2 rounded-lg w-full ${
                      isClickable
                        ? isSelected
                          ? "bg-gray-900" // Apply this background when selected
                          : "bg-gray-900" // Default background
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
                      className="w-9 h-10"
                    />
                    <span
                      className={`text-[0.625rem] ${
                        isSelected ? "text-blue-600" : "text-white"
                      }`}
                    >
                      {category.name}
                    </span>

                    {/* Add a pointer if the category is selected */}
                    {isSelected && (
                      <span className="absolute right-[-8.5px] top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-l-gray-900 border-t-transparent border-b-transparent" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="w-6/7 p-6 bg-white h-[620px]">
              <h1 className="text-xl font-normal text-gray-500 mb-1">
                Recommended Images
              </h1>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
                style={{
                  maxHeight: "450px",
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                }} // Enable auto scrollbar visibility
              >
                {getVisibleImages().map((prompt) => (
                  <div
                    key={prompt.id}
                    className={`bg-white shadow-lg rounded-lg p-1 cursor-pointer ${
                      selectedImageId === prompt.id
                        ? "border-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() => handleImageSelect(prompt.id)}
                  >
                    <Image
                      src={prompt.src}
                      alt={prompt.alt}
                      width={90}
                      height={90}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
              {hasMoreImages() && (
                <div className="flex justify-center mt-6">
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-full"
                    onClick={handleLoadMore}
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Panel */}
          <div
            className="w-3/5  border-2 border-dashed border-gray-300 shadow-lg rounded-3xl flex flex-col mr-5 ml-5"
            style={{
              backgroundColor: "#24272c",
              color: "#ffffff",
              height: "620px",
            }}
          >
            <div className=" rounded-lg flex flex-row items-center justify-end">
              <div className="flex flex-col items-center justify-end mt-[30px] ml-5 h-[560px] bg-[#35383d] rounded-3xl">
                {/* Image Upload Section */}
                <div className="mb-4 w-full h-[400px] bg-[#35383d] flex justify-center items-center">
                  {/* Image Upload Section */}
                  <div
                    className="relative w-full min-h-[400px] rounded-lg text-center hover:bg-gray-100 flex flex-col items-center justify-center"
                    style={{ backgroundColor: "#35383d", color: "#ffffff" }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <label className="cursor-pointer flex flex-col items-center">
                      <img
                        src="/icons.png"
                        alt="Upload Icon"
                        className="mb-2 w-16 h-16"
                      />
                      <span className="text-gray-500 text-xl">Drag here</span>
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
                    </label>

                    {/* Display Uploaded Images */}
                    {uploadedImages.length > 0 && (
                      <div
                        className={`absolute inset-0 p-2 rounded-lg overflow-auto grid gap-2`}
                        style={{
                          backgroundColor: "#35383d",
                          gridTemplateColumns: `repeat(2, 1fr)`, // Default to 2 columns for images 4 and beyond
                          gridAutoRows: "auto",
                          gridTemplateRows:
                            uploadedImages.length <= 3
                              ? "repeat(3, minmax(0, 1fr))"
                              : "repeat(auto-fit, minmax(100px, auto))",
                        }}
                      >
                        {uploadedImages.map((file, index) => {
                          // Determine the number of rows needed
                          let rowSpan = 1;
                          if (uploadedImages.length > 3) {
                            if (index < 3) {
                              // First 3 images, each in a separate row
                              rowSpan = 1;
                            } else if (uploadedImages.length === 4) {
                              // 4 images: 2 in the first row, 1 in the next two rows
                              rowSpan = index === 3 ? 1 : 1;
                            } else if (uploadedImages.length === 5) {
                              // 5 images: 2 in the first 2 rows, 1 in the last row
                              rowSpan = index >= 4 ? 1 : 1;
                            } else if (uploadedImages.length >= 6) {
                              // 6 or more images: 2 per row
                              rowSpan = 1;
                            }
                          }

                          return (
                            <div
                              key={index}
                              className="relative bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
                              style={{
                                gridRow: `span ${rowSpan}`,
                              }}
                            >
                              {/* Image Styling */}
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />

                              {/* Close Button */}
                              <button
                                className="absolute top-2 right-2 text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center"
                                onClick={() => handleImageRemove(index)}
                              >
                                &times;
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Models and Aspect Ratio Buttons */}
                <div className="mb-8 h-[80px] bg-[#35383d]">
                  <div className="space-y-4">
                    {/* Models and Aspect Ratio in One Row */}
                    <div className="flex justify-center items-center space-x-4">
                      {/* Models Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setIsModalOpen(!isModalOpen)}
                          className="flex items-center text-white px-4 py-2 rounded-3xl border-4 border-gray-700"
                          style={{ backgroundColor: "#24272c" }}
                        >
                          <span className="mr-2 text-sm">Models</span>
                          <span className="text-blue-400 text-sm">
                            {models.find(
                              (model) =>
                                model.toLowerCase() ===
                                selectedModel.toLowerCase()
                            ) || "Artistic"}
                          </span>
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
                      <div className="relative">
                        <button
                          onClick={() => setIsModalOpen1(true)}
                          className="flex items-center rounded-3xl border-4 border-gray-700 text-white px-4 py-2"
                          style={{ backgroundColor: "#24272c" }}
                        >
                          <span className="mr-0 text-sm">Aspect Ratio</span>
                          <div
                            className="px-1 py-[-1] text-white rounded-0 text-sm ml-1 border-2 border-white"
                            style={{ backgroundColor: "#24272c" }}
                          >
                            {selectedAspectRatioLabel}
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Change Image Button in the Next Row */}
                    <div className="flex justify-center items-center">
                      <button
                        className="px-4 bg-blue-600 text-white text-sm flex items-center justify-center py-2 rounded-3xl"
                        onClick={handleChangeImage} // Clear images on click
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 8a1 1 0 011-1h10a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V8zm1 4v2h10v-2H5zm6-4V5a1 1 0 00-2 0v3H7a1 1 0 100 2h6a1 1 0 100-2h-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Change Image
                      </button>
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
              <div className="flex-grow flex flex-col justify-end">
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
                      <img
                        src="/icon.png"
                        alt="Upload Icon"
                        className="mb-2 w-50 h-50"
                      />
                      No image generated
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
                      className={`p-4 text-white py-2 rounded-lg transition-colors ${
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
        <Adver />
        <div className="mb-2 mt-2">
          <Follower />
        </div>
        <div className="mb-2 mt-2">
          <Pricing />
        </div>
        <Footer />
      </div>
    </>
  );
}
