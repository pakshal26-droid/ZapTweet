// import React, { useRef } from 'react';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import TestimonialCard from './TestimonialCard';

// const TestimonialSection = () => {
//   const scrollContainerRef = useRef(null);
  
//   const scroll = (direction) => {
//     const container = scrollContainerRef.current;
//     const scrollAmount = container.offsetWidth;
//     container.scrollBy({
//       left: direction === 'left' ? -scrollAmount : scrollAmount,
//       behavior: 'smooth'
//     });
//   };

//   const testimonials = [
//     {
//       name: "Sarah Johnson",
//       company: "GrowthLabs",
//       testimonial: "This tool has completely transformed how we manage our social media. The AI-generated content is top-notch and saves us hours every week!",
//       rating: 5
//     },
//     {
//       name: "Michael Lee",
//       company: "StartupBoost",
//       testimonial: "The LinkedIn post generation feature is a game-changer. Our engagement has skyrocketed since we started using it!",
//       rating: 4.8
//     },
//     {
//       name: "Emily Carter",
//       company: "BrandElevate",
//       testimonial: "PDF-to-post conversion is incredibly useful. I can turn research documents into bite-sized content in seconds!",
//       rating: 4.9
//     },
//     {
//       name: "Daniel Martinez",
//       company: "SocialSuite",
//       testimonial: "Thread creation has helped us craft engaging Twitter threads effortlessly. It’s like having a personal content strategist!",
//       rating: 5
//     },
//     {
//       name: "Olivia Reynolds",
//       company: "ContentFlow",
//       testimonial: "Scheduling and automation make social media management so much easier. We can focus on strategy while the tool handles the rest.",
//       rating: 4.7
//     }
//   ];

//   return (
//     <div className='py-10 md:py-20 relative max-w-7xl mx-auto px-4'>
//       <h1 className='text-3xl md:text-5xl font-bold mb-10 text-center font-anek'>
//         Loved by lots of <span className='text-blue-600'>creators</span>
//       </h1>
      
//       {/* Navigation Buttons - Hide on mobile */}
//       <button 
//         onClick={() => scroll('left')}
//         className='hidden md:block absolute left-0 top-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100'
//       >
//         <FaChevronLeft size={20} />
//       </button>
      
//       <button 
//         onClick={() => scroll('right')}
//         className='hidden md:block absolute right-0 top-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100'
//       >
//         <FaChevronRight size={20} />
//       </button>

//       {/* Testimonials Container */}
//       <div 
//         ref={scrollContainerRef}
//         className='flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-1'
//         style={{
//           scrollbarWidth: 'none',
//           '-ms-overflow-style': 'none',
//           '-webkit-overflow-scrolling': 'touch'
//         }}
//       >
//         {testimonials.map((testimonial, index) => (
//           <div key={index} className='snap-center snap-always min-w-[300px] md:min-w-[400px]'>
//             <TestimonialCard 
//               testimonial={testimonial.testimonial} 
//               name={testimonial.name} 
//               rating={testimonial.rating}
//               company={testimonial.company}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TestimonialSection;
import React, { useState } from 'react';

const ClientTestimonial = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      quote: "Working with Agolas was the best decision for our brand. They were professional, creative, and delivered a distinctive brand that represents our unique value.",
      author: "MARTIN SCHROEDER",
      position: "HR Manager, Qubit Inc.",
      image: "/api/placeholder/100/100"
    },
    {
      quote: "The team at Agolas transformed our digital presence completely. Their strategic approach and attention to detail exceeded our expectations.",
      author: "SARAH JOHNSON",
      position: "Marketing Director, Nexus Group",
      image: "/api/placeholder/100/100"
    },
    {
      quote: "We saw an immediate impact on our conversion rates after implementing Agolas' design recommendations. Their expertise was invaluable.",
      author: "DAVID CHEN",
      position: "CEO, Elevate Solutions",
      image: "/api/placeholder/100/100"
    }
  ];
  
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const current = testimonials[currentTestimonial];
  
  return (
    <div className="snap-start transition-all text-black ease-in-out px-24  h-screen mx-auto  py-10 font-serif">
      <div className="mb-10">
        <h2 className="text-6xl pt-5 text-blue-700 text-center font-anek font-semibold tracking-tighter">
          Satisfied
          <span className='text-black'> Users</span>
          
        </h2>
      </div>
      
      <div className=" rounded-lg p-12 relative">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full  flex items-center border border-blue-700 justify-center">
            <span className="text-7xl font-medium font-anek text-blue-700 text-gray-800">*</span>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-3xl md:text-4xl    font-medium font-caladea tracking-tight mb-8">
            "{current.quote}"
          </p>
          
          <div className="flex justify-center mb-6">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            {/* <div className="mb-2">
              <img 
                src={current.image} 
                alt={current.author} 
                className="w-16 h-16 rounded-md object-cover"
              />
            </div> */}
            <h3 className="text-lg pt-4 font-medium ">{current.author}</h3>
            <p className="text-sm text-gray-700">{current.position}</p>
          </div>
        </div>
        
        <div className="bottom-12 mt-10 left-0 right-0 flex justify-center space-x-4">
          <button 
            onClick={prevTestimonial}
            className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-600 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextTestimonial}
            className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientTestimonial;