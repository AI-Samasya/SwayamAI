// import React, { useState } from "react";
// import ReactMarkdown from "react-markdown";

// const Course = () => {
//   const [step, setStep] = useState(1); // Track the current step
//   const [courseData, setCourseData] = useState({
//     category: "",
//     topic: "",
//     description: "",
//     curriculum: [],
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentSectionIndex, setCurrentSectionIndex] = useState(0); // Track the current section being generated

//   // Handle category selection
//   const handleCategorySelect = (category) => {
//     setCourseData((prev) => ({ ...prev, category }));
//     setStep(2);
//   };

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCourseData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Generate sections using OpenAI
//   const generateSections = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("http://localhost:5001/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: `Generate a list of top-level sections for a course on the topic "${courseData.topic}" with the description "${courseData.description} ".`,
//         }),
//       });

//       const data = await response.json();
//       const sections = data.message.split("\n").filter((section) => section.trim());

//       setCourseData((prev) => ({
//         ...prev,
//         curriculum: sections.map((section) => ({
//           title: section.trim(),
//           content: "",
//           videoLinks: [],
//           isOpen: false,
//           isLoading: false, 
//         })),
//       }));
//       setStep(3);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to generate sections. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Toggle the dropdown for a section
//   const toggleDropdown = (index) => {
//     const updatedCurriculum = [...courseData.curriculum];
//     updatedCurriculum[index].isOpen = !updatedCurriculum[index].isOpen;
//     setCourseData((prev) => ({ ...prev, curriculum: updatedCurriculum }));
//   };

//   // Generate content for one section at a time
//   const generateContentForSection = async (section, index) => {
//     try {
//       // Mark section as loading
//       setCourseData((prev) => {
//         const updatedCurriculum = [...prev.curriculum];
//         updatedCurriculum[index].isLoading = true;
//         return { ...prev, curriculum: updatedCurriculum };
//       });

//       // Fetch detailed content
//       const contentResponse = await fetch("http://localhost:5001/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: `Generate detailed content for the course section titled "${section.title}" in the context of the course topic "${courseData.topic}". Include practical applications, concepts, and examples.`,
//         }),
//       });

//       const contentData = await contentResponse.json();
//       const detailedContent = contentData?.message || "Content could not be generated."; 

//       // Fetch YouTube links
//       const videoResponse = await fetch(
//         `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${encodeURIComponent(
//           section.title + " " + courseData.topic
//         )}&type=video&key=AIzaSyDqUjPPLH5jb3rMADqZG7QzUbvk_icZFnM`
//       );

//       const videoData = await videoResponse.json();
//       const videoLinks = videoData.items
//         ? videoData.items.map((video) => ({
//             videoId: video.id.videoId,
//             title: video.snippet.title,
//             thumbnail: video.snippet.thumbnails.medium.url,
//           }))
//         : [];

      
//       setCourseData((prev) => {
//         const updatedCurriculum = [...prev.curriculum];
//         updatedCurriculum[index] = {
//           ...updatedCurriculum[index],
//           content: detailedContent,
//           videoLinks,
//           isLoading: false, // Mark loading as complete
//         };
//         return { ...prev, curriculum: updatedCurriculum };
//       });
//     } catch (error) {
//       console.error("Error:", error);
//       alert(`Failed to generate content for section: ${section.title}`);
//     }
//   };

//   // Generate all sections one at a time
//   const generateContentForSections = async () => {
//     setIsLoading(true);
//     for (let i = 0; i < courseData.curriculum.length; i++) {
//       await generateContentForSection(courseData.curriculum[i], i);
//       setCurrentSectionIndex(i + 1); // Update progress
//     }
//     setIsLoading(false);
//     setStep(4); // Move to step 4 after all sections are complete
//   };

