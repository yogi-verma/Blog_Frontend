import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const rotatingWords = ["Latest", "Daily", "Best", "Top"];
const duration = 2000;

const Header = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length);
    }, duration);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold flex items-baseline justify-center flex-wrap gap-2">
          <span className="text-gray-500 dark:text-gray-400">Explore Blog Posts</span>
          <span className="relative inline-flex justify-center items-baseline h-10 sm:h-12 md:h-14">
            <AnimatePresence mode="wait">
              <motion.span
                key={rotatingWords[index]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-blue-600 dark:text-blue-400"
              >
                {rotatingWords[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>
        
        <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xs sm:max-w-md md:max-w-xl mx-auto">
          Discover insightful articles, fresh updates, and expert tips — all in one place.
        </p>
      </div>
    </div>
  );
};

export default Header;