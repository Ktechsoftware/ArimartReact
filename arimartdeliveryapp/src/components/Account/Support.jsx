
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

export const Support = () => {
  const [currentPage, setCurrentPage] = useState("support");
  const [searchQuery, setSearchQuery] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      status: "Online",
      statusColor: "bg-green-100 text-green-700",
      action: "Start Chat"
    },
    {
      icon: Phone,
      title: "Call Support",
      description: "Speak directly with our experts",
      status: "Available 24/7",
      statusColor: "bg-blue-100 text-blue-700",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your detailed query",
      status: "2-4 hours response",
      statusColor: "bg-orange-100 text-orange-700",
      action: "Send Email"
    }
  ];
  return (
    <div className="space-y-6 p-3">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">How can we help?</h1>
        <p className="text-slate-600">Get support from our dedicated team</p>
      </div>

      {/* Support Options */}
      <div className="space-y-3">
        {supportOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{option.title}</h3>
                  <p className="text-sm text-slate-600 mb-2">{option.description}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${option.statusColor}`}>
                    {option.status}
                  </span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  {option.action}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setCurrentPage("faq")}
            className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left"
          >
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-slate-900 text-sm">View FAQ</p>
              <p className="text-xs text-slate-600">Common questions</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left">
            <Clock className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-slate-900 text-sm">Track Ticket</p>
              <p className="text-xs text-slate-600">Support status</p>
            </div>
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-slate-100 rounded-2xl p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-slate-600" />
            <span className="text-slate-900">+91 1800-123-4567</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-slate-600" />
            <span className="text-slate-900">support@arimart.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-slate-600" />
            <span className="text-slate-900">Available 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};
