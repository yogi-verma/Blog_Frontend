const reasons = [
  {
    emoji: "📚",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    title: "Grow Your Knowledge",
    desc: "Stay ahead with the latest in tech, AI, and development trends. Learn from experienced developers and domain experts.",
    color: "from-purple-500 to-blue-500",
  },
  {
    emoji: "🤝",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Collaborate & Build",
    desc: "Find like-minded peers to collaborate on projects, open-source contributions, or startups.",
    color: "from-green-500 to-teal-500",
  },
  {
    emoji: "🌟",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
    title: "Get Recognized",
    desc: "Showcase your work, write blogs, and get feedback from a community that values innovation and creativity.",
    color: "from-yellow-500 to-amber-500",
  },
  {
    emoji: "🚀",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Career Opportunities",
    desc: "Access exclusive job listings, internships, and mentorship opportunities within the tech ecosystem.",
    color: "from-red-500 to-pink-500",
  },
];

const WhyJoinCommunity = () => {
  return (
    <div className="px-4 py-16 max-w-7xl mx-auto">
      <div className="text-center mb-11">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold flex items-baseline justify-center flex-wrap gap-2">
          <span className="text-gray-500 dark:text-gray-400">
            Why Join Our 
          </span>
          <span className="relative inline-flex justify-center items-baseline h-10 sm:h-12 md:h-14">
            <span className="text-blue-600 dark:text-blue-400">Community</span>
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the benefits of being part of our vibrant developer community
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {reasons.map((reason, index) => (
          <div key={index} className="relative group">
            <div
              className={`absolute -inset-1 bg-gradient-to-r ${reason.color} rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300`}
            ></div>
            <div className="relative h-full bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#3b82f6] rounded-xl p-6 transition-all duration-300 group-hover:-translate-y-2">
              <div className="flex justify-center mb-4 text-2xl text-gray-700 dark:text-gray-300">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-800 dark:text-white">
                {reason.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed">
                {reason.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyJoinCommunity;
