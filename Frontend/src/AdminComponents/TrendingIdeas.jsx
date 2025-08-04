import React, { useEffect, useState } from "react";
import { getTrendIdeas } from "../utils/aiApi";

const TrendingIdeas = () => {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      const result = await getTrendIdeas();
      setIdeas(result);
    };
    fetchIdeas();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">AI Generated Blog Topics</h2>
      <ul className="list-disc pl-5 space-y-1">
        {ideas.map((idea, index) => (
          <li key={index}>{idea}</li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingIdeas;
