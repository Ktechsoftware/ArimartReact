import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X, UserCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import LogoutModal from "../Auth/LogoutModal";

const sidebarItems = [
    {
        title: "Trending",
        items: [
            { label: "Bestsellers", link: "/bestsellers" },
            { label: "Grocery", link: "/category/grocery" },
            { label: "Today's Deals", link: "/deals" },
            { label: "Mobiles, Computers", link: "/category/mobiles" },
            { label: "Fashion", link: "/category/fashion" },
            { label: "Electronics", link: "/category/electronics" },
            { label: "Home & Kitchen", link: "/category/home-kitchen" },
        ],
    },
    {
        title: "Shop by Category",
        items: [
            { label: "Mobiles, Computers", link: "/category/mobiles" },
            { label: "TV, Appliances, Electronics", link: "/category/electronics" },
            { label: "Men's Fashion", link: "/category/mens-fashion" },
            { label: "Women's Fashion", link: "/category/womens-fashion" },
            { label: "See all", link: "/categories" },
        ],
    },
    {
        title: "Programs & Features",
        items: [
            { label: "Gift Cards", link: "/giftcards" },
            { label: "Arimart Wallet", link: "/home/wallet" },
            { label: "Arimart Pay", link: "/arimartpay" },
            { label: "Arimart Business", link: "/business" },
            { label: "Shopper Toolkit", link: "/toolkit" },
        ],
    },
    {
        title: "Help & Settings",
        items: [
            { label: "Your Account", link: "/account" },
            { label: "Sign out", link: "#" }, // Will handle logout separately
        ],
    },
];


export default function DesktopSidebar({ isOpen, onClose }) {
    const sidebarRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const { isAuthenticated, userData } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Close sidebar when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            // Only allow sidebar to close if logout modal is not open
            if (!showModal && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "auto";
        };
    }, [isOpen, onClose, showModal]); // <-- include showModal in dependency


    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Blurred Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 hidden md:block"
                    />

                    {/* Sidebar */}
                    <motion.div
                        ref={sidebarRef}
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed top-0 left-0 w-72 h-screen bg-white shadow-xl z-50 overflow-y-auto hidden md:block"
                    >
                        <div className="flex items-center justify-between p-4 bg-gray-800 text-white sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <UserCircle size={20} />
                                {isAuthenticated ? (
                                    <Link to="/account" className="text-md font-medium">
                                        Hello, {userData?.fullName || userData?.username || "User"}
                                    </Link>
                                ) : (
                                    <Link to="/auth" className="text-md font-medium">
                                        Hello, Guest <br /><span className="text-sm text-gray-400">Please Sign in</span>
                                    </Link>
                                )}
                            </div>
                            <button onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>


                        {/* Content */}
                        <div className="divide-y divide-gray-200">
                            {sidebarItems.map((section, idx) => (
                                <div key={idx} className="py-3 px-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                        {section.title}
                                    </h4>
                                    <ul className="space-y-1">
                                        {section.items
                                           .filter((item) => !(item.label === "Sign out" && !isAuthenticated))
                                           .map((item, i) => (
                                            <motion.li
                                                key={i}
                                                whileHover={{ x: 4 }}
                                                onClick={() => {
                                                    if (item.label === "Sign out") setShowModal(true);
                                                    else if (item.link && item.link !== "#") navigate(item.link);
                                                }}
                                                className="flex justify-between items-center text-sm text-gray-600 hover:text-orange-600 cursor-pointer py-1.5"
                                            >
                                                <span>{item.label}</span>
                                                <ChevronRight size={16} />
                                            </motion.li>
                                        ))}


                                    </ul>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )
            }
            <LogoutModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </AnimatePresence >
    );
}