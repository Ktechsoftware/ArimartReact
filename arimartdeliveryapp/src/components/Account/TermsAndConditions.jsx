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

const TermsAndConditions = () => {
  return (
    <div className="space-y-6 p-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Terms & Conditions</h1>
        <p className="text-slate-600 mb-4">Last updated: December 15, 2024</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h2>
          <p className="text-slate-700 leading-relaxed">
            By downloading, accessing, or using the Arimart Delivery Partner application, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">2. Delivery Partner Requirements</h2>
          <div className="space-y-3 text-slate-700">
            <p>To become an Arimart delivery partner, you must:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Be at least 18 years old</li>
              <li>Have a valid government-issued ID</li>
              <li>Own a vehicle (bicycle, motorcycle, or car) with valid registration</li>
              <li>Have a valid driving license (where applicable)</li>
              <li>Provide accurate and complete information during registration</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">3. Service Obligations</h2>
          <div className="space-y-3 text-slate-700">
            <p>As a delivery partner, you agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Accept and complete delivery orders in a timely manner</li>
              <li>Handle all items with care and maintain food safety standards</li>
              <li>Communicate professionally with customers and restaurant partners</li>
              <li>Follow all traffic rules and safety regulations</li>
              <li>Maintain your vehicle and equipment in good working condition</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Payment Terms</h2>
          <p className="text-slate-700 leading-relaxed">
            Delivery fees and incentives will be credited to your wallet within 24 hours of order completion. Arimart reserves the right to deduct applicable fees, taxes, and charges. Payment disputes must be raised within 7 days of the transaction date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Account Termination</h2>
          <p className="text-slate-700 leading-relaxed">
            Arimart may suspend or terminate your account for violations of these terms, fraudulent activities, or poor service quality. You may also terminate your account at any time by contacting customer support.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">6. Limitation of Liability</h2>
          <p className="text-slate-700 leading-relaxed">
            Arimart shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount of fees earned in the 30 days preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">7. Changes to Terms</h2>
          <p className="text-slate-700 leading-relaxed">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting in the app. Continued use of the service constitutes acceptance of the updated terms.
          </p>
        </section>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900 mb-1">Important Notice</p>
            <p className="text-blue-800 text-sm leading-relaxed">
              These terms constitute a legally binding agreement. Please read carefully and contact support if you have any questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
