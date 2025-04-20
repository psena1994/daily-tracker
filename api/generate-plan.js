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
    // *** Changed model to gpt-3.5-turbo as gpt-4 was causing a 404 error ***
    // *** This might be due to API key access limitations. ***
    // *** You can change this back to 'gpt-4' or another model like 'gpt-4-turbo' or 'gpt-4o' ***
    // *** if you confirm your key has access to it. ***
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Changed from 'gpt-4'
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
    // Log the specific error from OpenAI or JSON parsing
    console.error("Error in API handler:", error);

    // Check if the error is an OpenAI APIError and extract details
    if (error instanceof OpenAI.APIError) {
        console.error("OpenAI API Error Details:", {
            status: error.status,
            code: error.code,
            type: error.type,
            message: error.message,
            param: error.param,
        });
         res.status(error.status || 500).json({
            error: 'Failed to generate plan due to API error.',
            details: {
                message: error.message,
                type: error.type,
                code: error.code
            }
        });
    } else if (error instanceof SyntaxError) {
        // Handle JSON parsing errors specifically
        console.error("JSON Parsing Error:", error.message);
        res.status(500).json({
            error: 'Failed to process the plan data.',
            details: 'Error parsing the response from the AI model.'
        });
    } else {
        // Handle other types of errors
        res.status(500).json({
            error: 'Failed to generate plan due to an unexpected server error.',
            details: error.message
        });
    }
  }
}; // <-- End of module.exports function
