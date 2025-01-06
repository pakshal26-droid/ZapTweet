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
  }
}; 