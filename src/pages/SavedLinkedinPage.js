import React, { useState, useEffect } from 'react';
import { linkedinService } from '../services/linkedinService';
import ConfirmationModal from '../components/ConfirmationModal';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const SavedLinkedinPage = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      setIsLoading(true);
      const posts = await linkedinService.fetchSavedPosts();
      setSavedPosts(posts);
    } catch (error) {
      setErrorMessage('Failed to fetch saved posts');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPost = (content) => {
    navigator.clipboard.writeText(content);
    setSuccessMessage("Post copied!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await linkedinService.deletePost(postToDelete.id);
      await fetchSavedPosts();
      setSuccessMessage("Post deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to delete post");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  const handlePostToLinkedin = (content) => {
    if (!content) return;
    const url = 'https://www.linkedin.com/sharing/share-offsite/';
    const params = new URLSearchParams({
      url: window.location.href,
      text: content,
    });
    window.open(`${url}?${params.toString()}`, '_blank');
  };

  const filteredPosts = savedPosts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-2 px-10 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto md:px-0 px-4 font-anek  py-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl tracking-tight font-semibold text-gray-900 dark:text-white">
          Saved LinkedIn Posts ({savedPosts.length})
        </h2>
        <div className="w-full sm:w-auto relative">
          <input
            type="text"
            placeholder="Search posts..."
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

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 border border-gray-300 dark:border-gray-500 rounded-lg 
                bg-white dark:bg-black relative shadow-sm hover:shadow-md 
                transition-shadow duration-200"
            >
              <div className="whitespace-pre-line h-48 overflow-scroll text-gray-900 dark:text-white mb-4">
                {post.content}
              </div>
              <div className="flex flex-wrap justify-between items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <button
                    data-tooltip-id="copy-tooltip"
                    data-tooltip-content="Copy post"
                    onClick={() => handleCopyPost(post.content)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                      px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600
                      transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                  <button
                    data-tooltip-id="share-tooltip"
                    data-tooltip-content="Share on LinkedIn"
                    onClick={() => handlePostToLinkedin(post.content)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                      px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600
                      transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                  <button
                    data-tooltip-id="delete-tooltip"
                    data-tooltip-content="Delete post"
                    onClick={() => handleDeleteClick(post)}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
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
            No saved LinkedIn posts yet! Start creating now.
          </p>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this LinkedIn post?"
      />

      <Tooltip id="copy-tooltip" />
      <Tooltip id="share-tooltip" />
      <Tooltip id="delete-tooltip" />
    </div>
  );
};

export default SavedLinkedinPage;