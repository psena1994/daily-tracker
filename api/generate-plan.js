// api/generate-plan.js

// Import the Google Generative AI SDK using CommonJS
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

// Get the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

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

    // --- Prompt remains the same ---
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

    // --- Select the Gemini model ---
    // Using gemini-1.5-flash for speed and cost-effectiveness.
    // You could also use "gemini-1.0-pro" or other available models.
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        // Basic safety settings - adjust as needed
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
    });

    // --- Configure the generation settings for JSON output ---
    const generationConfig = {
      temperature: 0.7,
      // IMPORTANT: Specify JSON output format
      responseMimeType: "application/json",
    };

    // --- Prepare the content for the API call ---
    const parts = [{ text: prompt }];
    const requestPayload = {
        contents: [{ role: "user", parts }],
        generationConfig, // Include generation config here
    };


    // --- Call the Google Gemini API ---
    console.log("Calling Gemini API..."); // Log before call
    const result = await model.generateContent(requestPayload);
    console.log("Gemini API call successful."); // Log after successful call


    // --- Extract the JSON response text ---
    // Access the response text using result.response.text()
    const response = result.response;
    if (!response || !response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts || response.candidates[0].content.parts.length === 0) {
        console.error("Invalid response structure from Gemini:", JSON.stringify(response, null, 2));
        // Check for safety blocks
        if (response && response.promptFeedback && response.promptFeedback.blockReason) {
            throw new Error(`Request blocked by safety filters: ${response.promptFeedback.blockReason}`);
        }
         if (response && response.candidates && response.candidates[0].finishReason && response.candidates[0].finishReason !== 'STOP') {
            throw new Error(`Generation stopped unexpectedly: ${response.candidates[0].finishReason}`);
        }
        throw new Error("Received an empty or invalid response from the Gemini API.");
    }
    // Get text from the first part of the first candidate's content
    const text = response.candidates[0].content.parts[0].text;


    // --- Parse the JSON string into an object ---
    console.log("Parsing JSON response...");
    const jsonData = JSON.parse(text);
    console.log("JSON parsing successful.");

    // Send the successful response back to the frontend
    res.status(200).json(jsonData);

  } catch (error) {
    // Log the specific error from Google AI or JSON parsing
    console.error("Error in API handler:", error);

    // Provide a more generic error message for the client
    res.status(500).json({
        error: 'Failed to generate plan.',
        // Include details only if safe/desired for debugging (consider security)
        details: error.message || 'An unexpected server error occurred.'
    });
  }
}; // <-- End of module.exports function
