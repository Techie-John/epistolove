"use client";

import { useState } from 'react';
import { FiHeart, FiShare2, FiSmartphone, FiMail, FiPrinter, FiMessageCircle } from 'react-icons/fi';
import html2canvas from 'html2canvas';

export default function Home() {
  const [input, setInput] = useState(['', '', '', '', '']);
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientGender, setRecipientGender] = useState('them');
  const [senderName, setSenderName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleLikeChange = (index, value) => {
    const newInput = [...input];
    newInput[index] = value;
    setInput(newInput);
  };

  const generateLetter = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          input: input.join(', '),
          senderName: senderName 
        }),
      });
      const data = await response.json();
      setLetter(data.letter);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const shareWhatsApp = () => {
    const message = `${letter}\n\n---\n*Sent from techiejohn.com*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  const sendAsText = () => {
    const message = `${letter}\n\n---\nSent from techiejohn.com`;
    window.open(`sms:?body=${encodeURIComponent(message)}`);
  };

  const convertToImage = () => {
    const letterElement = document.querySelector('.letter-content');
    if (letterElement) {
      html2canvas(letterElement).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        setImageUrl(image);
      });
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = 'love-letter.png';
    link.href = imageUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3ec1d3] to-[#ff9a00] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            💖 AI Love Letter Generator
          </h1>
          <p className="text-lg text-white/80">
            Craft heartfelt messages that make your partner swoon
          </p>
        </header>

        {/* Main Card */}
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          {/* Input Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FiHeart className="text-accent" /> Share 5 things you love about {recipientGender === 'custom' ? recipientName : recipientGender}
            </h2>
            <div className="space-y-4">
              {input.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Love #${index + 1} (e.g. "their smile lights up my day")`}
                  value={item}
                  onChange={(e) => handleLikeChange(index, e.target.value)}
                  className="love-input"
                />
              ))}
            </div>
          </section>

          {/* Additional Information Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FiSmartphone /> Tell Me More
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Recipient's Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="love-input"
              />
              <input
                type="text"
                placeholder="Your Name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="love-input"
              />
            </div>
          </section>

          {/* Generate Button */}
          <button
            onClick={generateLetter}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Crafting Your Love Story...
              </span>
            ) : (
              'Create Magic Letter ✨'
            )}
          </button>

          {/* Result Section */}
          {letter && (
            <div className="mt-8 fade-in">
              <div className="bg-white/90 p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Your Custom Love Letter 💌
                </h2>
                <p className="letter-content text-gray-700 whitespace-pre-wrap">
                  {letter}
                </p>
                <div className="flex flex-col md:flex-row gap-3 mt-6">
                  <button
                    onClick={shareWhatsApp}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <FiShare2 /> Share via WhatsApp
                  </button>
                  <button
                    onClick={sendAsText}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <FiMessageCircle /> Send as Text
                  </button>
                  <button
                    onClick={convertToImage}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <FiPrinter /> Convert to Image
                  </button>
                  {imageUrl && (
                    <button
                      onClick={downloadImage}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      📥 Download Image
                    </button>
                  )}
                </div>
              </div>

              {/* Contact Section */}
              <div className="mt-8">
                <button
                  onClick={() => window.open('https://wa.me/2348101458024')}
                  className="btn-primary w-full"
                >
                  💬 Message Me on WhatsApp for other features
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-white/80">
          <p>© 2025 Epistolove · Crafted with ❤️</p>
        </footer>
      </div>

      {/* Sticky Button */}
      <div className="fixed bottom-4 right-4">
        <a
          href="https://techiejohn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
        >
          🛠️ Built by Techie John
        </a>
        <a
          href="https://www.buymeacoffee.com/techiejohn"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
        >
          ☕ Buy Me a Coffee
        </a>
      </div>
    </div>
  );
}
