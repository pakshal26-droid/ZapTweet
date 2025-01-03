import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ToneSelector from "./ToneSelector";
import AnalysisOutput from "./AnalysisOutput";

function TextSummarizer2() {
  // State Management Section
  // Core content states
  const [inputText, setInputText] = useState(""); // Stores the user's input text
  const [generatedContent, setGeneratedContent] = useState({
    summary: "",
    tweet: "",
    thread: "",
  }); // Stores all generated content types
  const [outputText, setOutputText] = useState(""); // Currently displayed output

  // UI control states
  const [loading, setLoading] = useState(false); // Loading indicator
  const [activeTab, setActiveTab] = useState("summary"); // Current content type
  const [errorMessage, setErrorMessage] = useState(""); // Error display
  const [successMessage, setSuccessMessage] = useState(""); // Success messages

  // Content tracking states
  const [lastProcessedText, setLastProcessedText] = useState(""); // Prevents redundant processing
  const [selectedTones, setSelectedTones] = useState([]); // Selected writing tones
  const [lastUsedTones, setLastUsedTones] = useState([]); // Tone tracking for updates

  // Analysis states
  const [username, setUsername] = useState(""); // Creator's username
  const [analysisOutput, setAnalysisOutput] = useState(""); // Stores style analysis results

  // Helper Functions Section

  // Analyzes the creator's writing style
  const analyzeCreatorTweets = async () => {
    if (!username.trim()) {
      return "No specific creator style analysis requested. Using general best practices for tweet creation.";
    }

    try {
      const genAI = new GoogleGenerativeAI(
        process.env.REACT_APP_GEMINI_API_KEY
      );
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      // Comprehensive analysis prompt
      const analysisPrompt = `You are a highly intelligent text analysis assistant trained to extract writing styles and formats from Twitter accounts. Your task is to analyze tweets and produce a concise summary that captures the essence of the account's tone, writing style, and format.
        Instructions:
        Input Details: Twitter Username = ${username}
        Task Overview: Fetch two representative tweets from the given account and analyze them.
        Output Structure: Provide a structured summary of the account's writing style, including:
        Tone: Describe the tone (e.g., professional, witty, casual, inspirational).
        Format: Specify how tweets are formatted (e.g., use of emojis, short sentences, storytelling, bullet points).
        Themes: Highlight the main themes or topics they write about.
        Pacing: Note if the tweets are quick and concise or detailed and elaborate.
        Generate a Writing Blueprint: Based on the analysis, create a reusable blueprint for another model to emulate this writing style. The blueprint should include:
        Sentence structure.
        Preferred vocabulary or phrasing.`;

      const result = await model.generateContent(analysisPrompt);
      return result.response.text();
    } catch (error) {
      console.error("Analysis Error:", error);
      throw error;
    }
  };

  // Generates content with style analysis for tweets
  const generateTweet = async () => {
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Get style analysis if username is provided
    const analysis = await analyzeCreatorTweets();
    setAnalysisOutput(analysis);

    // Construct the prompt based on whether we have creator analysis
    const tweetPrompt = `Based on the given text, create a single tweet of up to 280 characters.
      Mood Instructions: Write the tweet in ${
        selectedTones.length > 0
          ? `a combination of ${selectedTones.join(" and ")} tones`
          : "a natural tone that matches the text"
      }.
      
      ${username.trim() ? `Style Analysis Results: ${analysis}` : ""}
      
      Writing Guidelines:
      ${
        username.trim()
          ? "- Emulate the analyzed writing style while maintaining authenticity"
          : "- Use a clear, engaging writing style"
      }
      - Begin with a compelling hook to grab attention
      - Clearly explain the main idea or provide actionable advice
      - Use simple, approachable language
      - Include emotional or logical appeal as appropriate
      - Conclude with a strong CTA or thought-provoking statement
      - Don't use hashtags in the output
      - Give the output with proper line gaps and formatting to separate hook from the body and CTA
      - Give only the tweet as the final response.
   
      Text: ${inputText}`;

    const result = await model.generateContent(tweetPrompt);
    return result.response.text();
  };

  // Main generation handler
  const handleGenerate = async (type) => {
    if (!inputText.trim()) {
      setErrorMessage("Please enter some text first");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    // Check if regeneration is needed
    if (
      inputText === lastProcessedText &&
      generatedContent[type] &&
      JSON.stringify(selectedTones.sort()) ===
        JSON.stringify(lastUsedTones.sort())
    ) {
      setActiveTab(type);
      setOutputText(generatedContent[type]);
      return;
    }

    setLoading(true);
    try {
      let newContent;

      if (type === "tweet") {
        // Use the combined tweet generation function
        newContent = await generateTweet();
      } else {
        // Handle other content types
        const genAI = new GoogleGenerativeAI(
          process.env.REACT_APP_GEMINI_API_KEY
        );
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-exp",
        });

        const prompts = {
          summary: `Analyze the following text and generate an explanatory summary. The summary should:
            - Highlight the main ideas, breaking them down in a clear and concise way
            - Include important details and context to provide a thorough understanding
            - Be structured logically to flow naturally
            Text: ${inputText}`,
          thread: `You are a professional social media copywriter. 
            Create a Twitter thread with these guidelines:
            Tone: ${
              selectedTones.length > 0
                ? `Combine ${selectedTones.join(" and ")} tones`
                : "Use a natural tone"
            }
            
            Structure:
            - Opening tweet with a hook
            - Several tweets elaborating main points
            - Closing tweet with summary and call to action
            
            Format each tweet with numbers (1/, 2/, etc.)
            Keep each tweet under 280 characters
            Don't use hashtags
            
            Text: ${inputText}`,
        };

        const result = await model.generateContent(prompts[type]);
        newContent = result.response.text();
      }

      setGeneratedContent((prev) => ({
        ...prev,
        [type]: newContent,
      }));
      setOutputText(newContent);
      setLastProcessedText(inputText);
      setLastUsedTones([...selectedTones]);
    } catch (error) {
      console.error("Generation Error:", error);
      setErrorMessage(
        "An error occurred while generating content. Please try again."
      );
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
      setActiveTab(type);
    }
  };

  // UI Event Handlers Section

  // Handles copying content to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setSuccessMessage("Copied to clipboard!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handles tab changes and content generation
  const handleTabChange = (type) => {
    if (generatedContent[type]) {
      setActiveTab(type);
      setOutputText(generatedContent[type]);
    } else {
      handleGenerate(type);
    }
  };

  // Resets all state to initial values
  const handleReset = () => {
    setInputText("");
    setOutputText("");
    setGeneratedContent({
      summary: "",
      tweet: "",
      thread: "",
    });
    setLastProcessedText("");
    setActiveTab("summary");
    setSelectedTones([]);
    setUsername("");
    setAnalysisOutput("");
  };

  // Handles tone selection changes
  const handleToneChange = (newTones) => {
    setSelectedTones(newTones);
    setGeneratedContent({
      summary: "",
      tweet: "",
      thread: "",
    });
  };

  // Handles posting to Twitter/X
  const handlePostToX = () => {
    if (!outputText) return;
    const encodedText = encodeURIComponent(outputText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(twitterUrl, "_blank");
  };

  // Effect Hooks Section

  // Updates output text when switching tabs
  useEffect(() => {
    setOutputText(generatedContent[activeTab] || "");
  }, [activeTab, generatedContent]);

  // Clears generated content when input changes
  useEffect(() => {
    if (inputText !== lastProcessedText) {
      setGeneratedContent({
        summary: "",
        tweet: "",
        thread: "",
      });
    }
  }, [inputText, lastProcessedText]);

  // JSX Section
  return (
    <div className="flex flex-row gap-x-6 justify-center gap-y-4 flex-wrap  md:flex-nowrap">
      <div className="bg-white sm:w-2/3  dark:bg-black rounded-lg border border-gray-200 dark:border-gray-600 p-5 space-y-5">
        {/* Input Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add Your Content
            </h2>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-sm border border-gray-400 dark:border-gray-300 rounded-md
                text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-black/90
                transition-colors"
            >
              Reset All
            </button>
          </div>

          {/* Username Input */}
          <input
            type="text"
            placeholder="Enter creator username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border dark:bg-black dark:text-white border-gray-300 dark:border-gray-500 rounded mb-4"
          />

          {/* Content Input */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter content to generate results..."
            className="w-full min-h-[180px] p-4 border border-gray-300 dark:border-gray-500 rounded-lg 
              focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-100 resize-none
              dark:bg-black dark:text-white dark:placeholder-gray-400 font-newsreader text-base"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>

        {/* Tone Selector */}
        <ToneSelector
          selectedTones={selectedTones}
          onToneChange={handleToneChange}
        />

        {/* Action Buttons */}
        <div className="flex gap-3">
          {["summary", "tweet", "thread"].map((type) => (
            <button
              key={type}
              onClick={() => handleTabChange(type)}
              disabled={loading}
              className={`flex-1 py-2.5 px-4 rounded-lg text-white font-medium transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : activeTab === type
                  ? "bg-black dark:bg-white dark:text-black"
                  : "bg-gray-900 hover:bg-gray-800 active:bg-gray-700 border border-gray-400 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:border-gray-100"
              }`}
            >
              {type === "summary"
                ? "Summarize"
                : type === "tweet"
                ? "Generate Tweet"
                : "Generate Thread"}
            </button>
          ))}
        </div>

        {/* Output Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {activeTab === "summary"
                ? "Summary"
                : activeTab === "tweet"
                ? "Generated Tweet"
                : "Generated Thread"}
            </h2>

            {/* Output Actions */}
            <div className="flex gap-2">
              {outputText && (
                <>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-sm border border-gray-400 dark:border-gray-100 rounded-md
                      text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-black/90
                      transition-colors flex items-center gap-2"
                  >
                    <span>Copy</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  </button>

                  {/* Post to X/Twitter Button */}
                  {activeTab === "tweet" && (
                    <button
                      onClick={handlePostToX}
                      className="px-3 py-1.5 text-sm border border-gray-400 dark:border-gray-100 rounded-md
                        text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-black/90
                        transition-colors flex items-center gap-2"
                    >
                      <span>Post to </span>
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div
            className="w-full min-h-[180px] p-4 border border-gray-300 dark:border-gray-500 rounded-lg
            bg-white dark:bg-black whitespace-pre-line
            text-gray-900 placeholder-gray-400 dark:text-white overflow-y-auto font-newsreader text-base"
          >
            {outputText ||
              `Generated ${
                activeTab === "summary"
                  ? "summary"
                  : activeTab === "tweet"
                  ? "tweet"
                  : "thread"
              } will appear here...`}
          </div>
          {successMessage && (
            <p className="text-green-600 text-sm mt-2">{successMessage}</p>
          )}
        </div>
      </div>
      <div className="sm:w-1/3  pt-5 pb-3 px-5 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-600 overflow-scroll">
        {analysisOutput ? (
          <>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Analysis of @{username}
            </h2>
            <AnalysisOutput analysisOutput={analysisOutput} />
          </>
        ) : (
          <h1 className="text-xl font-medium dark:text-white">
            Creator Tweet Analysis will appear here
          </h1>
        )}
      </div>
    </div>
  );
}

export default TextSummarizer2;
