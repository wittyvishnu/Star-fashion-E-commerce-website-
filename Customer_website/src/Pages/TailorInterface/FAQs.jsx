import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Sidebar from './Sidebar';

const FAQs = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [openFAQ, setOpenFAQ] = React.useState(null);

  const faqs = [
    {
      question: "What types of alterations do you offer?",
      answer: "We offer a wide range of alterations including hemming, taking in or letting out garments, sleeve adjustments, and more. We can work on various types of clothing such as suits, dresses, pants, and shirts."
    },
    {
      question: "How long does a typical alteration take?",
      answer: "The time for alterations can vary depending on the complexity of the work and our current workload. Simple alterations like hemming can often be done in 1-2 days, while more complex work might take up to a week. We always strive to complete the work as quickly as possible without compromising on quality."
    },
    {
      question: "Do you offer rush services?",
      answer: "Yes, we do offer rush services for an additional fee. If you need your alterations completed urgently, please let us know when you bring in your garment and we'll do our best to accommodate your timeline."
    },
    {
      question: "What should I bring for my fitting appointment?",
      answer: "For your fitting appointment, please bring the garment you want altered along with the shoes and undergarments you plan to wear with it. This helps us ensure the most accurate fit."
    },
    {
      question: "Do you offer custom tailoring services?",
      answer: "Yes, we offer custom tailoring services for those looking for made-to-measure garments. This includes custom suits, shirts, and dresses. Please contact us for more information on our custom tailoring process and pricing."
    }
  ];

  const toggleFAQ = (index) => {
    if (openFAQ === index) {
      setOpenFAQ(null);
    } else {
      setOpenFAQ(index);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar/>
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="dashboard-card">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <button
                      className="flex justify-between items-center w-full text-left"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                      {openFAQ === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {openFAQ === index && (
                      <p className="mt-2 text-gray-600">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQs;