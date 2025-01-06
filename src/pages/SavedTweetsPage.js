import React, { useState, useEffect } from 'react';
import { tweetService } from '../services/tweetService';
import ConfirmationModal from '../components/ConfirmationModal';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const SavedTweetsPage = () => {
  const [savedTweets, setSavedTweets] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tweetToDelete, setTweetToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedTweets();
  }, []);

  const fetchSavedTweets = async () => {
    try {
      setIsLoading(true);
      const tweets = await tweetService.fetchSavedTweets();
      setSavedTweets(tweets);
    } catch (error) {
      setErrorMessage('Failed to fetch saved tweets');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTweet = (tweetContent) => {
    navigator.clipboard.writeText(tweetContent);
    setSuccessMessage("Tweet copied!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteClick = (tweet) => {
    setTweetToDelete(tweet);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await tweetService.deleteTweet(tweetToDelete.id);
      await fetchSavedTweets();
      setSuccessMessage("Tweet deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to delete tweet");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsDeleteModalOpen(false);
      setTweetToDelete(null);
    }
  };

  const handlePostToX = (tweetContent) => {
    if (!tweetContent) return;
    const encodedText = encodeURIComponent(tweetContent);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(twitterUrl, "_blank");
  };

  const filteredTweets = savedTweets.filter(tweet => 
    tweet.tweet_content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-2 px-10 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl tracking-tight font-semibold text-gray-900 dark:text-white">
          Saved Tweets ({savedTweets.length})
        </h2>
        <div className="w-full sm:w-auto relative">
          <input
            type="text"
            placeholder="Search tweets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 border dark:bg-black dark:text-white 
              border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-100"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {successMessage && (
        <p className="text-green-600 text-sm mb-4">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
      )}

      {filteredTweets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTweets.map((tweet) => (
            <div
              key={tweet.id}
              className="p-4 border border-gray-300 dark:border-gray-500 rounded-lg 
                bg-white dark:bg-black relative shadow-sm hover:shadow-md 
                transition-shadow duration-200"
            >
              <p className="text-gray-900 dark:text-white mb-4 break-words">
                {tweet.tweet_content}
              </p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex gap-2">
                  <button
                    data-tooltip-id="copy-tooltip"
                    data-tooltip-content="Copy tweet"
                    onClick={() => handleCopyTweet(tweet.tweet_content)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                      sm:px-3 sm:py-1.5 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600
                      transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                  <button
                    data-tooltip-id="post-tooltip"
                    data-tooltip-content="Post to X"
                    onClick={() => handlePostToX(tweet.tweet_content)}
                    className="sm:px-3 sm:py-1.5 px-2 py-1 text-sm border border-gray-400 dark:border-gray-100 rounded-md
                      text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-black/90
                      transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  <button
                    data-tooltip-id="delete-tooltip"
                    data-tooltip-content="Delete tweet"
                    onClick={() => handleDeleteClick(tweet)}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(tweet.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            No saved tweets yet! Start creating now.
          </p>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this tweet?"
      />

      <Tooltip id="copy-tooltip" />
      <Tooltip id="post-tooltip" />
      <Tooltip id="delete-tooltip" />
    </div>
  );
};

export default SavedTweetsPage; 