import React from "react";

function AnalysisOutput({ analysisOutput }) {
  // Function to format the analysis output
  const formatOutput = (text) => {
    // Split the text into lines
    const lines = text.split("\n");
    return lines.map((line, index) => {
      // Check for bold text
      const boldText = line.match(/\*\*(.*?)\*\*/);
      if (boldText) {
        const formattedLine = line.replace(
          /\*\*(.*?)\*\*/,
          "<strong>$1</strong>"
        );
        return (
          <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      }

      // Check for bullet points or arrows
      if (line.startsWith("*")) {
        return (
          <p key={index} className="flex items-start">
            <span className="mr-2">•</span>
            {line.replace("*", "").trim()}
          </p>
        );
      }

      // Return normal text
      return <p key={index}>{line}</p>;
    });
  };

  return <div className="analysis-output">{formatOutput(analysisOutput)}</div>;
}

export default AnalysisOutput;
