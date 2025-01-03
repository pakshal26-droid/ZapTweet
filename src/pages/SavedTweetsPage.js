import React, { useState, useEffect } from 'react';
import { tweetService } from '../services/tweetService';

const SavedTweetsPage = () => {
  const [savedTweets, setSavedTweets] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSavedTweets();
  }, []);

  const fetchSavedTweets = async () => {
    try {
      const tweets = await tweetService.fetchSavedTweets();
      setSavedTweets(tweets);
    } catch (error) {
      setErrorMessage('Failed to fetch saved tweets');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleCopyTweet = (tweetContent) => {
    navigator.clipboard.writeText(tweetContent);
    setSuccessMessage("Tweet copied!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      await tweetService.deleteTweet(tweetId);
      await fetchSavedTweets();
      setSuccessMessage("Tweet deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to delete tweet");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

const handlePostToX = (tweetContent) => {
    if (!tweetContent) return;
    const encodedText = encodeURIComponent(tweetContent);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(twitterUrl, "_blank");
};
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Saved Tweets
      </h2>

      {successMessage && (
        <p className="text-green-600 text-sm mb-4">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
      )}

      {savedTweets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedTweets.map((tweet) => (
            <div
              key={tweet.id}
              className="p-4 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-black relative"
            >
              <p className="text-gray-900 dark:text-white mb-4">
                {tweet.tweet_content}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyTweet(tweet.tweet_content)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                      px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleDeleteTweet(tweet.id)}
                    className="text-sm text-red-600 hover:text-red-800
                      px-3 py-1.5 rounded-md border border-red-300 hover:border-red-500"
                  >
                    Delete
                  </button>
                  <button
                        onClick={()=>handlePostToX(tweet.tweet_content)}
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
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(tweet.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No tweets saved yet.
        </p>
      )}
    </div>
  );
};

export default SavedTweetsPage; 