import { useState } from "react";
import { Calendar, ChevronDown, CheckCircle } from "lucide-react";

export const LeaveApplicationPage = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-xl w-full max-w-xl p-6">
        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab("new")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "new"
                ? "border-b-2 border-pink-500 text-pink-600"
                : "text-gray-500"
            }`}
          >
            New Application
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "my"
                ? "border-b-2 border-pink-500 text-pink-600"
                : "text-gray-500"
            }`}
          >
            My Application
          </button>
        </div>

        {/* Form */}
        {activeTab === "new" && !submitted && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How many days?
              </label>
              <div className="relative">
                <select
                  name="days"
                  value={form.days}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8"
                  required
                >
                  <option value="">Select</option>
                  <option value="1">1 Day</option>
                  <option value="2">2 Days</option>
                  <option value="3">3 Days</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* From & To Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="date"
                  name="from"
                  value={form.from}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="date"
                  name="to"
                  value={form.to}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for leave
              </label>
              <div className="relative">
                <select
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm appearance-none pr-8"
                  required
                >
                  <option value="">Select</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Work</option>
                  <option value="vacation">Vacation</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
              <textarea
                name="comments"
                rows="3"
                maxLength="200"
                value={form.comments}
                onChange={handleChange}
                placeholder="Explain reason for leave in detail..."
                className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
              ></textarea>
              <div className="text-right text-xs text-gray-400">
                {form.comments.length}/200
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-2 rounded-lg font-medium hover:bg-pink-600"
            >
              Submit
            </button>
          </form>
        )}

        {/* Confirmation Screen */}
        {submitted && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-pink-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">
              Your application is submitted successfully
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Please wait and check your application status under My Application
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 border border-pink-400 text-pink-600 px-6 py-2 rounded-lg"
            >
              Okay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
