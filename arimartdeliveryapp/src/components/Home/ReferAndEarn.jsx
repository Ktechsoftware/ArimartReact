import { ClipboardCopy, Gift, ArrowRightCircle, UserPlus, Wallet } from "lucide-react";
import { useState } from "react";

export const ReferAndEarn = () => {
  const referralCode = "LOREM2331";
  const [copied, setCopied] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const faqs = [
    "What is EatFit?",
    "How to invite a user?",
    "How to withdraw money from wallet?",
    "How to know status of a query?",
    "How to apply a referral code?",
    "How to apply for a campaign?",
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-md mx-auto p-4 text-gray-800">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl text-white p-5 shadow-lg relative overflow-hidden">
        <div className="absolute right-4 bottom-4">
          <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Refer" className="w-20 h-20 opacity-30" />
        </div>
        <h2 className="text-lg font-bold">Refer & Earn</h2>
        <p className="text-sm mt-1">Upto ₹100</p>
        <p className="mt-2 text-sm">
          Invite your friends to use our Delivery Partner App & get <b>₹75</b> when they use your referral code and complete a delivery.
        </p>
        <button className="mt-4 px-4 py-2 bg-black rounded-lg font-medium shadow-md">Refer Now</button>
      </div>

      {/* Benefits */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <UserPlus className="w-5 h-5 text-pink-500" />
          Invite your friends
        </div>
        <div className="flex items-center gap-3 text-sm">
          <ArrowRightCircle className="w-5 h-5 text-orange-500" />
          They use your referral code
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Wallet className="w-5 h-5 text-green-500" />
          You get ₹75 in your wallet
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="mt-6 border border-dashed border-pink-300 rounded-xl p-4 bg-pink-50 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Your referral code</p>
          <p className="text-lg font-semibold text-pink-600">{referralCode}</p>
        </div>
        <button
          onClick={handleCopy}
          className="text-sm text-pink-600 border border-pink-400 px-3 py-1 rounded-lg hover:bg-pink-100"
        >
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>

      {/* FAQ */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold mb-3 text-gray-600">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => setFaqOpen(faqOpen === index ? null : index)}
              className="border px-4 py-2 rounded-lg bg-white shadow-sm cursor-pointer"
            >
              <div className="flex justify-between items-center text-sm font-medium">
                <span>{faq}</span>
                <span>{faqOpen === index ? "-" : "+"}</span>
              </div>
              {faqOpen === index && (
                <p className="text-xs text-gray-500 mt-1">This is a placeholder answer for: {faq}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
