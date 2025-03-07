import React from 'react';
import { FaStar } from 'react-icons/fa';

const TestimonialCard = ({ testimonial, name, rating,company }) => {
  return (
    <div className='p-5 md:p-8 bg-white border rounded-xl shadow-md w-[300px] md:w-[400px] h-[250px] md:h-[300px] flex flex-col justify-between'>
      <div>
        <p className='text-gray-600 italic text-lg md:text-md font-medium mb-4'>"{testimonial}"</p>
      </div>
      <div>
        <p className='font-semibold text-sm md:text-md'>- {name}</p>
        <div className='flex items-center gap-1 md:gap-2 mb-2'>
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              size={16}
              className={index < Math.floor(rating) ? 'text-blue-600' : 'text-gray-300'}
            />
          ))}
          <span className='text-gray-600 ml-2 text-sm'>{rating}</span>
        </div>
        <p className='font-semibold text-sm md:text-md'>{company}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;