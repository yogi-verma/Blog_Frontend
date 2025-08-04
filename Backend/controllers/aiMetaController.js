exports.generateBlogMeta = async (req, res) => {
  const { blogContent } = req.body;

  try {
    const prompt = `
You are a professional blog writer and SEO expert. Based on the blog content below, generate:
1. 3 catchy titles
2. A compelling meta description (max 160 characters)
3. 5 SEO tags

Respond strictly in JSON format like this:
{
  "titles": ["Title 1", "Title 2", "Title 3"],
  "metaDescription": "Your short meta description here",
  "seoTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Blog Content:
"""${blogContent}"""
`;

    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r-plus",
        prompt,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const rawOutput = data.generations[0].text.trim();

    // Try to parse the output as JSON
    let structuredOutput;
    try {
      structuredOutput = JSON.parse(rawOutput);
    } catch (err) {
      return res.status(500).json({
        error: "AI response was not valid JSON",
        raw: rawOutput, // send for debugging
      });
    }

    res.json(structuredOutput);
  } catch (error) {
    console.error("AI generation failed:", error.message);
    res.status(500).json({ error: "Failed to generate blog meta" });
  }
};
