/*import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const pdfService = {
  async uploadPdf(file) {
    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch(process.env.REACT_APP_WEBHOOK, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }

      const data = await response.json();
      return data[0].output || [];
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  },

  async extractTextFromPdf(file) {
    try {
      const fileReader = new FileReader();
      
      return new Promise((resolve, reject) => {
        fileReader.onload = async (event) => {
          try {
            const typedArray = new Uint8Array(event.target.result);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            let fullText = '';

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map(item => item.str).join(' ');
              fullText += pageText + '\n';
            }
            resolve(fullText);
            console.log(fullText)
          } catch (error) {
            reject(error);
          }
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
        fileReader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  }
}; */
import { getDocument } from 'pdfjs-dist/webpack';
import { GoogleGenerativeAI } from '@google/generative-ai';
// Configure the worker
const pdfjsVersion = '4.0.189';  // Specify the version explicitly
const pdfjsWorker = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;
if (typeof window !== 'undefined' && 'pdfjsWorker' in window === false) {
  window.pdfjsWorker = pdfjsWorker;
}

export const pdfService = {
  async extractTextFromPdf(file) {
    try {
      const fileReader = new FileReader();
      
      return new Promise((resolve, reject) => {
        fileReader.onload = async (event) => {
          try {
            const typedArray = new Uint8Array(event.target.result);
            const pdf = await getDocument({
              data: typedArray,
              cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.189/cmaps/',
              cMapPacked: true,
            }).promise;
            
            let fullText = '';
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map(item => item.str).join(' ');
              fullText += pageText + '\n';
            }

            // Generate tweets from the extracted text
            const tweets = await this.generateTweetsFromText(fullText);
            resolve(tweets);
          } catch (error) {
            console.error('Error processing PDF:', error);
            reject(error);
          }
        };
        fileReader.onerror = (error) => {
          reject(error);
        };
        fileReader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  },

  async generateTweetsFromText(text) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `Create 3 engaging tweets from the following text. Each tweet should be unique and highlight different aspects of the content.

      Guidelines for each tweet:
      1. Structure each tweet with:
         - An attention-grabbing hook
         - A clear, informative body
         - A compelling call-to-action (CTA)
      2. Keep each tweet under 280 characters
      3. Make them engaging and shareable
      4. Don't use hashtags
      5. Ensure each tweet can stand alone
      6. Use natural, conversational language

      Format the output as an array of 3 objects, each with these properties:
      - hook: The attention-grabbing opening line
      - body: The main content of the tweet
      - cta: The call-to-action

      Text to process:
      ${text}

      Return only the JSON array without any additional explanation or text.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      console.log(response)
      try {
        const cleanedResponse = this.cleanJsonResponse(response);
        const tweets = JSON.parse(cleanedResponse);
        
        return Array.isArray(tweets) ? tweets : [];
      } catch (error) {
        console.error('Error parsing tweets:', error);
        return [];
      }
    } catch (error) {
      console.error('Error generating tweets:', error);
      return [];
    }
  },
  cleanJsonResponse(response) {
    // Remove markdown code block formatting
    let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Remove any leading/trailing whitespace
    cleaned = cleaned.trim();
    
    // If the response starts with a newline and [, remove the newline
    cleaned = cleaned.replace(/^\n*(\[)/, '$1');
    
    // If the response ends with ] and newlines, remove the newlines
    cleaned = cleaned.replace(/\][\n\s]*$/, ']');
    
    return cleaned;
  },

  async uploadPdf(file) {
    return this.extractTextFromPdf(file);
  }
};