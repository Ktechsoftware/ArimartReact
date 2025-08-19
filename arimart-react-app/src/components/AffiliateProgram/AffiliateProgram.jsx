// AffiliateProgram.jsx - Main Component
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Share2, 
  Copy, 
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  Wallet,
  UserPlus,
  BarChart3,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Demo Data
const demoAffiliateData = {
  notAffiliate: null,
  pending: {
    status: 'Pending',
    applicationDate: '2024-01-15',
    message: 'Your application is under review. We\'ll notify you within 2-3 business days.'
  },
  approved: {
    status: 'Approved',
    referralCode: 'JOHN123',
    referralLink: 'https://arimart.app/download?ref=JOHN123',
    totalEarnings: 2450.00,
    pendingEarnings: 180.00,
    totalReferrals: 23,
    pendingReferrals: 3,
    approvalDate: '2024-01-18',
    applicationDate: '2024-01-15',
    monthlyStats: [
      { month: 'Jan', earnings: 450 },
      { month: 'Feb', earnings: 680 },
      { month: 'Mar', earnings: 920 },
      { month: 'Apr', earnings: 400 }
    ],
    recentReferrals: [
      { id: 1, userName: 'Priya Sharma', installDate: '2024-04-15', status: 'Confirmed', commission: 50 },
      { id: 2, userName: 'Rahul Gupta', installDate: '2024-04-14', status: 'Pending', commission: 50 },
      { id: 3, userName: 'Anita Singh', installDate: '2024-04-12', status: 'Confirmed', commission: 50 },
      { id: 4, userName: 'Vikash Kumar', installDate: '2024-04-10', status: 'Paid', commission: 50 }
    ]
  }
};

const AffiliateProgram = () => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState('notAffiliate'); // 'notAffiliate', 'pending', 'approved'
  const [affiliateData, setAffiliateData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const status = 'approved'; // Change to 'notAffiliate', 'pending', or 'approved' for testing
    setCurrentStatus(status);
    setAffiliateData(demoAffiliateData[status]);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (currentStatus === 'notAffiliate') {
    return <AffiliateApplicationForm onSubmit={(data) => {
      console.log('Application submitted:', data);
      setCurrentStatus('pending');
      setAffiliateData(demoAffiliateData.pending);
    }} />;
  }

  if (currentStatus === 'pending') {
    return <AffiliatePendingScreen data={affiliateData} />;
  }

  return <AffiliateDashboard data={affiliateData} copyToClipboard={copyToClipboard} copied={copied} />;
};

// Application Form Component
const AffiliateApplicationForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    socialMediaHandles: '',
    audienceDescription: '',
    whyJoin: '',
    bankAccountNumber: '',
    bankName: '',
    accountHolderName: '',
    acceptTerms: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Join Affiliate Program</h1>
          <p className="text-gray-600 dark:text-gray-400">Start earning real money by referring friends!</p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white mb-8">
        <h2 className="text-xl font-bold mb-4">💰 Why Join Our Affiliate Program?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <DollarSign size={24} className="bg-white/20 rounded-full p-1" />
            <div>
              <div className="font-semibold">₹50 per Install</div>
              <div className="text-sm opacity-90">Earn for every referral</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp size={24} className="bg-white/20 rounded-full p-1" />
            <div>
              <div className="font-semibold">No Limits</div>
              <div className="text-sm opacity-90">Unlimited earning potential</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wallet size={24} className="bg-white/20 rounded-full p-1" />
            <div>
              <div className="font-semibold">Weekly Payouts</div>
              <div className="text-sm opacity-90">Direct bank transfer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <h3 className="text-lg font-bold">Application Form</h3>
          <p className="text-sm opacity-90">Tell us about yourself and your audience</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Social Media Handles
              </label>
              <textarea
                name="socialMediaHandles"
                value={formData.socialMediaHandles}
                onChange={handleChange}
                placeholder="Instagram: @yourhandle, YouTube: @yourchannel..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Describe Your Audience
              </label>
              <textarea
                name="audienceDescription"
                value={formData.audienceDescription}
                onChange={handleChange}
                placeholder="Age group, interests, location, size of following..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Why do you want to join our affiliate program?
            </label>
            <textarea
              name="whyJoin"
              value={formData.whyJoin}
              onChange={handleChange}
              placeholder="Tell us about your motivation and how you plan to promote Arimart..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              required
            />
          </div>

          {/* Bank Details */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bank Details</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  placeholder="Full name as per bank account"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="e.g., State Bank of India"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  placeholder="Your bank account number"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms and Conditions</span> and 
              <span className="text-blue-600 hover:underline cursor-pointer"> Affiliate Program Policy</span>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
          >
            Submit Application
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Pending Screen Component
const AffiliatePendingScreen = ({ data }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4 min-h-screen flex items-center justify-center"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-6"
        >
          <Clock size={64} className="text-orange-500" />
        </motion.div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Application Under Review
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {data.message}
        </p>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-6">
          <div className="text-sm text-orange-800 dark:text-orange-200">
            <strong>Applied on:</strong> {new Date(data.applicationDate).toLocaleDateString()}
          </div>
        </div>
        
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Account
        </button>
      </div>
    </motion.div>
  );
};