//   // Render course preview with detailed content
//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <div className="text-center space-y-4">
//             <h2 className="text-2xl font-semibold">Select the course category</h2>
//             <div className="flex justify-center gap-6">
//               {["Programming", "Business", "Finance & Accounting"].map(
//                 (category) => (
//                   <div
//                     key={category}
//                     className="cursor-pointer bg-gray-200 p-6 rounded-lg hover:bg-gray-300 transition"
//                     onClick={() => handleCategorySelect(category)}
//                   >
//                     {category}
//                   </div>
//                 )
//               )}
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-4">
//             <h2 className="text-xl font-medium">Enter Topic and Description</h2>
//             <input
//               type="text"
//               name="topic"
//               placeholder="Course Topic"
//               value={courseData.topic}
//               onChange={handleChange}
//               className="w-full border p-2 rounded-lg"
//             />
//             <textarea
//               name="description"
//               placeholder="Course Description"
//               value={courseData.description}
//               onChange={handleChange}
//               className="w-full border p-2 rounded-lg"
//               rows="4"
//             ></textarea>
//             <div className="flex justify-between">
//               <button
//                 onClick={() => setStep(1)}
//                 className="px-4 py-2 bg-gray-300 rounded-lg"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={generateSections}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Generating..." : "Next"}
//               </button>
//             </div>
//           </div>
//         );
//       case 3:
//         return (
//           <div className="space-y-4">
//             <h2 className="text-xl font-medium">Curriculum</h2>
//             {courseData.curriculum.map((section, index) => (
//               <div key={index} className="border p-4 rounded-lg">
//                 <h3 className="text-lg font-bold">{section.title}</h3>
//                 {section.isLoading && <p>Loading content...</p>}
//               </div>
//             ))}
//             <button
//               onClick={generateContentForSections}
//               className="px-4 py-2 bg-green-500 text-white rounded-lg"
//               disabled={isLoading}
//             >
//               {isLoading
//                 ? `Generating section ${currentSectionIndex}/${courseData.curriculum.length}...`
//                 : "Save and Generate Content"}
//             </button>
//           </div>
//         );
//       case 4:
//         return (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-center">Course Preview</h2>
//             {courseData.curriculum.map((section, index) => (
//               <div key={index} className="border rounded-lg shadow-md bg-white">
//                 <button
//                   className="w-full text-left px-6 py-4 flex justify-between items-center bg-purple-100 hover:bg-purple-200 transition"
//                   onClick={() => toggleDropdown(index)}
//                 >
//                   <span className="text-lg font-bold text-purple-600">{section.title}</span>
//                   <span>{section.isOpen ? "-" : "+"}</span>
//                 </button>
//                 {section.isOpen && (
//                   <div className="p-6">
//                     <div>
//                       <ReactMarkdown className="prose">{section.content}</ReactMarkdown>
//                     </div>
//                     {section.videoLinks.length > 0 && (
//                       <div className="mt-4">
//                         <h4 className="text-lg font-bold mb-2">Related Videos:</h4>
//                         {section.videoLinks.map((video, idx) => (
//                           <div key={idx} className="flex items-center gap-4 mb-4">
//                             <img
//                               src={video.thumbnail}
//                               alt={video.title}
//                               className="w-32 rounded"
//                             />
//                             <a
//                               href={`https://www.youtube.com/watch?v=${video.videoId}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 underline"
//                             >
//                               {video.title}
//                             </a>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="p-8">
//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
//         {renderStep()}
//       </div>
//     </div>
//   );
// };

// export default Course;


