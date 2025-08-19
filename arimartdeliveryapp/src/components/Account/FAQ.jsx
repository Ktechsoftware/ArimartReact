import { useState } from "react";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  ChevronDown, 
  Search,
  ArrowLeft,
  Shield,
  FileText,
  HelpCircle,
  Headphones,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from "lucide-react";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const faqCategories = [
    { id: "all", name: "All Topics" },
    { id: "account", name: "Account" },
    { id: "delivery", name: "Delivery" },
    { id: "payments", name: "Payments" },
    { id: "app", name: "App Issues" }
  ];

  const faqs = [
    {
      category: "account",
      question: "How do I update my profile information?",
      answer: "Go to Profile > Edit Profile to update your personal information, contact details, and documents. Make sure to submit required documents for verification."
    },
    {
      category: "account", 
      question: "How do I reset my password?",
      answer: "Tap 'Forgot Password' on the login screen, enter your registered mobile number, and follow the OTP verification process to set a new password."
    },
    {
      category: "delivery",
      question: "How do I accept delivery orders?",
      answer: "When you're online, you'll receive order notifications. Tap 'Accept' to confirm the delivery. Make sure you're in an active delivery zone to receive orders."
    },
    {
      category: "delivery",
      question: "What if I can't find the customer's location?",
      answer: "Use the in-app navigation or call the customer directly. If still unable to locate, use the 'Unable to Deliver' option and contact support for assistance."
    },
    {
      category: "payments",
      question: "When will I receive my delivery payments?",
      answer: "Delivery payments are processed daily and credited to your wallet within 24 hours of order completion. You can withdraw anytime to your bank account."
    },
    {
      category: "payments",
      question: "How do I withdraw money from my wallet?",
      answer: "Go to Wallet > Withdraw, enter the amount, select your bank account or UPI, and confirm the transaction. Withdrawals are processed instantly or within 1-2 business days."
    },
    {
      category: "app",
      question: "The app is not working properly, what should I do?",
      answer: "Try force-closing and reopening the app. If issues persist, check your internet connection, update the app, or restart your device. Contact support if problems continue."
    },
    {
      category: "app",
      question: "How do I update the Arimart app?",
      answer: "Visit Google Play Store or Apple App Store, search for 'Arimart Partner', and tap 'Update'. Enable auto-updates to always have the latest version."
    }
  ];

  const filteredFaqs = selectedCategory === "all" 
    ? faqs.filter(faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqs.filter(faq => faq.category === selectedCategory && faq.question.toLowerCase().includes(searchQuery.toLowerCase()));


  return (
     <div className="space-y-6 p-3">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Frequently Asked Questions</h1>
        <p className="text-slate-600">Find answers to common questions</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search FAQ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {faqCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-2">
        {filteredFaqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setFaqOpen(faqOpen === index ? null : index)}
              className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-900 pr-4">{faq.question}</span>
              <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${faqOpen === index ? "rotate-180" : ""}`} />
            </button>
            {faqOpen === index && (
              <div className="px-6 pb-6 border-t border-slate-100">
                <p className="text-slate-600 leading-relaxed pt-4">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No FAQ found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default FAQ;
