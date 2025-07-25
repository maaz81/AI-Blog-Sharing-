const openRouterClient = require('../utils/openaiClient');

const generatePostSuggestions = async (req, res) => {
  const { title, description, tags } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const prompt = `
You are an assistant for blog writers.

Given the title: "${title}"
And description: "${description}"

1. Suggest 5 catchy, unique blog titles.
2. Rewrite the original description into 3 different, improved versions.
   - Each version should be at least **50 words long**.
   - Make them more engaging and informative.
3. 10 tags related to the topic

Respond in JSON format as:
{
  "titles": ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"],
  "descriptions": ["Description 1", "Description 2", "Description 3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"]
}
`;

  try {
    const aiReply = await openRouterClient(prompt);

    // Try to extract valid JSON from the response
    const jsonStart = aiReply.indexOf('{');
    const jsonEnd = aiReply.lastIndexOf('}') + 1;
    const jsonString = aiReply.slice(jsonStart, jsonEnd);

    const result = JSON.parse(jsonString);
    res.status(200).json(result);

  } catch (err) {
    console.error("AI Generation Error:", err.message);
    res.status(500).json({ error: "AI generation failed" });
  }
};


const handleAIChat = async (req, res) => {
  const { message } = req.body;

  try {
    const aiReply = await openRouterClient(message);
    res.status(200).json({ reply: aiReply });
  } catch (err) {
    res.status(500).json({ error: err.message || 'AI chat failed' });
  }
};


module.exports = { generatePostSuggestions , handleAIChat};
