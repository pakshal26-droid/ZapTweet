import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ToneSelector from "./ToneSelector";
import AnalysisOutput from "./AnalysisOutput";
import { tweetService } from '../services/tweetService';
import { pdfService } from '../services/pdfService';
import ReactMarkdown from 'react-markdown';

function TextSummarizer2() {
  // State Management Section
  // Core content states
  const [inputText, setInputText] = useState(""); // Stores the user's input text
  const [generatedContent, setGeneratedContent] = useState({
    linkedin: "",
    tweet: "",
    thread: "",
  }); // Stores all generated content types
  const [outputText, setOutputText] = useState(""); // Currently displayed output

  // UI control states
  const [loading, setLoading] = useState(false); // Loading indicator
  const [activeTab, setActiveTab] = useState("linkedin"); // Current content type
  const [errorMessage, setErrorMessage] = useState(""); // Error display
  const [successMessage, setSuccessMessage] = useState(""); // Success messages

  // Content tracking states
  const [lastProcessedText, setLastProcessedText] = useState(""); // Prevents redundant processing
  const [selectedTones, setSelectedTones] = useState([]); // Selected writing tones
  const [lastUsedTones, setLastUsedTones] = useState([]); // Tone tracking for updates

  // Analysis states
  const [username, setUsername] = useState(""); // Creator's username
  const [analysisOutput, setAnalysisOutput] = useState(""); // Stores style analysis results

  // PDF states
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [generatedTweets, setGeneratedTweets] = useState([]);
  const [inputMethod, setInputMethod] = useState('text'); // 'text' or 'pdf'

  // Add this state at the top with other states
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Helper Functions Section

  // Analyzes the creator's writing style
  const analyzeCreatorTweets = async () => {
    if (!username.trim()) {
      return "No specific creator style analysis requested. Using general best practices for tweet creation.";
    }

    try {
      setIsAnalyzing(true);
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
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
        Give the output in a concise manner 
        Preferred vocabulary or phrasing.`;

      const result = await model.generateContent(analysisPrompt);
      return result.response.text();
    } catch (error) {
      console.error("Analysis Error:", error);
      throw error;
    } finally {
      setIsAnalyzing(false);
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

  // Save generated tweet to dashboard
  const handleSaveTweet = async () => {
    if (outputText && activeTab === "tweet") {
      try {
        await tweetService.saveTweet(outputText);
        setSuccessMessage("Tweet saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        setErrorMessage("Failed to save tweet");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
  };

  // Add a delete tweet function
  

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
          /*summary: `Analyze the following text and generate an explanatory summary. The summary should:
            - Highlight the main ideas, breaking them down in a clear and concise way
            - Include important details and context to provide a thorough understanding
            - Be structured logically to flow naturally
            Text: ${inputText}`,*/
          linkedin:`Write a professional and engaging LinkedIn post based on the following details:

          The post should:
          1. Start with an engaging hook or headline.
          2. Be conversational and professional in tone.
          3. Highlight key achievements, challenges, or learnings.
          4. End with a reflection, gratitude, or a call-to-action.
          5. User point format , lists wherever necessary
          Make it long but impactful, and suitable for a LinkedIn audience.
          Only give the 1 post as the output and nothing else.
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
      linkedin: "",
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
      linkedin: "",
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

  // Add these functions to handle PDF upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadError('');
    } else {
      setSelectedFile(null);
      setUploadError('Please select a PDF file');
    }
  };

  const handlePdfUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a PDF file first');
      return;
    }

    setIsProcessingPdf(true);
    setUploadError('');

    try {
      const tweets = await pdfService.uploadPdf(selectedFile);
      setGeneratedTweets(tweets);
      if (tweets.length > 0) {
        const firstTweet = tweets[0];
        setGeneratedContent(prev => ({
          ...prev,
          tweet: `${firstTweet.hook}\n\n${firstTweet.body}\n\n${firstTweet.cta}`
        }));
        setOutputText(`${firstTweet.hook}\n\n${firstTweet.body}\n\n${firstTweet.cta}`);
        setActiveTab('tweet');
      }
    } catch (error) {
      setUploadError('Failed to process PDF. Please try again.');
    } finally {
      setIsProcessingPdf(false);
    }
  };

  // Add this function alongside your other handlers
  const handlePostToLinkedin = () => {
    if (!outputText) return;
    
    // LinkedIn sharing URL parameters
    const url = 'https://www.linkedin.com/sharing/share-offsite/';
    const params = new URLSearchParams({
      url: window.location.href, // Current page URL
      text: outputText, // The generated LinkedIn post content
    });

    // Open LinkedIn sharing dialog in a new window
    window.open(`${url}?${params.toString()}`, '_blank');
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
        linkedin: "",
        tweet: "",
        thread: "",
      });
    }
  }, [inputText, lastProcessedText]);

  // JSX Section
  return (
    <div className="flex flex-row gap-x-4 pb-4 justify-center gap-y-4 flex-wrap px-4  md:flex-nowrap">
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
          {inputMethod === "text" && (
          <input
            type="text"
            placeholder="Enter favourite X creator's username (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border dark:bg-black dark:text-white border-gray-300 dark:border-gray-500 rounded mb-4"
          />)}

          {/* Content Input */}
          <div className="mb-4">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setInputMethod('text')}
                className={`px-4 py-2 rounded-md ${
                  inputMethod === 'text'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Type Text
              </button>
              <button
                onClick={() => setInputMethod('pdf')}
                className={`px-4 py-2 rounded-md ${
                  inputMethod === 'pdf'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                Upload PDF
              </button>
            </div>

            {inputMethod === 'text' ? (
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter content to generate results..."
                className="w-full min-h-[240px] p-4 border border-gray-300 dark:border-gray-500 rounded-lg 
                  focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-100 resize-none
                  dark:bg-black dark:text-white dark:placeholder-gray-400 font-sans text-base"
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 
                hover:border-gray-400 dark:hover:border-gray-500 transition-colors
                shadow-sm hover:shadow-md">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-full mb-4">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    {selectedFile ? selectedFile.name : 'Click to upload PDF'}
                  </span>
                  <span className="text-sm text-gray-500">
                    or drag and drop your file here
                  </span>
                </label>
                {selectedFile && (
                  <button
                    onClick={handlePdfUpload}
                    disabled={isProcessingPdf}
                    className="mt-6 w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-md
                      hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors
                      shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessingPdf ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Process PDF
                      </>
                    )}
                  </button>
                )}
                {uploadError && (
                  <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}
              </div>
            )}
          </div>

          {/* Only show Tone Selector and Action Buttons if not in PDF mode */}
          {inputMethod === 'text' && (
            <>
              {/* Tone Selector */}
              <ToneSelector
                selectedTones={selectedTones}
                onToneChange={handleToneChange}
              />

              {/* Action Buttons */}
              <div className="flex mt-4 gap-3">
                {["linkedin", "tweet", "thread"].map((type) => (
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
                    {type === "linkedin"
                      ? "Linkedin Post"
                      : type === "tweet"
                      ? "Generate Tweet"
                      : "Generate Thread"}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Output Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {activeTab === "linkedin" && inputMethod === "text"
                ? "Linkedin Post"
                : activeTab === "tweet" && inputMethod === "text" || inputMethod === "pdf"
                ? "Generated Tweet"
                : "Generated Thread"}
            </h2>

            {/* Output Actions */}
            <div className="flex gap-2">
              {outputText && (
                <>
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                      border border-gray-300 dark:border-gray-600 rounded-md
                      transition-colors duration-200"
                    data-tooltip-id="copy-tooltip"
                    data-tooltip-content="Copy to clipboard"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>

                  {/* LinkedIn Share Button */}
                  {activeTab === "linkedin" && (
                    <button
                      onClick={handlePostToLinkedin}
                      className="px-3 py-1.5 text-sm border border-gray-400 dark:border-gray-100 rounded-md
                        text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-black/90
                        transition-colors flex items-center gap-2"
                    >
                      <span>Post to</span>
                      <svg 
                        className="w-4 h-4" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                  )}

                  {/* Post to X/Twitter Button */}
                  {activeTab === "tweet" && (
                    <>
                      <button
                        onClick={handlePostToX}
                        className="px-3 py-1.5 text-sm border border-gray-400 dark:border-gray-100 rounded-md
                          text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-black/90
                          transition-colors flex items-center gap-2"
                      >
                        <span>Post to</span>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </button>
                      <button
                        onClick={handleSaveTweet}
                        className="px-3 py-1.5 text-sm border border-gray-400 dark:border-gray-100 rounded-md
                          text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-black/90
                          transition-colors flex items-center gap-2"
                      >
                        <span>Save to Dashboard</span>
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div
            className="w-full min-h-[180px] p-4 border border-gray-300 dark:border-gray-500 rounded-lg
            bg-white dark:bg-black whitespace-pre-line
            text-gray-900 placeholder-gray-400 dark:text-white overflow-y-auto font-sans text-base"
          >
            {outputText ||
              `Generated ${
                activeTab === "linkedin" && inputMethod === "text"
                  ? "Linkedin Post"
                  : activeTab === "tweet" && inputMethod === "text" || inputMethod === "pdf"
                  ? "tweets"
                  : "thread"
              } will appear here...`}
          </div>
          {successMessage && (
            <p className="text-green-600 text-sm mt-2">{successMessage}</p>
          )}
        </div>
      </div>
      <div className="sm:w-1/3 w-full pt-5 pb-3 px-5 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-600 overflow-scroll">
        {isAnalyzing || isProcessingPdf ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {isAnalyzing ? "Analyzing creator's style..." : "Processing PDF..."}
            </p>
          </div>
        ) : inputMethod === 'text' ? (
          activeTab === 'linkedin' ? (
            // LinkedIn Post Display
            <>
              <h2 className="text-xl tracking-tight font-semibold text-gray-900 dark:text-white mb-4">
                LinkedIn Post Preview
              </h2>
              <div className="markdown-content">
                {generatedContent.linkedin ? (
                  <MarkdownDisplay content={generatedContent.linkedin} />
                ) : (
                  <p className="text-gray-500">
                    Generated LinkedIn post will appear here
                  </p>
                )}
              </div>
            </>
          ) : (
            // Analysis Output for Tweet Generation
            analysisOutput ? (
              <>
                <h2 className="text-xl tracking-tight font-semibold text-gray-900 dark:text-white mb-3">
                  Analysis of @{username}
                </h2>
                <div className="markdown-content">
                  <MarkdownDisplay content={analysisOutput} />
                </div>
              </>
            ) : (
              <>
                <h1 className="text-xl tracking-tight font-semibold text-gray-900 mb-4 dark:text-white">
                  Creator's X Analysis
                </h1>
                <p className="text-gray-500">
                  Creator analysis will appear here
                </p>
              </>
            )
          )
        ) : (
          // PDF Generated Tweets Display
          <>
            <h2 className="text-xl tracking-tight font-semibold text-gray-900 dark:text-white mb-4">
              Generated Tweets from PDF
            </h2>
            {generatedTweets.length > 0 ? (
              <div className="space-y-4">
                {generatedTweets.map((tweet, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer 
                      hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    onClick={() => {
                      setOutputText(`${tweet.hook}\n\n${tweet.body}\n\n${tweet.cta}`);
                      setGeneratedContent(prev => ({
                        ...prev,
                        tweet: `${tweet.hook}\n\n${tweet.body}\n\n${tweet.cta}`
                      }));
                    }}
                  >
                    <div className="flex flex-col space-y-3">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {tweet.hook}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {tweet.body}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 italic">
                        {tweet.cta}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                      <span className="text-sm text-gray-500">
                        Tweet {index + 1} of {generatedTweets.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Your tweets from PDF will appear here
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const MarkdownDisplay = ({ content }) => {
  return (
    <ReactMarkdown
      className="prose dark:prose-invert max-w-none
        prose-headings:text-gray-900 dark:prose-headings:text-white
        prose-p:text-gray-700 dark:prose-p:text-gray-300
        prose-strong:text-gray-900 dark:prose-strong:text-white
        prose-ul:text-gray-700 dark:prose-ul:text-gray-300
        prose-li:text-gray-700 dark:prose-li:text-gray-300"
    >
      {content}
    </ReactMarkdown>
  );
};

export default TextSummarizer2;
