import React from 'react';

const AVAILABLE_TONES = [
  { id: 'branding', label: 'Branding' },
  { id: 'personal', label: 'Personal Brand' },
  { id: 'business', label: 'Business' },
  { id: 'professional', label: 'Professional' },
  { id: 'funny', label: 'Funny' },
  { id: 'buildInPublic', label: 'Build in Public' },
  { id: 'rhetoric', label: 'Rhetoric' },
  { id: 'curious', label: 'Curious' },
  { id: 'question', label: 'Question' }
];

function ToneSelector({ selectedTones, onToneChange }) {
  const handleToneClick = (toneId) => {
    if (selectedTones.includes(toneId)) {
      onToneChange(selectedTones.filter(id => id !== toneId));
    } else if (selectedTones.length < 3) {
      onToneChange([...selectedTones, toneId]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Select Writing Tone
        </h3>
        <div className="flex items-center">
          <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-black dark:bg-white transition-all duration-300"
              style={{ width: `${(selectedTones.length / 3) * 100}%` }}
            />
          </div>
          <span className="ml-2 text-sm text-gray-500">
            {selectedTones.length}/3
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_TONES.map(tone => (
          <button
            key={tone.id}
            onClick={() => handleToneClick(tone.id)}
            disabled={!selectedTones.includes(tone.id) && selectedTones.length >= 3}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors
              ${selectedTones.includes(tone.id)
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : selectedTones.length >= 3
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                  : 'border border-gray-400 text-gray-700 hover:bg-gray-100 dark:border-gray-100 dark:text-gray-200 dark:hover:bg-black/90'
              }`}
          >
            {tone.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ToneSelector; 