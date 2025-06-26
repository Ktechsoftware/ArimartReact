import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, User } from "lucide-react";

const BlogCard = ({ blog }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
    >
      {/* Blog Image */}
      <Link to={`/blog/${blog.slug}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-white dark:bg-gray-900 text-xs font-medium px-2 py-1 rounded-full shadow">
            {blog.category}
          </div>
        </div>
      </Link>

      {/* Blog Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <User size={14} />
            {blog.author}
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays size={14} />
            {blog.date}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {blog.readTime} min read
          </div>
        </div>

        <Link to={`/blog/${blog.slug}`}>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 hover:text-primary dark:hover:text-primary-300 transition-colors">
            {blog.title}
          </h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
          {blog.excerpt}
        </p>

        <div className="flex justify-between items-center">
          <Link
            to={`/blog/${blog.slug}`}
            className="text-primary dark:text-primary-400 font-medium hover:underline inline-flex items-center"
          >
            Read More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          {/* Likes/Comments */}
          <div className="flex gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>{blog.likes} Likes</span>
            <span>{blog.comments} Comments</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;