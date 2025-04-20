// api/generate-plan.js

// Use require for CommonJS modules
const OpenAI = require('openai');

// Initialize OpenAI client securely
// It automatically reads OPENAI_API_KEY from process.env on the server-side
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the handler function using module.exports for CommonJS
module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Get user preferences from the request body
    const { userPrefs } = req.body;

    if (!userPrefs) {
      return res.status(400).json({ error: 'User preferences are required.' });
    }

    // Construct the prompt (same logic as before)
    // Note: Template literals work fine in CommonJS Node environments
    const prompt = `
You are a meal planner and fitness assistant. Based on the following preferences, generate a full 7-day plan with meals (each meal having a name and recipe) and fitness activities. Also, provide a categorized grocery list based ONLY on the generated meals.

Preferences: ${userPrefs}

Output ONLY valid JSON in the following structure, with no introductory text or explanations:
{
  "plan": {
    "Monday": { "fitness": "...", "meals": [ { "name": "...", "recipe": "..." } ] },
    "Tuesday": { "fitness": "...", "meals": [ { "name": "...", "recipe": "..." } ] },
    "Wednesday": { "fitness": "...", "meals": [ { "name": "...", "recipe": "..." } ] },
    "Thursday": { "fitness": "...", "meals": [ { "name": "...", "recipe": "..." } ] },
    "Friday": { "fitness": "...", "meals": [ { "name": "...", "recipe": "..." } ] },
    "Saturday": { "fitness": "...", "meals": [ { "name": "...", "recipe": "..." } ] },
    "Sunday": { "fitness": "...", "meals": [ { "name": "...", "recipe": "..." } ] }
  },
  "grocerySections": {
    "Produce": ["item1", "item2"],
    "Protein": ["item3"],
    "Dairy": ["item4"],
    "Pantry": ["item5"],
    "Other": ["item6"]
  }
}`;

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Or whichever model you prefer
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' }, // Request JSON output
    });

    // Extract the JSON content
    const result = completion.choices[0].message.content;

    // Parse the JSON string into an object
    const jsonData = JSON.parse(result);

    // Send the successful response back to the frontend
    res.status(200).json(jsonData);

  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    // Send an error response back to the frontend
    res.status(500).json({ error: 'Failed to generate plan.', details: error.message });
  }
}; // <-- End of module.exports function
