const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const getCohereResponse = async (prompt) => {
  const response = await cohere.generate({
    model: "command",
    prompt,
    temperature: 0.7,
    max_tokens: 500,
  });

  const text = response.generations[0]?.text?.trim();

  // Extract JSON array from response
  const jsonStart = text.indexOf("[");
  const jsonEnd = text.lastIndexOf("]") + 1;
  const jsonString = text.substring(jsonStart, jsonEnd);

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return [];
  }
};


module.exports = { getCohereResponse };
