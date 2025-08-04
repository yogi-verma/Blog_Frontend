import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiGlobe,
  FiMoon,
  FiSun,
  FiCalendar,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import img from "../assets/img.jpg";

const Developer = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("darkMode") === "true" ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches &&
        localStorage.getItem("darkMode") !== "false")
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const socialLinks = [
    {
      icon: <FiGithub />,
      url: "https://github.com/yogi-verma",
      color: "hover:text-white text-gray-400",
    },
    {
      icon: <FiLinkedin />,
      url: "https://www.linkedin.com/in/pys123/",
      color: "hover:text-blue-400 text-blue-300",
    },
    {
      icon: <FiTwitter />,
      url: "https://twitter.com",
      color: "hover:text-sky-400 text-sky-300",
    },
    {
      icon: <FiGlobe />,
      url: "yogeshvermapys143@gmail.com",
      color: "hover:text-emerald-400 text-emerald-300",
    },
  ];

  return (
    <div
      className={`min-h-screen px-6 py-10 ${
        darkMode ? "bg-gray-950 text-gray-200" : "bg-gray-50 text-gray-800"
      } transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <FiArrowLeft />
            Back to Home
          </Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-md ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                : "bg-white shadow hover:bg-gray-100 text-gray-700"
            }`}
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>

        {/* Profile Section */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Left - Profile Card */}
          <div
            className={`rounded-xl border h-85 ${
              darkMode
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            } p-6 shadow-md`}
          >
            <div className="flex flex-col items-center text-center">
              <img
                src={img}
                alt="Developer"
                className="w-44 h-44 rounded-full object-cover border-4 border-gray-300 mb-4"
              />
              <h1 className="text-2xl font-bold">Yogesh Verma</h1>
              <p className="text-md text-gray-400">Software Developer</p>
              <div className="flex gap-4 mt-4">
                {socialLinks.map((s, i) => (
                  <motion.a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className={`transition ${s.color}`}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Info */}
          <div className="md:col-span-2 space-y-8">
            {/* About */}
            <section>
              <h2 className="text-lg font-semibold mb-2">About Me</h2>
              <p className="text-sm leading-relaxed text-gray-400">
                I’m Yogesh Verma, a B.Tech Computer Science student with strong
                skills in full-stack development and data structures. I’ve built
                real-world projects using the MERN stack, interned at Aethereus
                Consulting (Salesforce), and currently pursuing an internship at
                S&P Global. With 700+ coding problems solved, I’m passionate
                about scalable systems, clean code, and building impactful
                digital solutions.
              </p>
            </section>

            {/* Technologies */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Core Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "HTML",
                  "CSS",
                  "JavaScript",
                  "C++",
                  "React",
                  "Express.js",
                  "Node.js",
                  "GraphQL",
                  "AWS",
                  "PostgreSQL",
                  "Tailwind CSS",
                  "MongoDB",
                  "MySQL",
                  "SQL",
                  "GIT",
                  "GitHub",
                ].map((tech, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      darkMode
                        ? "bg-gray-800 text-gray-200"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Get In Touch</h2>
              <div className="space-y-3">
                {/* <motion.a
                  whileHover={{ x: 4 }}
                  href="mailto:sarah@example.com"
                  className="flex items-center gap-2 text-sm hover:underline text-blue-400"
                >
                  <FiMail /> sarah@example.com
                </motion.a> */}
                <motion.a
                  whileHover={{ x: 4 }}
                  href="https://calendly.com"
                  target="_blank"
                  className="flex items-center gap-2 text-sm hover:underline text-emerald-400"
                >
                  <FiCalendar /> Schedule a meeting
                </motion.a>
              </div>
            </section>
          </div>
        </div>

        {/* Experience Section */}
        <div
          className={`mt-12 p-6 rounded-xl border ${
            darkMode
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-200"
          } shadow-md`}
        >
          <h2 className="text-xl font-bold mb-6">Professional Experience</h2>
          <div className="space-y-6">
            {[
              {
                role: "Software Developer Intern",
                company: "S&P Global",
                period: "July 2025 - Present",
                description:
                  "Leading a team of 5 developers and implementing architecture patterns that improved platform performance by 40%.",
              },
              {
                role: "Salesforce Intern",
                company: "Aethereus",
                period: "Aug 2024 - Dec 2025",
                description:
                  "Completed a Salesforce internship where I gained hands-on experience with CRM workflows, data modeling, and automation tools. Contributed to real-world projects involving Salesforce Apex, Lightning components, and process automation.",
              },
            ].map((exp, i) => (
              <div key={i}>
                <h3 className="text-md font-semibold">
                  {exp.role} ·{" "}
                  <span className="text-blue-400">{exp.company}</span>
                </h3>
                <p className="text-xs text-gray-400 mb-1">{exp.period}</p>
                <p className="text-sm text-gray-400">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`mt-8 p-6 rounded-xl border ${
            darkMode
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-200"
          } shadow-md`}
        >
          <h2 className="text-xl font-bold mb-4">Education</h2>
          <div className="space-y-6">
            {[
              {
                role: "Bachelor of Technology - CSE",
                company: "Lovely Professional University",
                period: "Sept 2021 - June 2025",
                description:
                  "Completed B.Tech in Computer Science and Engineering with a strong foundation in data structures, algorithms, and software development. Gained practical experience through academic projects, coding challenges, and hands-on work with modern technologies.",
              },
            ].map((exp, i) => (
              <div key={i}>
                <h3 className="text-md font-semibold">
                  {exp.role} ·{" "}
                  <span className="text-blue-400">{exp.company}</span>
                </h3>
                <p className="text-xs text-gray-400 mb-1">{exp.period}</p>
                <p className="text-sm text-gray-400">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developer;
