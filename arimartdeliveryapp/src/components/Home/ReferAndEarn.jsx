import { useState } from "react";
import { 
  Copy, 
  Gift, 
  Users, 
  Wallet, 
  Share2, 
  Check,
  ChevronDown,
  Star,
  Trophy,
  Target
} from "lucide-react";

export const ReferAndEarn = () => {
  const referralCode = "ARIMART2331";
  const [copied, setCopied] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  
  const stats = {
    totalReferred: 12,
    totalEarned: 900,
    pendingRewards: 150
  };

  const steps = [
    {
      icon: Share2,
      title: "Share Your Code",
      description: "Send your unique referral code to friends",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Users,
      title: "Friend Joins",
      description: "They sign up using your referral code",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Target,
      title: "Complete Deliveries",
      description: "They complete their first 5 deliveries",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Wallet,
      title: "Earn Rewards",
      description: "Get ₹100 instantly in your wallet",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  const faqs = [
    {
      question: "What is Arimart Delivery Partner Program?",
      answer: "Arimart is a delivery platform that connects delivery partners with customers. Earn money by delivering orders in your city."
    },
    {
      question: "How do I invite new delivery partners?",
      answer: "Share your unique referral code with friends. When they sign up and complete 5 deliveries, you both earn rewards."
    },
    {
      question: "When will I receive my referral bonus?",
      answer: "Your referral bonus is credited within 24 hours after your friend completes their 5th successful delivery."
    },
    {
      question: "Is there a limit to referrals?",
      answer: "No limit! You can refer as many friends as you want and earn ₹100 for each successful referral."
    },
    {
      question: "How do I track my referral earnings?",
      answer: "Check the 'My Referrals' section in your wallet to see pending and completed referral rewards."
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Arimart as a Delivery Partner',
        text: `Use my referral code ${referralCode} and earn ₹50 bonus! Join Arimart and start earning today.`,
        url: `https://arimart.app/refer/${referralCode}`
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold text-slate-900">Refer & Earn</h1>
          <p className="text-sm text-slate-600">Invite friends and earn together</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/10"></div>
            <div className="absolute top-1/2 right-8 w-20 h-20 rounded-full bg-white/15"></div>
          </div>
          
          <div className="relative z-10 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">Earn ₹100</h2>
                  <p className="text-white/80 text-sm">Per successful referral</p>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-300" />
              </div>
            </div>

            <p className="text-white/90 text-sm leading-relaxed mb-6">
              Invite your friends to join Arimart as delivery partners. 
              When they complete their first 5 deliveries, you both earn rewards!
            </p>

            <div className="flex gap-3">
              <button 
                onClick={handleShare}
                className="flex-1 bg-white text-blue-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share Now
              </button>
              <button className="px-4 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors backdrop-blur">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-slate-900">{stats.totalReferred}</p>
            <p className="text-xs text-slate-600">Referred</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-lg font-bold text-slate-900">₹{stats.totalEarned}</p>
            <p className="text-xs text-slate-600">Earned</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
            <div className="w-8 h-8 bg-orange-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Star className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-lg font-bold text-slate-900">₹{stats.pendingRewards}</p>
            <p className="text-xs text-slate-600">Pending</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">How It Works</h3>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm">{step.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{step.description}</p>
                  </div>
                  <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-slate-600">{index + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Referral Code */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Your Referral Code</h3>
          <div className="bg-slate-50 rounded-xl p-4 border-2 border-dashed border-slate-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1">
                  Referral Code
                </p>
                <p className="text-2xl font-bold text-slate-900 font-mono tracking-wider">
                  {referralCode}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  copied 
                    ? "bg-green-100 text-green-700 border-2 border-green-200" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 text-center">
            Share this code with friends who want to become delivery partners
          </p>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium text-slate-900 text-sm pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-500 transition-transform ${
                      faqOpen === index ? "rotate-180" : ""
                    }`} 
                  />
                </button>
                {faqOpen === index && (
                  <div className="px-4 pb-4 border-t border-slate-100">
                    <p className="text-sm text-slate-600 leading-relaxed pt-3">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="bg-slate-100 rounded-2xl p-4">
          <h4 className="font-medium text-slate-900 text-sm mb-2">Terms & Conditions</h4>
          <ul className="space-y-1 text-xs text-slate-600">
            <li>• Referral bonus is credited after friend completes 5 successful deliveries</li>
            <li>• Both referrer and referee must be active delivery partners</li>
            <li>• Bonus amount may vary based on current promotions</li>
            <li>• Arimart reserves the right to modify terms at any time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}