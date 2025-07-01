import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star } from "lucide-react";
import DProductCard from "./DProductcards";
import { fetchProductById } from "../../Store/productDetailSlice";
import { addToCartByUser } from "../../Store/cartSlice";
import toast from "react-hot-toast";


export default function ProductContentDetail() {
const { id } = useParams();
  const dispatch = useDispatch();
  const navigator = useNavigate();
  
  // Safe destructuring with fallback
  const productDetailState = useSelector((state) => state.productDetail) || {};
  // console.log("Product Detail State:", productDetailState);
  
  const { product = null, loading = false, error = null } = productDetailState;
  const userData = useSelector((state) => state.auth.userData);
  console.log("User Data:", userData);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading product details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500 dark:text-red-400">Error: {error}</div>;
  }

  if (!product) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Product not found.</div>;
  }

const handleAddToCart = () => {
  if (!userData || !userData.userId) {
   toast.error("Please login to add items to your cart.");
    return;
  }

  dispatch(addToCartByUser({
    Pid: product.id,
    Pdid: product.pdId,
    Qty: 1,
    Userid: userData.userId,
    Price: product.price,
  }));
};


  return (
    <div className="hidden md:block bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
      {/* ... Keep your existing UI unchanged ... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-lg w-60 h-60 object-cover"
          />
        </div>
        <div className="md:col-span-2 space-y-3">
          <h1 className="text-xl font-semibold">{product.productName}</h1>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center text-yellow-500">
              <Star size={16} fill="currentColor" />
              <span className="ml-1 font-medium">{product.categoryName}</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              ({product.reviews} ratings) • {product.sold} bought this month
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-lime-600">
              ₹{product.price}
              <span className="text-sm font-normal text-gray-400 line-through ml-2">
                ₹{product.originalPrice}
              </span>
              <span className="ml-2 text-red-500 font-semibold">
                -{Math.round((1 - product.netprice / product.totalprice) * 100)}%
              </span>
            </div>
            <p className="text-sm text-gray-500">Inclusive of all taxes</p>
          </div>

          <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/10 border border-orange-300 dark:border-orange-500 px-3 py-2 rounded-md">
            Cashback: Get 5% back with Amazon Pay ICICI Bank credit card for Prime members.
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mt-2 text-gray-700 dark:text-gray-300">
            <span>✔ Free Delivery</span>
            <span>✔ Secure Transaction</span>
            <span>✔ Returnable</span>
            <span>✔ Vegetarian</span>
          </div>
        </div>
      </div>

      {/* Delivery + Cart Section */}
      <div className="border p-4 rounded-md mt-6 bg-gray-50 dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <p className="text-green-600 font-medium">In Stock</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              FREE delivery today from 2 PM - 4 PM on orders over ₹249.
            </p>
          </div>
          <button 
          onClick={handleAddToCart}
          className="mt-4 sm:mt-0 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-md shadow">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Product Description</h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {product.shortdescription || "No description available."}
        </p>
      </div>

      {/* Image Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 bg-white dark:bg-gray-800 border rounded-md p-6 justify-center items-center">
        <img src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/f4258821-4583-407e-9882-650d32b364af.__CR0,0,300,300_PT0_SX300_V1___.jpg" alt="Verified"/>
        <img src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/94c5ccbd-5093-4b45-a9dd-55fb709761fd.__CR0,0,300,300_PT0_SX300_V1___.jpg" alt="Verified"/>
        <img src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/b5c01efa-26a5-4350-bfa5-bd697b45c5f3.__CR0,0,300,300_PT0_SX300_V1___.jpg" alt="Verified"/>
      </div>

      {/* Ingredients */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Ingredients</h3>
        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">banana</p>
      </div>

      {/* Legal */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        {product.longdesc || "No information available."}
      </div>

      {/* Related Products */}
      <h4 className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-300">Products related to this item</h4>
      <DProductCard product={product} />
    </div>
  );
}
