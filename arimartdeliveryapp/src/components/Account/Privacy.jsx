import { useState } from "react";
import { 
  Shield,
} from "lucide-react";

export const Privacy = () => {
  return (
    <div className="space-y-6 p-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Privacy Policy</h1>
        <p className="text-slate-600 mb-4">Last updated: December 15, 2024</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Information We Collect</h2>
          <div className="space-y-3 text-slate-700">
            <p>We collect the following types of information:</p>
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-medium text-slate-900 mb-2">Personal Information:</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Name, phone number, email address</li>
                <li>Government ID and driving license</li>
                <li>Bank account and payment information</li>
                <li>Vehicle registration details</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-medium text-slate-900 mb-2">Usage Information:</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Location data during delivery</li>
                <li>App usage patterns and preferences</li>
                <li>Device information and IP address</li>
                <li>Delivery performance metrics</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">How We Use Your Information</h2>
          <div className="space-y-3 text-slate-700">
            <p>Your information is used for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Processing delivery orders and payments</li>
              <li>Verifying your identity and eligibility</li>
              <li>Providing customer support</li>
              <li>Improving our services and app functionality</li>
              <li>Ensuring safety and security</li>
              <li>Complying with legal requirements</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Information Sharing</h2>
          <p className="text-slate-700 leading-relaxed mb-3">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-700">
            <li>Restaurant partners for order fulfillment</li>
            <li>Customers for delivery coordination</li>
            <li>Payment processors for transaction processing</li>
            <li>Law enforcement when legally required</li>
            <li>Service providers who assist our operations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Data Security</h2>
          <p className="text-slate-700 leading-relaxed">
            We implement industry-standard security measures to protect your personal information. This includes encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Your Rights</h2>
          <div className="space-y-3 text-slate-700">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your personal information</li>
              <li>Update or correct your data</li>
              <li>Request deletion of your account</li>
              <li>Opt-out of marketing communications</li>
              <li>Lodge complaints with data protection authorities</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Contact Us</h2>
          <p className="text-slate-700 leading-relaxed">
            For privacy-related questions or requests, contact our Data Protection Officer at:
            <br />
            Email: privacy@arimart.com
            <br />
            Phone: +91 1800-123-4567
          </p>
        </section>
      </div>

      <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-green-900 mb-1">Your Privacy Matters</p>
            <p className="text-green-800 text-sm leading-relaxed">
              We are committed to protecting your privacy and handling your data responsibly. Your trust is important to us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
