import {
  ArrowLeft,
  Heart,
  Star,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

export default function ProductDetails() {
  const [qty, setQty] = useState(1);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen p-4">
      <div className="flex items-center justify-between mb-2">
        <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-800">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-medium"></h1>
        <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-800">
          <Heart size={20} />
        </button>
      </div>

      <div className="flex justify-center my-4">
        <img
          src="https://via.placeholder.com/150x150?text=Beef"
          alt="Beef Mixed"
          className="h-36 object-contain"
        />
      </div>

      <h2 className="text-lg font-semibold">Beef Mixed Cut Bone</h2>
      <p className="text-sm text-gray-500">In 50 gm</p>
      <p className="text-xs text-gray-400 mb-2">1000 gm</p>

      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-bold text-green-700">23.<sup>46$</sup></div>
        <p className="text-sm text-purple-600">Available on fast delivery</p>
      </div>

      <div className="flex gap-2 my-2">
        {["bg-red-400", "bg-blue-500", "bg-yellow-500"].map((clr, i) => (
          <div
            key={i}
            className={`${clr} w-6 h-6 rounded-full border-2 border-white shadow`}
          ></div>
        ))}
        <div className="ml-auto text-sm flex items-center gap-1">
          <Star className="text-yellow-400 w-4 h-4" />
          4.5 Rating
        </div>
      </div>

      <p className="text-xs text-gray-500 my-3">
        100% satisfaction guarantee. If you experience any of the following issues: missing,
        poor item, late arrival, unprofessional service...{" "}
        <span className="text-green-600 font-medium cursor-pointer">Read more</span>
      </p>
      
      <div className="flex items-center mt-4 gap-4 fixed bottom-4 inset-x-0 mx-4 rounded-2xl z-50">
        <div className="flex items-center border rounded-full px-3 py-4 gap-2">
          <button onClick={() => setQty(Math.max(1, qty - 1))}>
            <Minus size={18} />
          </button>
          <span className="text-sm font-semibold">{qty}</span>
          <button onClick={() => setQty(qty + 1)}>
            <Plus size={18} />
          </button>
        </div>

        <button className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-4 rounded-full transition">
          <ShoppingCart size={18} />
          Add to cart
        </button>
      </div>
    </div>
  );
}
