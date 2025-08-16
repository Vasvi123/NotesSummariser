import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!transcript.trim()) {
      toast.error('Please enter a transcript');
      return;
    }
    
    if (!customPrompt.trim()) {
      toast.error('Please enter a custom prompt');
      return;
    }

    setIsLoading(true);
    
    
    try {
      const response = await fetch('https://notessummariser.onrender.com/api/summary/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcript.trim(),
          customPrompt: customPrompt.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store the summary data in localStorage for the summary page
        localStorage.setItem('summaryData', JSON.stringify({
          summary: data.summary,
          originalTranscript: data.originalTranscript,
          customPrompt: data.customPrompt,
          timestamp: new Date().toISOString(),
        }));
        
        toast.success('Summary generated successfully!');
        navigate('/summary');
      } else {
        toast.error(data.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTranscript(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const promptExamples = [
    "Summarize in bullet points for executives",
    "Highlight only action items and deadlines",
    "Create a technical summary for developers",
    "Summarize key decisions and next steps",
    "Focus on risks and mitigation strategies"
  ];

  return (
    <div className="container">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          AI-Powered Meeting Notes Summarizer
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your meeting transcripts into clear, actionable summaries using advanced AI. 
          Customize the output format and share with your team instantly.
        </p>
      </div>

      <div className="form-container">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="text-blue-600" />
          Generate Summary
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="transcript" className="form-label">
              Meeting Transcript or Notes
            </label>
            <textarea
              id="transcript"
              className="form-textarea"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript, call notes, or any text content here..."
              required
            />
            <div className="mt-2">
              <label htmlFor="file-upload" className="btn btn-secondary">
                <Upload size={16} />
                Upload Text File
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".txt,.md,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="customPrompt" className="form-label">
              Custom Instructions
            </label>
            <textarea
              id="customPrompt"
              className="form-textarea"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., 'Summarize in bullet points for executives' or 'Highlight only action items'"
              required
            />
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Quick examples:</p>
              <div className="flex flex-wrap gap-2">
                {promptExamples.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    onClick={() => setCustomPrompt(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Generating Summary...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Summary
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
};

export default Home;
