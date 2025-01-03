import React from 'react';

const SavedTweetsSidebar = ({ savedTweets, onCopyTweet, onDeleteTweet, successMessage }) => {
  return (
    <div className="w-80 h-screen fixed right-0 top-0 bg-white dark:bg-black border-l border-gray-200 dark:border-gray-600 p-5 overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Saved Tweets
      </h2>
      
      {successMessage && (
        <p className="text-green-600 text-sm mb-3">{successMessage}</p>
      )}

      {savedTweets.length > 0 ? (
        <ul className="space-y-4">
          {savedTweets.map((tweet) => (
            <li
              key={tweet.id}
              className="p-4 border border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-black relative group"
            >
              <p className="text-gray-900 dark:text-white mb-3 text-sm">
                {tweet.tweet_content}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onCopyTweet(tweet.tweet_content)}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                    px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600"
                >
                  Copy
                </button>
                <button
                  onClick={() => onDeleteTweet(tweet.id)}
                  className="text-xs text-red-600 hover:text-red-800
                    px-2 py-1 rounded-md border border-red-300 hover:border-red-500"
                >
                  Delete
                </button>
              </div>
              <span className="text-xs text-gray-500 absolute top-2 right-2">
                {new Date(tweet.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No tweets saved yet.
        </p>
      )}
    </div>
  );
};

export default SavedTweetsSidebar;
