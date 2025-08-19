import { useState } from "react";
import { Calendar, ChevronDown, CheckCircle, Clock, User, MessageCircle } from "lucide-react";

export const LeaveApplicationPage =() => {
  const [form, setForm] = useState({
    days: "",
    from: "",
    to: "",
    reason: "",
    comments: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("new");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (form.days && form.from && form.to && form.reason) {
      setSubmitted(true);
    }
  };

  const mockApplications = [
    {
      id: 1,
      dates: "Dec 15-16, 2024",
      reason: "Personal Work",
      status: "Approved",
      statusColor: "bg-green-100 text-green-800"
    },
    {
      id: 2,
      dates: "Nov 22, 2024",
      reason: "Sick Leave",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-800"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white sticky top-16 shadow-sm border-b">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold text-slate-900">Leave Application</h1>
          <p className="text-sm text-slate-600 mt-1">Manage your time off requests</p>
        </div>
      </div>

      <div className="p-4 pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-md mx-auto">
          {/* Tabs */}
          <div className="flex bg-slate-50">
            <button
              onClick={() => setActiveTab("new")}
              className={`flex-1 py-4 px-4 text-sm font-medium transition-all ${
                activeTab === "new"
                  ? "bg-white text-blue-600 shadow-sm border-b-2 border-blue-500"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                New Request
              </div>
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={`flex-1 py-4 px-4 text-sm font-medium transition-all ${
                activeTab === "my"
                  ? "bg-white text-blue-600 shadow-sm border-b-2 border-blue-500"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                My Requests
              </div>
            </button>
          </div>

          {/* New Application Form */}
          {activeTab === "new" && !submitted && (
            <div className="p-6">
              <div className="space-y-5">
                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Duration
                  </label>
                  <div className="relative">
                    <select
                      name="days"
                      value={form.days}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                      required
                    >
                      <option value="">How many days?</option>
                      <option value="0.5">Half Day</option>
                      <option value="1">1 Day</option>
                      <option value="2">2 Days</option>
                      <option value="3">3 Days</option>
                      <option value="4">4 Days</option>
                      <option value="5">5 Days</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">From</label>
                    <input
                      type="date"
                      name="from"
                      value={form.from}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
                    <input
                      type="date"
                      name="to"
                      value={form.to}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reason
                  </label>
                  <div className="relative">
                    <select
                      name="reason"
                      value={form.reason}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                      required
                    >
                      <option value="">Select reason</option>
                      <option value="sick">Sick Leave</option>
                      <option value="personal">Personal Work</option>
                      <option value="vacation">Vacation</option>
                      <option value="family">Family Emergency</option>
                      <option value="medical">Medical Appointment</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    name="comments"
                    rows="3"
                    maxLength="200"
                    value={form.comments}
                    onChange={handleChange}
                    placeholder="Brief description of your request..."
                    className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-500">Optional</span>
                    <span className="text-xs text-slate-400">
                      {form.comments.length}/200
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition-colors shadow-sm"
                >
                  Submit Request
                </button>
              </div>
            </div>
          )}

          {/* My Applications Tab */}
          {activeTab === "my" && (
            <div className="p-6">
              <div className="space-y-3">
                {mockApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{app.dates}</p>
                        <p className="text-xs text-slate-600 mt-1">{app.reason}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${app.statusColor}`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
                
                {mockApplications.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No applications yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Your leave requests will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Screen */}
          {submitted && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Request Submitted!
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Your leave application has been sent to your manager. 
                You'll receive a notification once it's reviewed.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab("my")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  View My Requests
                </button>
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-medium transition-colors"
                >
                  Submit Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}