import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const Course = () => {
  const [step, setStep] = useState(1); // Track the current step
  const [courseData, setCourseData] = useState({
    category: "",
    topic: "",
    description: "",
    curriculum: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0); // Track the current section being generated

  // Handle category selection
  const handleCategorySelect = (category) => {
    setCourseData((prev) => ({ ...prev, category }));
    setStep(2);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate sections using OpenAI
  const generateSections = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Generate a list of top-level sections for a course on the topic "${courseData.topic}" with the description "${courseData.description} ".`,
        }),
      });

      const data = await response.json();
      const sections = data.message.split("\n").filter((section) => section.trim());

      setCourseData((prev) => ({
        ...prev,
        curriculum: sections.map((section) => ({
          title: section.trim(),
          content: "",
          videoLinks: [],
          isOpen: false,
          isLoading: false, // Add loading state for each section
        })),
      }));
      setStep(3);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate sections. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle the dropdown for a section
  const toggleDropdown = (index) => {
    const updatedCurriculum = [...courseData.curriculum];
    updatedCurriculum[index].isOpen = !updatedCurriculum[index].isOpen;
    setCourseData((prev) => ({ ...prev, curriculum: updatedCurriculum }));
  };

  // Generate content for one section at a time
  const generateContentForSection = async (section, index) => {
    try {
      // Mark section as loading
      setCourseData((prev) => {
        const updatedCurriculum = [...prev.curriculum];
        updatedCurriculum[index].isLoading = true;
        return { ...prev, curriculum: updatedCurriculum };
      });

      // Fetch detailed content
      const contentResponse = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Generate detailed content for the course section titled "${section.title}" in the context of the course topic "${courseData.topic}". Include practical applications, concepts, and examples.`,
        }),
      });

      const contentData = await contentResponse.json();
      const detailedContent = contentData?.message || "Content could not be generated."; // Fallback content

      // Fetch YouTube links
      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${encodeURIComponent(
          section.title + " " + courseData.topic
        )}&type=video&key=AIzaSyDqUjPPLH5jb3rMADqZG7QzUbvk_icZFnM`
      );

      const videoData = await videoResponse.json();
      const videoLinks = videoData.items
        ? videoData.items.map((video) => ({
            videoId: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.medium.url,
          }))
        : []; // Default to empty array if items are undefined

      // Update only the current section's content and video links
      setCourseData((prev) => {
        const updatedCurriculum = [...prev.curriculum];
        updatedCurriculum[index] = {
          ...updatedCurriculum[index],
          content: detailedContent,
          videoLinks,
          isLoading: false, // Mark loading as complete
        };
        return { ...prev, curriculum: updatedCurriculum };
      });
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to generate content for section: ${section.title}`);
    }
  };

  // Generate all sections one at a time
  const generateContentForSections = async () => {
    setIsLoading(true);
    for (let i = 0; i < courseData.curriculum.length; i++) {
      await generateContentForSection(courseData.curriculum[i], i);
      setCurrentSectionIndex(i + 1); // Update progress
    }
    setIsLoading(false);
    setStep(4); // Move to step 4 after all sections are complete
  };

  // Render course preview with detailed content
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Select the course category</h2>
            <div className="flex justify-center gap-6">
              {["Programming", "Business", "Finance & Accounting"].map(
                (category) => (
                  <div
                    key={category}
                    className="cursor-pointer bg-gray-200 p-6 rounded-lg hover:bg-gray-300 transition"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                )
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Enter Topic and Description</h2>
            <input
              type="text"
              name="topic"
              placeholder="Course Topic"
              value={courseData.topic}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
            <textarea
              name="description"
              placeholder="Course Description"
              value={courseData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              rows="4"
            ></textarea>
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Previous
              </button>
              <button
                onClick={generateSections}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Next"}
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Curriculum</h2>
            {courseData.curriculum.map((section, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <h3 className="text-lg font-bold">{section.title}</h3>
                {section.isLoading && <p>Loading content...</p>}
              </div>
            ))}
            <button
              onClick={generateContentForSections}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
              disabled={isLoading}
            >
              {isLoading
                ? `Generating section ${currentSectionIndex}/${courseData.curriculum.length}...`
                : "Save and Generate Content"}
            </button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Course Preview</h2>
            {courseData.curriculum.map((section, index) => (
              <div key={index} className="border rounded-lg shadow-md bg-white">
                <button
                  className="w-full text-left px-6 py-4 flex justify-between items-center bg-purple-100 hover:bg-purple-200 transition"
                  onClick={() => toggleDropdown(index)}
                >
                  <span className="text-lg font-bold text-purple-600">{section.title}</span>
                  <span>{section.isOpen ? "-" : "+"}</span>
                </button>
                {section.isOpen && (
                  <div className="p-6">
                    <div>
                      <ReactMarkdown className="prose">{section.content}</ReactMarkdown>
                    </div>
                    {section.videoLinks.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-lg font-bold mb-2">Related Videos:</h4>
                        {section.videoLinks.map((video, idx) => (
                          <div key={idx} className="flex items-center gap-4 mb-4">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-32 rounded"
                            />
                            <a
                              href={`https://www.youtube.com/watch?v=${video.videoId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {video.title}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default Course;