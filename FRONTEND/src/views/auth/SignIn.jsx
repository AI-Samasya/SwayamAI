import React, { useState } from "react";
import { X, CheckCircle, Plus, Loader2 } from "lucide-react";
import Confetti from "react-confetti";
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";

// IMPORTING IMAGES
import one from "../../../src/assets/signin/1.png";
import two from "../../../src/assets/signin/2.png";
import three from "../../../src/assets/signin/3.png";
import four from "../../../src/assets/signin/4.png";
import five from "../../../src/assets/signin/5.png";

const AuthFlow = () => {
  const [currentView, setCurrentView] = useState("options");
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDisability, setSelectedDisability] = useState(null);
  const [disabilityRange, setDisabilityRange] = useState(50);
  const [newInterest, setNewInterest] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectgard, setSelectedGard] = useState(false);

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    age: "",
    location: "",
    interests: [],
    disability: null,
    disabilityRange: 50,
  });

  const [allInterests, setAllInterests] = useState([
    "Adaptive Sports",
    "Assistive Technology",
    "Art Therapy",
    "Support Groups",
    "Accessible Travel",
    "Music Therapy",
    "Inclusive Education",
    "Disability Advocacy",
    "Accessible Gaming",
  ]);

  const disabilities = [
    { id: 1, title: "Visual Impairment", img: one },
    { id: 2, title: "Hearing Impairment", img: two },
    { id: 3, title: "Physical Disability", img: three },
    { id: 4, title: "Cognitive Disability", img: four },
    { id: 5, title: "Speech Disability", img: five },
  ];

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (
        !userData.fullName ||
        !userData.email ||
        !userData.password ||
        !userData.age ||
        !userData.location
      ) {
        alert("Please fill in all required fields.");
        return;
      }
    } else if (currentStep === 2) {
      // Optionally validate interests
      if (userData.interests.length === 0) {
        alert("Please select at least one interest.");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const handleGuardian = () => {
    setSelectedGard(true);
    handleAuthOption("register");
  };

  const handlestudentaccount = () => {
    setSelectedGard(false);
    handleAuthOption("register");
  };

  const handleAuthOption = (option) => {
    setCurrentView(option);
  };

  const handleAddInterest = () => {
    const trimmedInterest = newInterest.trim();
    if (trimmedInterest && !userData.interests.includes(trimmedInterest)) {
      setUserData((prev) => ({
        ...prev,
        interests: [...prev.interests, trimmedInterest],
      }));
      setNewInterest("");
    }
  };

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field} to ${value}`);
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest) => {
    setUserData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleDisabilitySelection = (disability) => {
    setSelectedDisability(disability); // for UI state
    setUserData((prev) => ({
      ...prev,
      disability: {
        // Store the full disability object
        id: disability.id,
        title: disability.title,
      },
    }));
  };

  const handleDisabilityRangeChange = (value) => {
    setUserData((prev) => ({
      ...prev,
      disabilityRange: value,
    }));
  };

  const handleRegisterComplete = () => {
    if (
      !userData.fullName ||
      !userData.email ||
      !userData.password ||
      !userData.age ||
      !userData.location
    ) {
      alert("Please fill all required fields.");
      return;
    }
    setIsProcessing(true);
    const finalData = { ...userData, registeredAt: new Date().toISOString() };
    console.log(finalData);
    localStorage.setItem("userData", JSON.stringify(finalData));

    setTimeout(() => {
      // Save complete user data to localStorage
      localStorage.setItem("userData", JSON.stringify(finalData));
      setIsProcessing(false);
      setShowSuccess(true);

      setTimeout(() => {
        setCurrentView("signin");
        setCurrentStep(1);
        setShowSuccess(false);
      }, 3000);
    }, 3000);
  };

  const styles = `
    input[type="range"] {
      -webkit-appearance: none;
      width: 100%;
      background: transparent;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: #4318FF;
      cursor: pointer;
      margin-top: -7px;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
    }

    input[type="range"]::-webkit-slider-runnable-track {
      width: 100%;
      height: 2px;
      background: transparent;
      border-radius: 999px;
      cursor: pointer;
    }
  `;

  if (currentView === "options") {
    return (
      <>
        <style>{styles}</style>
        <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center">
          <div className="mt-[30vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
            <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
              Welcome
            </h4>
            <p className="mb-9 ml-1 text-base text-gray-600">
              Choose how you want to get started!
            </p>
            <button
              onClick={handleGuardian}
              className="linear mb-3 w-full rounded-xl bg-[rgba(67,24,255,0.85)] py-[12px] text-base font-medium text-white transition duration-200 hover:bg-[rgba(67,24,255,0.95)]"
            >
              Create Guardian Account
            </button>
            <button
              onClick={handlestudentaccount}
              className="linear mb-3 w-full rounded-xl bg-[rgba(67,24,255,0.85)] py-[12px] text-base font-medium text-white transition duration-200 hover:bg-[rgba(67,24,255,0.95)]"
            >
              Create Student Account
            </button>
            <button
              onClick={() => handleAuthOption("signin")}
              className="linear w-full rounded-xl border-2 border-gray-200 py-[12px] text-base font-medium text-navy-700 transition duration-200 hover:bg-gray-100 dark:text-white"
            >
              Sign In
            </button>
          </div>
        </div>
      </>
    );
  }

  if (currentView === "signin") {
    return (
      <>
        <style>{styles}</style>
        <div className="mb-16 mt-16 flex h-screen w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center">
          <div className="w-full max-w-md">
            <h4 className="mb-2.5 text-center text-4xl font-bold text-navy-700 dark:text-white">
              Sign In
            </h4>
            <p className="mb-9 text-center text-base text-gray-600">
              Enter your email and password to sign in!
            </p>
            <InputField
              variant="auth"
              extra="mb-3"
              label="Email*"
              placeholder="mail@simmmple.com"
              id="email"
              type="text"
            />
            <InputField
              variant="auth"
              extra="mb-3"
              label="Password*"
              placeholder="Min. 8 characters"
              id="password"
              type="password"
            />
            <div className="mb-4 flex items-center justify-between px-2">
              <div className="flex items-center">
                <Checkbox />
                <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                  Keep me logged in
                </p>
              </div>
              <a
                className="text-sm font-medium text-[rgba(67,24,255,0.85)] hover:text-[rgba(67,24,255,0.95)] dark:text-white"
                href=" "
              >
                Forgot Password?
              </a>
            </div>
            <button
              className="linear mt-2 w-full rounded-xl bg-[rgba(67,24,255,0.85)] py-[12px] text-base font-medium text-white transition duration-200 hover:bg-[rgba(67,24,255,0.95)]"
              onClick={() => {
                window.location.href = "/admin/default";
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </>
    );
  }

  if (currentView === "register") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <style>{styles}</style>
        {showSuccess && <Confetti />}
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-navy-900">
          <div className="mx-auto w-full max-w-2xl space-y-8 rounded-lg bg-white p-6 shadow-lg dark:bg-navy-800">
            {!showSuccess && !isProcessing ? (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="mb-2 text-4xl font-bold text-navy-700 dark:text-white">
                        {currentStep === 1 && "Create Account"}
                        {currentStep === 2 && "Your Interests"}
                        {currentStep === 3 && "Disability Type"}
                      </h4>
                      <p className="text-base text-gray-600">
                        {currentStep === 1 &&
                          "Fill in your details to get started"}
                        {currentStep === 2 && "Select or add your interests"}
                        {currentStep === 3 && "Select your disability type"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAuthOption("options")}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {currentStep === 1 && (
                  <div className="space-y-4">
                    {selectgard && (
                      <>
                        <InputField
                          variant="auth"
                          label="Full Parent name*"
                          placeholder="Enter your full name"
                          id="name"
                          type="text"
                          value={userData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                        />

                        <InputField
                          variant="auth"
                          label="Parent Mobile number*"
                          placeholder="Enter parent mobile number"
                          id="name"
                          type="text"
                          value={userData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                        />
                      </>
                    )}
                    <InputField
                      variant="auth"
                      label="Full Name*"
                      placeholder="Enter your full name"
                      id="name"
                      type="text"
                      value={userData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                    />
                    <InputField
                      variant="auth"
                      label="Email*"
                      placeholder="mail@simmmple.com"
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                    <InputField
                      variant="auth"
                      label="Password*"
                      placeholder="Min. 8 characters"
                      id="password"
                      type="password"
                      value={userData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                    <InputField
                      variant="auth"
                      label="Age*"
                      placeholder="Enter your age"
                      id="age"
                      type="number"
                      value={userData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                    />
                    <InputField
                      variant="auth"
                      label="Location*"
                      placeholder="Enter your location"
                      id="location"
                      type="text"
                      value={userData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="relative flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 px-4 py-2 focus:border-[rgba(67,24,255,0.85)] focus:outline-none"
                          placeholder="Add new interest"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddInterest();
                            }
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddInterest}
                        className="flex h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-[rgba(67,24,255,0.85)] text-white transition-colors hover:bg-[rgba(67,24,255,0.95)]"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {userData.interests.map((interest) => (
                        <button
                          key={interest}
                          onClick={() => handleInterestToggle(interest)}
                          className="rounded-xl bg-[rgba(67,24,255,0.85)] px-4 py-2 text-white transition-all duration-200 hover:bg-[rgba(67,24,255,0.95)]"
                        >
                          {interest}
                        </button>
                      ))}

                      {allInterests.map(
                        (interest) =>
                          !userData.interests.includes(interest) && (
                            <button
                              key={interest}
                              onClick={() => handleInterestToggle(interest)}
                              className="rounded-xl bg-gray-100 px-4 py-2 text-navy-700 transition-all duration-200 hover:bg-gray-200"
                            >
                              {interest}
                            </button>
                          )
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {disabilities.map((disability) => (
                        <button
                          key={disability.id}
                          className={`rounded-xl border p-4 transition ${
                            selectedDisability?.id === disability.id
                              ? "border-[rgba(67,24,255,0.85)] bg-[rgba(67,24,255,0.1)]"
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => handleDisabilitySelection(disability)} // Make sure this is being called
                        >
                          <img
                            src={disability.img}
                            alt={disability.title}
                            className="mb-2 h-32 w-full rounded-lg object-cover"
                          />
                          <h4 className="text-center font-medium text-navy-700 dark:text-white">
                            {disability.title}
                          </h4>
                        </button>
                      ))}
                    </div>
                    {selectedDisability && (
                      <div className="mt-4 rounded-xl bg-gray-50 p-6">
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-600">
                            Disability Range
                          </label>
                          <span className="text-sm font-medium text-[rgba(67,24,255,0.85)]">
                            {disabilityRange}%
                          </span>
                        </div>
                        <div className="relative mb-4 h-2">
                          <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                          <div
                            className="absolute inset-0 rounded-full bg-[rgba(67,24,255,0.85)] transition-all duration-200"
                            style={{ width: `${disabilityRange}%` }}
                          ></div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={disabilityRange}
                            onChange={(e) => setDisabilityRange(e.target.value)}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                            style={{ WebkitAppearance: "none" }}
                          />
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-gray-500">
                          <span>Mild (0-30%)</span>
                          <span>Moderate (31-70%)</span>
                          <span>Severe (71-100%)</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="rounded-xl border-2 px-6 py-2 transition hover:bg-gray-100"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (currentStep < 3) {
                        handleNextStep();
                      } else {
                        handleRegisterComplete();
                      }
                    }}
                    className="ml-auto rounded-xl bg-[rgba(67,24,255,0.85)] px-6 py-2 text-white transition hover:bg-[rgba(67,24,255,0.95)]"
                  >
                    {currentStep === 3 ? "Complete" : "Next"}
                  </button>
                </div>
              </>
            ) : isProcessing ? (
              <div className="py-12 text-center">
                <div className="mb-4 flex justify-center">
                  <Loader2
                    size={64}
                    className="animate-spin text-[rgba(67,24,255,0.85)]"
                  />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
                  Creating Your Account
                </h2>
                <p className="text-gray-600">Please wait a moment...</p>
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="mb-4 flex justify-center">
                  <CheckCircle
                    size={64}
                    className="animate-bounce text-[rgba(67,24,255,0.85)]"
                  />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
                  Account Created Successfully!
                </h2>
                <p className="text-gray-600">Redirecting to login...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthFlow;
