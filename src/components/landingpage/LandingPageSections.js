import React from 'react';
import TestimonialCard from '../TestimonialCard';
import TestimonialSection from '../TestimonialSection';
import FAQSection from '../FAQSection';

const LandingPageSections = ({onGetStarted}) => {
    const features = [
        {
          title: "AI tweet generation",
          description: "Generate engaging tweets using AI, tailored to your audience and brand voice."
        },
        {
          title: "PDF-to-post conversion",
          description: "Effortlessly convert key insights from PDFs into shareable social media posts."
        },
        {
          title: "LinkedIn post generation",
          description: "Craft professional LinkedIn posts optimized for reach and engagement using AI."
        },
        {
          title: "Scheduling",
          description: "Plan and schedule your content in advance for consistent and timely posting."
        },
        {
          title: "Thread creation",
          description: "Create informative and compelling Twitter threads that tell a cohesive story."
        }
      ];
      
  return (
    <>
      <section className='py-20 '>
        <div className='max-w-5xl mx-auto text-center'>
          <h2 className='text-7xl font-anek font-bold mb-5'>Stop Wasting Hours, <br/> <span className='text-blue-600'>Start Posting Smarter</span> </h2>
          <p className='text-2xl px-32 text-gray-600 font-caladea '>ZapTweet helps you generate and schedule engaging social media posts in seconds, saving you hours of manual work.</p>
        </div>
      </section>

      <section className='py-20 mt-24'>
        <div className='max-w-7xl mx-auto px-4'>
          {features.map((feature, index) => (
            <div key={index} className={`mb-20 md:mb-40 flex flex-col md:flex-row items-center justify-between gap-10 ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}>
              <div className={`w-full md:w-1/2 gap-y-5 md:gap-y-10 flex flex-col items-center md:items-start ${
                index % 2 === 1 ? 'md:items-end' : 'md:items-start'
              }`}>
                <div className={`flex flex-col items-center md:items-start ${
                  index % 2 === 1 ? 'md:items-end' : 'md:items-start'
                }`}>
                  <h3 className='text-3xl md:text-5xl font-anek font-bold text-center md:text-left'>{feature.title}</h3>
                  <p className={`text-lg md:text-2xl font-medium font-caladea mt-3 md:mt-5 max-w-[400px] text-center md:text-left ${
                    index % 2 === 1 ? 'md:text-right' : 'md:text-left'
                  }`}>{feature.description}</p> 
                </div>
                <button className='bg-blue-600 font-semibold text-white hover:bg-white hover:text-black border-2 border-black px-7 lg:px-20 py-1 lg:py-3 rounded-full' onClick={onGetStarted}>
                  Get Started
                </button>
              </div>
              <div className='h-64 md:h-96 rounded-sm bg-gray-300 w-full md:w-1/2'/>
            </div>
          ))}
        </div>
      </section>

      {/* <section className='py-20 '>
        <div className='max-w-5xl mx-auto text-center'>
          <h2 className='text-4xl font-bold mb-5'>How It Works</h2>
          <ol className='list-decimal list-inside  text-lg lg:text-2xl tracking-normal gap-x-10 flex flex-col md:flex-row justify-between items-center'>
            <li>Sign up and log in</li>
            <li>Upload your text or PDF</li>
            <li>Select your desired tone</li>
            <li>Generate and schedule posts</li>
            <li>Engage with your audience</li>
          </ol>
        </div>
      </section> */}

      {/* <section className='py-20'>
        <div className='max-w-5xl mx-auto text-center'>
          <h2 className='text-4xl font-bold mb-5 '>Impact & Testimonials</h2>
          <p className='text-lg  mb-10'>See how ZapTweet is transforming social media management for our users.</p>
          <blockquote className='text-lg  italic'>"ZapTweet has saved me hours of work each week. The AI-generated posts are spot on!" - Happy User</blockquote>
        </div>
      </section> */}

     
    <section className='py-20 overflow-hidden'>
        <TestimonialSection/>
    </section>
    <section className='py-20'>
      <FAQSection />
    </section>
    </>
  );
};

export default LandingPageSections;
