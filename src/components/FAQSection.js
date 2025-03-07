import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How does ZapTweet use AI?",
      answer: "ZapTweet uses advanced AI algorithms to generate engaging social media posts based on your input. Our AI understands context, tone, and your brand voice to create perfectly tailored content."
    },
    {
      question: "Is my data safe?",
      answer: "Yes, we prioritize your privacy and ensure your data is secure. We use industry-standard encryption and security measures to protect all your information."
    },
    {
      question: "Can I schedule posts?",
      answer: "Absolutely! ZapTweet allows you to schedule posts for consistent engagement. You can plan your content calendar ahead of time and let our automation handle the posting."
    },
    {
      question: "What platforms do you support?",
      answer: "Currently, we support LinkedIn and Twitter (X). We're constantly working on adding more platforms to our suite of tools."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className='max-w-3xl pb-14 mx-auto'>
      <h2 className='text-6xl font-bold mb-10 text-center font-anek'>Frequently Asked <span className='text-blue-600'>Questions</span></h2>
      <div className='space-y-4'>
        {faqs.map((faq, index) => (
          <div key={index} className='border rounded-lg overflow-hidden'>
            <button
              className='w-full p-4 text-left flex justify-between items-center hover:bg-gray-50'
              onClick={() => toggleFAQ(index)}
            >
              <span className='font-bold text-xl'>{faq.question}</span>
              {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                activeIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className='p-4 bg-gray-50 text-lg font-medium text-gray-600'>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