// Dashboard Component
const AffiliateDashboard = ({ data, copyToClipboard, copied }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your earnings and referrals</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={20} className="text-green-500" />
          <span className="text-sm font-medium text-green-600">Approved</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white"
        >
          <DollarSign size={24} className="mb-2" />
          <div className="text-2xl font-bold">₹{data.totalEarnings}</div>
          <div className="text-sm opacity-90">Total Earnings</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-4 text-white"
        >
          <Wallet size={24} className="mb-2" />
          <div className="text-2xl font-bold">₹{data.pendingEarnings}</div>
          <div className="text-sm opacity-90">Pending</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 text-white"
        >
          <Users size={24} className="mb-2" />
          <div className="text-2xl font-bold">{data.totalReferrals}</div>
          <div className="text-sm opacity-90">Total Referrals</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-4 text-white"
        >
          <TrendingUp size={24} className="mb-2" />
          <div className="text-2xl font-bold">{data.pendingReferrals}</div>
          <div className="text-sm opacity-90">This Month</div>
        </motion.div>
      </div>

      {/* Referral Link Section */}
     <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-6"
>
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Your Referral Link</h3>
  
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
    <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 font-mono text-sm sm:text-base text-gray-800 dark:text-gray-200 truncate">
      {data.referralLink || "https://example.com/ref/yourcode123"}
    </div>
    
    <div className="flex gap-2 sm:gap-3">
      <button
        onClick={() => copyToClipboard(data.referralLink)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
      >
        <Copy size={16} className="shrink-0" />
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>
      
      <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
        <Share2 size={16} className="shrink-0" />
        <span>Share</span>
      </button>
    </div>
  </div>
  
  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 sm:mt-4 flex flex-wrap items-center gap-2">
    Your referral code: 
    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
      {data.referralCode || "YOURCODE123"}
    </span>
  </p>
</motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Monthly Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Monthly Earnings</h3>
          <div className="space-y-4">
            {data.monthlyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{stat.month} 2024</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                      style={{ width: `${(stat.earnings / 1000) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white w-16 text-right">
                    ₹{stat.earnings}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Referrals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Referrals</h3>
          <div className="space-y-4">
            {data.recentReferrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{referral.userName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(referral.installDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">₹{referral.commission}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    referral.status === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    referral.status === 'Pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {referral.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-4 text-left">
            <Share2 size={24} className="mb-2" />
            <div className="font-semibold">Share on Social Media</div>
            <div className="text-sm opacity-90">Boost your referrals</div>
          </button>
          <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-4 text-left">
            <BarChart3 size={24} className="mb-2" />
            <div className="font-semibold">View Analytics</div>
            <div className="text-sm opacity-90">Detailed performance</div>
          </button>
          <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-4 text-left">
            <Wallet size={24} className="mb-2" />
            <div className="font-semibold">Request Payout</div>
            <div className="text-sm opacity-90">Withdraw earnings</div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AffiliateProgram;