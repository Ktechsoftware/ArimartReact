const TermsAndConditions = () => {
  const termData = {
    title: "Terms and Conditions",
    lastUpdated: "June 25, 2025",
    content: `
      <h2 class="text-xl font-semibold mb-3">1. Introduction</h2>
      <p class="mb-4">Welcome to our e-commerce platform. By using our website, you agree to these terms.</p>
      
      <h2 class="text-xl font-semibold mb-3">2. Account</h2>
      <ul class="list-disc pl-5 mb-4">
        <li>You must be 18+ to use our service</li>
        <li>Keep your password secure</li>
        <li>You're responsible for all account activity</li>
      </ul>
      
      <h2 class="text-xl font-semibold mb-3">3. Orders</h2>
      <ul class="list-disc pl-5 mb-4">
        <li>Prices are in USD</li>
        <li>We accept credit cards and PayPal</li>
        <li>We may cancel orders at our discretion</li>
      </ul>
      
      <h2 class="text-xl font-semibold mb-3">4. Returns</h2>
      <p class="mb-4">30-day return policy for unused items in original condition.</p>

     <div class="space-y-6">
        <p class="mb-6 font-medium">
          By clicking "Join Now" and participating in a group deal, you agree to the following terms and conditions:
        </p>

        <div class="space-y-1">
          <h3 class="text-lg font-semibold flex items-center gap-2">✅ 1. Compulsory Purchase</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>Once you join a group deal, you are obligated to purchase the product</li>
            <li>Your confirmation is considered a binding intent to buy</li>
          </ul>
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-semibold flex items-center gap-2">⏰ 2. Auto-Order After Deal Ends</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>When the deal countdown ends and the required number of people have joined:</li>
            <li>Your order will be automatically placed</li>
            <li>The product will be shipped to your registered address</li>
          </ul>
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-semibold flex items-center gap-2">💰 3. Payment Method - Cash on Delivery</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>By default, your order will be placed using Cash on Delivery (COD)</li>
            <li>If you wish to change the payment method, you must do so before shipment by visiting: <br>
            <span class="font-medium">My Orders > Payment Options</span></li>
          </ul>
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-semibold flex items-center gap-2">📦 4. Delivery</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>Products will be dispatched once the deal is successful</li>
            <li>Delivery timelines may vary depending on your location and availability</li>
          </ul>
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-semibold flex items-center gap-2">❌ 5. No Cancellations After Joining</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>Cancellations are not allowed once you've joined a deal</li>
            <li>Make sure you intend to purchase before joining</li>
          </ul>
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-semibold flex items-center gap-2">⚠️ 6. Failed Deals</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>If a deal does not reach the required number of members, it will expire</li>
            <li>You will not be charged, and no order will be placed</li>
          </ul>
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-semibold flex items-center gap-2">🔒 7. Fraud or Misuse</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li>Misuse or attempts to join and not complete payment repeatedly may result in account suspension or legal action</li>
          </ul>
        </div>

        <div class="space-y-1">
          <h3 class="text-lg font-semibold flex items-center gap-2">📃 8. Accepting Terms</h3>
          <p class="font-medium">
            By clicking "Join Now", you acknowledge that you have read and agreed to these terms
          </p>
        </div>
      </div>

    `
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{termData.title}</h1>
      <p className="text-gray-500 mb-6">Last updated: {termData.lastUpdated}</p>
      
      <div 
        className="prose prose-sm sm:prose max-w-none"
        dangerouslySetInnerHTML={{ __html: termData.content }}
      />
    </div>
  );
};

export default TermsAndConditions;