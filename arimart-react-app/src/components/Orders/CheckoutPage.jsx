import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Minus, Plus, MapPin, Wallet2,
  StickyNote, CreditCard, Smartphone, ChevronDown
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import OrderConfirmedModal from './OrderConfirmedModal';
import { useCart } from '../../context/CartContext';
import { checkoutCart } from '../../Store/orderSlice';
import { clearCart } from '../../Store/cartSlice';
import { fetchWalletBalance } from '../../Store/walletSlice';

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'upi', name: 'UPI Payment', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'cod', name: 'Cash on Delivery', icon: <Wallet2 className="w-5 h-5" /> }
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.userData);
  const userId = userData?.id;

  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[2]);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [latestTrackId, setLatestTrackId] = useState(null);

  const { items, subtotal, totalItems } = useCart();

  useEffect(() => {
    if (userData?.userId) {
      dispatch(fetchWalletBalance(userData.userId));
    }
  }, [userData]);

  const handlecheckoutCart = async () => {
    try {
      const cartIds = items.map(item => item.id).join(',');
      const payload = {
        Addid: cartIds,
        Userid: userId,
        Sipid: "0"
      };

      const res = await dispatch(checkoutCart(payload)).unwrap();

      const trackId = res.orderid;
      if (!trackId) {
        throw new Error("Invalid response: Track ID missing");
      }

      setLatestTrackId(trackId);
      setShowModal(true);
      dispatch(clearCart()); // ✅ only after success
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error(err.message || "Checkout failed");
    }
  };

  const shipping = 30;
  const discount = 10;
  const tax = 10;
  const total = subtotal + shipping - discount - tax;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      {/* Address */}
      <motion.div className="flex items-center gap-3 mb-6 p-4 bg-orange-50 dark:bg-gray-800 rounded-xl">
        <div className="p-2 bg-orange-100 dark:bg-gray-700 rounded-full">
          <MapPin className="text-orange-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Delivery Address</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">1901 Thornridge Cir. Shiloh, Hawaii 81063</p>
        </div>
        <ArrowRight className="text-gray-400" />
      </motion.div>

      {/* Cart Items */}
      <motion.div className="border border-orange-200 dark:border-gray-700 rounded-xl p-4 mb-6 space-y-4">
        <p className="font-semibold">Your Order ({totalItems})</p>
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4">
            <img src={item.image} className="w-14 h-14 rounded-md object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.categoryName}</p>
              <p className="font-bold mt-1">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              <button><Minus className="w-4 h-4" /></button>
              <span className="font-medium">{item.quantity}</span>
              <button><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Wallet */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Wallet2 className="w-5 h-5 text-green-600" /> Wallet Balance
          </div>
          <span className="font-semibold">₹{userData?.walletBalance || 0}</span>
        </div>
      </div>

      {/* Payment Method */}
      <motion.div className="mb-6">
        <div
          className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border cursor-pointer"
          onClick={() => setShowPaymentOptions(!showPaymentOptions)}
        >
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">Payment Method</p>
            <div className="flex items-center gap-3">
              {selectedPayment.icon}
              <span className="font-medium">{selectedPayment.name}</span>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
        <div class="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
          <div class="min-w-0 flex-1 space-y-8">
            <div class="space-y-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Delivery Details</h2>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label for="your_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Your name </label>
                  <input type="text" id="your_name" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Bonnie Green" required />
                </div>

                <div>
                  <label for="your_email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Your email* </label>
                  <input type="email" id="your_email" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="name@flowbite.com" required />
                </div>

                <div>
                  <div class="mb-2 flex items-center gap-2">
                    <label for="select-country-input-3" class="block text-sm font-medium text-gray-900 dark:text-white"> Country* </label>
                  </div>
                  <select id="select-country-input-3" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
                    <option selected>United States</option>
                    <option value="AS">Australia</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>

                <div>
                  <div class="mb-2 flex items-center gap-2">
                    <label for="select-city-input-3" class="block text-sm font-medium text-gray-900 dark:text-white"> City* </label>
                  </div>
                  <select id="select-city-input-3" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500">
                    <option selected>San Francisco</option>
                    <option value="NY">New York</option>
                    <option value="LA">Los Angeles</option>
                    <option value="CH">Chicago</option>
                    <option value="HU">Houston</option>
                  </select>
                </div>

                <div>
                  <label for="phone-input-3" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Phone Number* </label>
                  <div class="flex items-center">
                    <button id="dropdown-phone-button-3" data-dropdown-toggle="dropdown-phone-3" class="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700" type="button">
                      <svg fill="none" aria-hidden="true" class="me-2 h-4 w-4" viewBox="0 0 20 15">
                        <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                        <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                          <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                        </mask>
                        <g mask="url(#a)">
                          <path fill="#D02F44" fill-rule="evenodd" d="M19.6.5H0v.933h19.6V.5zm0 1.867H0V3.3h19.6v-.933zM0 4.233h19.6v.934H0v-.934zM19.6 6.1H0v.933h19.6V6.1zM0 7.967h19.6V8.9H0v-.933zm19.6 1.866H0v.934h19.6v-.934zM0 11.7h19.6v.933H0V11.7zm19.6 1.867H0v.933h19.6v-.933z" clip-rule="evenodd" />
                          <path fill="#46467F" d="M0 .5h8.4v6.533H0z" />
                          <g filter="url(#filter0_d_343_121520)">
                            <path
                              fill="url(#paint0_linear_343_121520)"
                              fill-rule="evenodd"
                              d="M1.867 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.866 0a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM7.467 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zM2.333 3.3a.467.467 0 100-.933.467.467 0 000 .933zm2.334-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.4.467a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm-2.334.466a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.466a.467.467 0 11-.933 0 .467.467 0 01.933 0zM1.4 4.233a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM6.533 4.7a.467.467 0 11-.933 0 .467.467 0 01.933 0zM7 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zM3.267 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0z"
                              clip-rule="evenodd"
                            />
                          </g>
                        </g>
                        <defs>
                          <linearGradient id="paint0_linear_343_121520" x1=".933" x2=".933" y1="1.433" y2="6.1" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#fff" />
                            <stop offset="1" stop-color="#F0F0F0" />
                          </linearGradient>
                          <filter id="filter0_d_343_121520" width="6.533" height="5.667" x=".933" y="1.433" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                            <feOffset dy="1" />
                            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_343_121520" />
                            <feBlend in="SourceGraphic" in2="effect1_dropShadow_343_121520" result="shape" />
                          </filter>
                        </defs>
                      </svg>
                      +1
                      <svg class="-me-0.5 ms-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                      </svg>
                    </button>
                    <div id="dropdown-phone-3" class="z-10 hidden w-56 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700">
                      <ul class="p-2 text-sm font-medium text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-phone-button-2">
                        <li>
                          <button type="button" class="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                            <span class="inline-flex items-center">
                              <svg fill="none" aria-hidden="true" class="me-2 h-4 w-4" viewBox="0 0 20 15">
                                <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                                <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                                  <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                                </mask>
                                <g mask="url(#a)">
                                  <path fill="#D02F44" fill-rule="evenodd" d="M19.6.5H0v.933h19.6V.5zm0 1.867H0V3.3h19.6v-.933zM0 4.233h19.6v.934H0v-.934zM19.6 6.1H0v.933h19.6V6.1zM0 7.967h19.6V8.9H0v-.933zm19.6 1.866H0v.934h19.6v-.934zM0 11.7h19.6v.933H0V11.7zm19.6 1.867H0v.933h19.6v-.933z" clip-rule="evenodd" />
                                  <path fill="#46467F" d="M0 .5h8.4v6.533H0z" />
                                  <g filter="url(#filter0_d_343_121520)">
                                    <path
                                      fill="url(#paint0_linear_343_121520)"
                                      fill-rule="evenodd"
                                      d="M1.867 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.866 0a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM7.467 1.9a.467.467 0 11-.934 0 .467.467 0 01.934 0zM2.333 3.3a.467.467 0 100-.933.467.467 0 000 .933zm2.334-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm1.4.467a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.934 0 .467.467 0 01.934 0zm-2.334.466a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.466a.467.467 0 11-.933 0 .467.467 0 01.933 0zM1.4 4.233a.467.467 0 100-.933.467.467 0 000 .933zm1.4.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zm1.4.467a.467.467 0 100-.934.467.467 0 000 .934zM6.533 4.7a.467.467 0 11-.933 0 .467.467 0 01.933 0zM7 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.933 0 .467.467 0 01.933 0zM3.267 6.1a.467.467 0 100-.933.467.467 0 000 .933zm-1.4-.467a.467.467 0 11-.934 0 .467.467 0 01.934 0z"
                                      clip-rule="evenodd"
                                    />
                                  </g>
                                </g>
                                <defs>
                                  <linearGradient id="paint0_linear_343_121520" x1=".933" x2=".933" y1="1.433" y2="6.1" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#fff" />
                                    <stop offset="1" stop-color="#F0F0F0" />
                                  </linearGradient>
                                  <filter id="filter0_d_343_121520" width="6.533" height="5.667" x=".933" y="1.433" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                                    <feOffset dy="1" />
                                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                                    <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_343_121520" />
                                    <feBlend in="SourceGraphic" in2="effect1_dropShadow_343_121520" result="shape" />
                                  </filter>
                                </defs>
                              </svg>
                              United States (+1)
                            </span>
                          </button>
                        </li>
                        <li>
                          <button type="button" class="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                            <span class="inline-flex items-center">
                              <svg class="me-2 h-4 w-4" fill="none" viewBox="0 0 20 15">
                                <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                                <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                                  <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                                </mask>
                                <g mask="url(#a)">
                                  <path fill="#0A17A7" d="M0 .5h19.6v14H0z" />
                                  <path fill="#fff" fill-rule="evenodd" d="M-.898-.842L7.467 4.8V-.433h4.667V4.8l8.364-5.642L21.542.706l-6.614 4.46H19.6v4.667h-4.672l6.614 4.46-1.044 1.549-8.365-5.642v5.233H7.467V10.2l-8.365 5.642-1.043-1.548 6.613-4.46H0V5.166h4.672L-1.941.706-.898-.842z" clip-rule="evenodd" />
                                  <path stroke="#DB1F35" stroke-linecap="round" stroke-width=".667" d="M13.067 4.933L21.933-.9M14.009 10.088l7.947 5.357M5.604 4.917L-2.686-.67M6.503 10.024l-9.189 6.093" />
                                  <path fill="#E6273E" fill-rule="evenodd" d="M0 8.9h8.4v5.6h2.8V8.9h8.4V6.1h-8.4V.5H8.4v5.6H0v2.8z" clip-rule="evenodd" />
                                </g>
                              </svg>
                              United Kingdom (+44)
                            </span>
                          </button>
                        </li>
                        <li>
                          <button type="button" class="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                            <span class="inline-flex items-center">
                              <svg class="me-2 h-4 w-4" fill="none" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
                                <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                                <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                                  <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                                </mask>
                                <g mask="url(#a)">
                                  <path fill="#0A17A7" d="M0 .5h19.6v14H0z" />
                                  <path fill="#fff" stroke="#fff" stroke-width=".667" d="M0 .167h-.901l.684.586 3.15 2.7v.609L-.194 6.295l-.14.1v1.24l.51-.319L3.83 5.033h.73L7.7 7.276a.488.488 0 00.601-.767L5.467 4.08v-.608l2.987-2.134a.667.667 0 00.28-.543V-.1l-.51.318L4.57 2.5h-.73L.66.229.572.167H0z" />
                                  <path fill="url(#paint0_linear_374_135177)" fill-rule="evenodd" d="M0 2.833V4.7h3.267v2.133c0 .369.298.667.666.667h.534a.667.667 0 00.666-.667V4.7H8.2a.667.667 0 00.667-.667V3.5a.667.667 0 00-.667-.667H5.133V.5H3.267v2.333H0z" clip-rule="evenodd" />
                                  <path fill="url(#paint1_linear_374_135177)" fill-rule="evenodd" d="M0 3.3h3.733V.5h.934v2.8H8.4v.933H4.667v2.8h-.934v-2.8H0V3.3z" clip-rule="evenodd" />
                                  <path
                                    fill="#fff"
                                    fill-rule="evenodd"
                                    d="M4.2 11.933l-.823.433.157-.916-.666-.65.92-.133.412-.834.411.834.92.134-.665.649.157.916-.823-.433zm9.8.7l-.66.194.194-.66-.194-.66.66.193.66-.193-.193.66.193.66-.66-.194zm0-8.866l-.66.193.194-.66-.194-.66.66.193.66-.193-.193.66.193.66-.66-.193zm2.8 2.8l-.66.193.193-.66-.193-.66.66.193.66-.193-.193.66.193.66-.66-.193zm-5.6.933l-.66.193.193-.66-.193-.66.66.194.66-.194-.193.66.193.66-.66-.193zm4.2 1.167l-.33.096.096-.33-.096-.33.33.097.33-.097-.097.33.097.33-.33-.096z"
                                    clip-rule="evenodd"
                                  />
                                </g>
                                <defs>
                                  <linearGradient id="paint0_linear_374_135177" x1="0" x2="0" y1=".5" y2="7.5" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#fff" />
                                    <stop offset="1" stop-color="#F0F0F0" />
                                  </linearGradient>
                                  <linearGradient id="paint1_linear_374_135177" x1="0" x2="0" y1=".5" y2="7.033" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#FF2E3B" />
                                    <stop offset="1" stop-color="#FC0D1B" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              Australia (+61)
                            </span>
                          </button>
                        </li>
                        <li>
                          <button type="button" class="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                            <span class="inline-flex items-center">
                              <svg class="me-2 h-4 w-4" fill="none" viewBox="0 0 20 15">
                                <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                                <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                                  <rect width="19.6" height="14" y=".5" fill="#fff" rx="2" />
                                </mask>
                                <g mask="url(#a)">
                                  <path fill="#262626" fill-rule="evenodd" d="M0 5.167h19.6V.5H0v4.667z" clip-rule="evenodd" />
                                  <g filter="url(#filter0_d_374_135180)">
                                    <path fill="#F01515" fill-rule="evenodd" d="M0 9.833h19.6V5.167H0v4.666z" clip-rule="evenodd" />
                                  </g>
                                  <g filter="url(#filter1_d_374_135180)">
                                    <path fill="#FFD521" fill-rule="evenodd" d="M0 14.5h19.6V9.833H0V14.5z" clip-rule="evenodd" />
                                  </g>
                                </g>
                                <defs>
                                  <filter id="filter0_d_374_135180" width="19.6" height="4.667" x="0" y="5.167" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                                    <feOffset />
                                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                                    <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_374_135180" />
                                    <feBlend in="SourceGraphic" in2="effect1_dropShadow_374_135180" result="shape" />
                                  </filter>
                                  <filter id="filter1_d_374_135180" width="19.6" height="4.667" x="0" y="9.833" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                                    <feOffset />
                                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                                    <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_374_135180" />
                                    <feBlend in="SourceGraphic" in2="effect1_dropShadow_374_135180" result="shape" />
                                  </filter>
                                </defs>
                              </svg>
                              Germany (+49)
                            </span>
                          </button>
                        </li>
                        <li>
                          <button type="button" class="inline-flex w-full rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                            <span class="inline-flex items-center">
                              <svg class="me-2 h-4 w-4" fill="none" viewBox="0 0 20 15">
                                <rect width="19.1" height="13.5" x=".25" y=".75" fill="#fff" stroke="#F5F5F5" stroke-width=".5" rx="1.75" />
                                <mask id="a" style="mask-type:luminance" width="20" height="15" x="0" y="0" maskUnits="userSpaceOnUse">
                                  <rect width="19.1" height="13.5" x=".25" y=".75" fill="#fff" stroke="#fff" stroke-width=".5" rx="1.75" />
                                </mask>
                                <g mask="url(#a)">
                                  <path fill="#F44653" d="M13.067.5H19.6v14h-6.533z" />
                                  <path fill="#1035BB" fill-rule="evenodd" d="M0 14.5h6.533V.5H0v14z" clip-rule="evenodd" />
                                </g>
                              </svg>
                              France (+33)
                            </span>
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div class="relative w-full">
                      <input type="text" id="phone-input" class="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:border-s-gray-700  dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="123-456-7890" required />
                    </div>
                  </div>
                </div>

                <div>
                  <label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Email </label>
                  <input type="email" id="email" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="name@flowbite.com" required />
                </div>

                <div>
                  <label for="company_name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Company name </label>
                  <input type="text" id="company_name" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Flowbite LLC" required />
                </div>

                <div>
                  <label for="vat_number" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> VAT number </label>
                  <input type="text" id="vat_number" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="DE42313253" required />
                </div>

                <div class="sm:col-span-2">
                  <button type="submit" class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                    <svg class="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5" />
                    </svg>
                    Add new address
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Delivery Methods</h3>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div class="flex items-start">
                    <div class="flex h-5 items-center">
                      <input id="dhl" aria-describedby="dhl-text" type="radio" name="delivery-method" value="" class="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" checked />
                    </div>

                    <div class="ms-4 text-sm">
                      <label for="dhl" class="font-medium leading-none text-gray-900 dark:text-white"> $15 - DHL Fast Delivery </label>
                      <p id="dhl-text" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Get it by Tommorow</p>
                    </div>
                  </div>
                </div>

                <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div class="flex items-start">
                    <div class="flex h-5 items-center">
                      <input id="fedex" aria-describedby="fedex-text" type="radio" name="delivery-method" value="" class="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />
                    </div>

                    <div class="ms-4 text-sm">
                      <label for="fedex" class="font-medium leading-none text-gray-900 dark:text-white"> Free Delivery - FedEx </label>
                      <p id="fedex-text" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Get it by Friday, 13 Dec 2023</p>
                    </div>
                  </div>
                </div>

                <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                  <div class="flex items-start">
                    <div class="flex h-5 items-center">
                      <input id="express" aria-describedby="express-text" type="radio" name="delivery-method" value="" class="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />
                    </div>

                    <div class="ms-4 text-sm">
                      <label for="express" class="font-medium leading-none text-gray-900 dark:text-white"> $49 - Express Delivery </label>
                      <p id="express-text" class="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Get it today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showPaymentOptions && (
            <motion.div className="mt-2 space-y-2">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${selectedPayment.id === method.id ? 'bg-orange-100' : 'bg-gray-50'
                    }`}
                  onClick={() => {
                    setSelectedPayment(method);
                    setShowPaymentOptions(false);
                  }}
                >
                  {method.icon}
                  <span>{method.name}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Payment Summary */}
      <motion.div className="border-t pt-4 space-y-3 text-sm mb-6">
        <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Delivery</span><span>₹{shipping}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>₹{tax}</span></div>
        <div className="flex justify-between font-bold text-lg pt-2">
          <span>Total</span><span className="text-orange-500">₹{total.toFixed(2)}</span>
        </div>
      </motion.div>

      <div className="sticky bottom-0 flex justify-center p-4 bg-white dark:bg-gray-900 z-10">
        <motion.button
          onClick={handlecheckoutCart}
          className="w-full max-w-md bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg"
        >
          Place Order
        </motion.button>
      </div>

      <OrderConfirmedModal isOpen={showModal} onClose={() => setShowModal(false)} trackId={latestTrackId} />
    </div>
  );
}
