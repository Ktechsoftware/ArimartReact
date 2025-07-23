import React, { useState, useRef, useEffect } from 'react';
import { Gift, Scissors, Zap, Clock, Star, ArrowRight, ChevronLeft, ChevronRight, X, Plus, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyRewards } from '../../Store/promocodeSlice';

// Mock Redux slice actions - replace with your actual imports

const ScratchCardModal = ({ coupon, isOpen, onClose, onScratch }) => {
  const canvasRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Reset canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsScratched(false);

      // Create gradient scratch surface
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#C4B5FD');
      gradient.addColorStop(0.5, '#A78BFA');
      gradient.addColorStop(1, '#8B5CF6');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add scratch texture
      ctx.globalCompositeOperation = 'multiply';
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 3, 3);
      }
      ctx.globalCompositeOperation = 'source-over';

      // Add "SCRATCH HERE" text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 24px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = '20px Inter';
      ctx.fillText('🎁', canvas.width / 2, canvas.height / 2 + 20);
    }
  }, [isOpen]);

  const scratch = (e) => {
    if (isScratched || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fill();

    // Check if enough area is scratched
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    if (transparent > pixels.length / 16) { // 25% scratched
      setIsScratched(true);
      onScratch && onScratch();
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    scratch(mouseEvent);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Scratch & Win!
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scratch Card */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg mb-6">
            {/* Background content */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 flex flex-col items-center justify-center text-white">
              <div className="text-4xl font-bold mb-2">{coupon.discount}</div>
              <div className="text-lg opacity-90 mb-4">{coupon.description}</div>
              <div className="text-sm font-mono bg-white/20 px-3 py-2 rounded-lg">
                {coupon.code}
              </div>

              {/* QR Code */}
              <div className="mt-4 bg-white p-3 rounded-lg">
                <QRCodeSVG
                  value={coupon.qrValue || coupon.code}
                  size={80}
                  bgColor="white"
                  fgColor="#059669"
                />
              </div>
            </div>

            {/* Scratch canvas */}
            {!isScratched && (
              <canvas
                ref={canvasRef}
                width={500}
                height={256}
                className="absolute inset-0 w-full h-full cursor-pointer"
                onMouseMove={(e) => isScratching && scratch(e)}
                onMouseDown={() => setIsScratching(true)}
                onMouseUp={() => setIsScratching(false)}
                onMouseLeave={() => setIsScratching(false)}
                onTouchMove={handleTouchMove}
                onTouchStart={() => setIsScratching(true)}
                onTouchEnd={() => setIsScratching(false)}
              />
            )}

            {/* Expiry */}
            <div className="absolute bottom-3 right-3 text-xs text-white/80 bg-black/20 px-3 py-1 rounded-full">
              Exp: {coupon.expiry}
            </div>
          </div>

          {/* Success Message */}
          {isScratched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-2xl mb-2">🎉</div>
              <p className="text-green-600 dark:text-green-400 font-semibold">
                Congratulations! You've revealed your reward!
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ScratchCard = ({ coupon, onScratch, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full h-32 rounded-xl overflow-hidden shadow-lg cursor-pointer bg-gradient-to-br from-purple-400 to-purple-600"
      onClick={onClick}
    >
      {/* Preview content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="text-lg font-bold opacity-80">{coupon.discount}</div>
        <div className="text-sm opacity-70">{coupon.description}</div>
        <div className="text-xs mt-2 font-mono bg-white/20 px-2 py-1 rounded">
          Click to Scratch
        </div>
      </div>

      {/* Scratch overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 opacity-90 flex items-center justify-center">
        <div className="text-white text-center">
          <Scissors className="w-8 h-8 mx-auto mb-2" />
          <div className="text-sm font-medium">SCRATCH HERE</div>
        </div>
      </div>

      {/* Expiry */}
      <div className="absolute bottom-2 right-2 text-xs text-white/80 bg-black/20 px-2 py-1 rounded">
        Exp: {coupon.expiry}
      </div>
    </motion.div>
  );
};

const GiftCard = ({ card }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-indigo-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
      GIFT CARD
    </div>

    <div className="flex items-start gap-3">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center text-white">
        <Gift className="w-6 h-6" />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{card.brand}</h3>
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
          {card.balance}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {card.description}
        </p>
      </div>
    </div>

    <div className="mt-4 flex items-center gap-2">
      <div className="w-full relative group">
        <button className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium flex items-center gap-1">
          {card.code}
          <Scissors className="w-4 h-4" />
        </button>
        {/* Desktop tooltip */}
        <span className="hidden md:block absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Click to copy
        </span>
        {/* Mobile tooltip with animation */}
        <span className="md:hidden absolute top-0 left-32 text-gray-800 text-xs px-2 py-1 rounded animate-pulse">
          <span className='flex items-center gap-1'> <ArrowLeft className='w-3 h-3' /> Click to copy</span>
        </span>
      </div>
    </div>

    <div className="flex items-center gap-1 mt-3 text-xs text-gray-500 dark:text-gray-400">
      <Clock className="w-3 h-3" />
      <span>Expires: {card.expiry}</span>
    </div>
  </motion.div>
);

const PromoCard = ({ promo }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700 relative"
  >
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center text-white">
        <Zap className="w-6 h-6" />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{promo.brand}</h3>
        <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
          {promo.discount} OFF
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {promo.description}
        </p>
      </div>

      <div className="text-right">
        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
          <QRCodeSVG
            value={promo.qrValue || promo.code}
            size={48}
            bgColor="transparent"
            fgColor="currentColor"
            className="text-gray-800 dark:text-gray-200"
          />
        </div>
      </div>
    </div>

    <div className="mt-4 flex items-center gap-2">
      <div className="w-full relative group">
        <button className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium flex items-center gap-1">
          {promo.code}
          <Scissors className="w-4 h-4" />
        </button>
        {/* Desktop tooltip */}
        <span className="hidden md:block absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Click to copy
        </span>
        {/* Mobile tooltip with animation */}
        <span className="md:hidden absolute top-0 left-32 text-gray-800 text-xs px-2 py-1 rounded animate-pulse">
          <span className='flex items-center gap-1'> <ArrowLeft className='w-3 h-3' /> Click to copy</span>
        </span>
      </div>
    </div>

    <div className="flex items-center gap-1 mt-3 text-xs text-gray-500 dark:text-gray-400">
      <Clock className="w-3 h-3" />
      <span>Expires: {promo.expiry}</span>
    </div>
  </motion.div>
);

const VoucherCard = ({ voucher }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border-2 border-dashed border-amber-300 dark:border-amber-600 relative"
  >
    <div className="absolute -top-3 left-4 bg-amber-500 text-white px-3 py-1 text-xs font-bold rounded-full">
      VOUCHER
    </div>

    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white mx-auto mb-3">
        <Star className="w-8 h-8" />
      </div>

      <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
        {voucher.description}
      </h3>

      <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mb-4">
        {voucher.discount}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 mb-3">
        <QRCodeSVG
          value={voucher.qrValue || voucher.code}
          size={80}
          bgColor="transparent"
          fgColor="currentColor"
          className="text-gray-800 dark:text-gray-200 mx-auto"
        />
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Code: <span className="font-mono font-medium">{voucher.code}</span>
      </div>

      <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
        <Clock className="w-3 h-3" />
        <span>Expires: {voucher.expiry}</span>
      </div>
    </div>
  </motion.div>
);

const ScrollableSection = ({ title, icon, children, showNavigation = false }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [children]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">{title}</h2>
        </div>

        {showNavigation && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="animate-pulse p-5 my-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
    <div className="h-20 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
  </div>
);

const ModernRewardsPage = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth?.userData || {});
  const { myRewards: rewardsData = [], loading, error } = useSelector(state => state.promocode || { myRewards: [] });

  const [selectedScratchCard, setSelectedScratchCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (userData?.id) {
      dispatch(fetchMyRewards(userData.id));
    }
  }, [dispatch, userData?.id]);

  // Transform rewards data
  const transformedRewards = rewardsData.map(item => {
    const isGift = item.rewardType === "GIFT_CARD";
    const isCoupon = item.rewardType === "COUPON";
    const isVoucher = item.rewardType === "VOUCHER";

    const formattedExpiry = new Date(item.endDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    return {
      type: isGift ? "gift" : isCoupon ? "scratch" : isVoucher ? "voucher" : "promo",
      brand: item.brand || "Generic Brand",
      code: item.code,
      description: item.description,
      balance: isGift ? `₹${item.discountValue}` : undefined,
      discount: !isGift
        ? `${item.discountValue}${item.discountType === "PERCENTAGE" ? "%" : "₹"}`
        : undefined,
      expiry: formattedExpiry,
      category: item.rewardType,
      qrValue: item.code
    };
  });

  // Sample data for demo (fallback)
  const sampleData = {
    scratchCoupons: [
      {
        type: "scratch",
        discount: "30% OFF",
        description: "Fashion & Lifestyle",
        code: "FASHION30",
        expiry: "Dec 31, 2024",
        qrValue: "FASHION30"
      },
      {
        type: "scratch",
        discount: "₹500 OFF",
        description: "Electronics",
        code: "TECH500",
        expiry: "Jan 15, 2025",
        qrValue: "TECH500"
      }
    ],
    giftCards: [
      {
        type: "gift",
        brand: "Amazon",
        balance: "₹1,000",
        description: "Universal shopping voucher",
        code: "AG4X-7Y9Z-2K8M",
        expiry: "Dec 31, 2025",
        qrValue: "AG4X-7Y9Z-2K8M"
      }
    ],
    promoCodes: [
      {
        type: "promo",
        brand: "Myntra",
        discount: "25%",
        description: "Fashion & Accessories",
        code: "MYNTRA25",
        expiry: "Dec 25, 2024",
        qrValue: "MYNTRA25"
      }
    ],
    vouchers: [
      {
        type: "voucher",
        description: "Special Discount Voucher",
        discount: "40% OFF",
        code: "SPECIAL40",
        expiry: "Jan 31, 2025",
        qrValue: "SPECIAL40"
      }
    ]
  };

  // Use transformed data or fallback to sample data
  const scratchCoupons = transformedRewards.filter(r => r.type === "scratch") || sampleData.scratchCoupons;
  const giftCards = transformedRewards.filter(r => r.type === "gift") || sampleData.giftCards;
  const promoCodes = transformedRewards.filter(r => r.type === "promo") || sampleData.promoCodes;
  const vouchers = transformedRewards.filter(r => r.type === "voucher") || sampleData.vouchers;

  const handleScratchCardClick = (coupon) => {
    setSelectedScratchCard(coupon);
    setIsModalOpen(true);
  };

  const handleScratch = () => {
    console.log('Scratched:', selectedScratchCard?.code);
  };

  const totalRewards = scratchCoupons.length + giftCards.length + promoCodes.length + vouchers.length;

  return (
    <motion.div className="max-w-7xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">My Rewards</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Discover and redeem your exclusive offers</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            🎉 {totalRewards} Active Rewards
          </div>
          {/* <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
          >
            <Plus className="w-5 h-5" />
          </motion.button> */}
        </div>
      </motion.div>

      {loading && <SkeletonCard />}
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {/* Scratch Cards Section */}
      {scratchCoupons.length > 0 && (
        <ScrollableSection
          title="Coupons"
          icon={<Scissors className="w-5 h-5 text-purple-500" />}
          showNavigation={true}
        >
          {scratchCoupons.map((coupon, index) => (
            <div key={index} className="flex-shrink-0 w-80">
              <ScratchCard
                coupon={coupon}
                onClick={() => handleScratchCardClick(coupon)}
              />
            </div>
          ))}
        </ScrollableSection>
      )}

      {/* Gift Cards & Promo Codes Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Gift Cards */}
        {giftCards.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Gift Cards</h2>
            </div>
            <div className="space-y-4">
              {giftCards.map((card, index) => (
                <GiftCard key={index} card={card} />
              ))}
            </div>
          </div>
        )}

        {/* Promo Codes */}
        {promoCodes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Promo Codes</h2>
            </div>
            <div className="space-y-4">
              {promoCodes.map((promo, index) => (
                <PromoCard key={index} promo={promo} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vouchers Section */}
      {vouchers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Special Vouchers</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vouchers.map((voucher, index) => (
              <VoucherCard key={index} voucher={voucher} />
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-2">Earn More Rewards!</h3>
        <p className="mb-4 opacity-90">Complete purchases and activities to unlock exclusive offers</p>
        <button className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
          Start Shopping <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      {isModalOpen && selectedScratchCard && (
        <ScratchCardModal
          isOpen={isModalOpen}
          coupon={selectedScratchCard}
          onClose={() => setIsModalOpen(false)}
          onScratch={handleScratch}
        />
      )}

    </motion.div>
  );
};

export default ModernRewardsPage;