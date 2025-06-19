import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function LogoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    Object.keys(Cookies.get()).forEach((cookieName) =>
      Cookies.remove(cookieName)
    );

    // Redirect to home
    navigate("/home");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Are you sure you want to logout?
        </h2>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Sure
          </button>
        </div>
      </div>
    </div>
  );
}
