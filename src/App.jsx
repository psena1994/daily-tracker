import React, { useState, useMemo, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Tabs, Tab, Box, Card, CardContent, Checkbox,
  FormControlLabel, Grid, Container, CssBaseline, createTheme, ThemeProvider,
  Divider, LinearProgress, Switch, Grow, Button, TextField
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { blueGrey } from "@mui/material/colors";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { motion, AnimatePresence } from "framer-motion"; // Combined framer-motion imports

// --- REMOVED OpenAI import and client setup ---

// Swipe transition variants (No changes needed here)
const variants = {
  enter: (dir) => ({
    x: dir > 0 ? -window.innerWidth : window.innerWidth,
    position: "absolute",
    width: "100%"
  }),
  center: {
    x: 0,
    position: "absolute",
    width: "100%"
  },
  exit: (dir) => ({
    x: dir > 0 ? window.innerWidth : -window.innerWidth,
    position: "absolute",
    width: "100%"
  })
};

// --- REMOVED the old fetchCustomPlan function that called OpenAI directly ---
// const fetchCustomPlan = async (userPrefs) => { ... }; // <- This is gone

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Default plan (No changes needed here)
const defaultPlan = {
  Monday: { /* ... */ },
  Tuesday: { /* ... */ },
  Wednesday: { /* ... */ },
  Thursday: { /* ... */ },
  Friday: { /* ... */ },
  Saturday: { /* ... */ },
  Sunday: { /* ... */ }
};

// Default groceries (No changes needed here)
const defaultGroceries = {
  "🍗 Protein": ["12 Eggs", /* ... */],
  "🍞 Carbs": ["14 Bananas", /* ... */],
  "🥦 Fruits & Veg": ["500 g Strawberries", /* ... */],
  "🧂 Condiments": ["150 ml Honey", /* ... */],
  "🍿 Snacks": ["100 g Dark chocolate", /* ... */]
};


// Main App Component
function App() {
  const [userPrefs, setUserPrefs] = useState("high protein, gluten-free");
  const [selectedDay, setSelectedDay] = useState(() => localStorage.getItem("selectedDay") || days[new Date().getDay()]);
  const [checkedItemsByDay, setCheckedItemsByDay] = useState(() => { /* ...localStorage logic... */ });
  const [groceryChecked, setGroceryChecked] = useState(() => { /* ...localStorage logic... */ });
  const [dynamicPlan, setDynamicPlan] = useState(() => { /* ...localStorage logic... */ });
  const [dynamicGroceries, setDynamicGroceries] = useState(() => { /* ...localStorage logic... */ });
  const [direction, setDirection] = useState(0);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();

  const activePlan = dynamicPlan ?? defaultPlan;
  const activeGroceries = dynamicGroceries ?? defaultGroceries;
  const meals = activePlan[selectedDay]?.meals || [];
  const fitness = activePlan[selectedDay]?.fitness || "";
  const checkedItems = checkedItemsByDay[selectedDay] || {};

  // progress calculation (No changes needed here)
  const progress = useMemo(() => { /* ... */ }, [checkedItems, meals]);

  // useEffect hooks for localStorage and confetti (No changes needed here)
  useEffect(() => { /* ...localStorage logic... */ }, [selectedDay, checkedItemsByDay, groceryChecked, dynamicPlan, dynamicGroceries]);
  useEffect(() => { /* ...confetti logic... */ }, [progress]);

  // handleSwipe function (No changes needed here)
  const handleSwipe = (dir) => { /* ... */ };

  // handleCheck function (No changes needed here)
  const handleCheck = (key) => { /* ... */ };

  // resetCustomPlan function (No changes needed here)
  const resetCustomPlan = () => { /* ... */ };

  // --- ADDED the new function to call the secure API endpoint ---
  const handleGeneratePlan = async () => {
    setLoadingPlan(true);
    try {
      // Make a POST request to your new serverless function endpoint
      const response = await fetch('/api/generate-plan', { // Relative URL works fine
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the user preferences in the request body
        body: JSON.stringify({ userPrefs }),
      });

      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Catch cases where body isn't valid JSON
        console.error("API Error Response:", errorData);
        throw new Error(`API request failed with status ${response.status}: ${errorData.error || 'Unknown error'}`);
      }

      // Parse the JSON response from your serverless function
      const { plan: newPlan, grocerySections: newGroceries } = await response.json();

      // Update the state with the data received from the backend
      setDynamicPlan(newPlan);
      setDynamicGroceries(newGroceries);

    } catch (err) {
      console.error("Failed to fetch plan:", err);
      // Optionally, display an error message to the user here
      alert(`Error generating plan: ${err.message}`); // Simple alert, consider a better UI feedback method
    } finally {
      setLoadingPlan(false);
    }
  };
  // --- End of the new handleGeneratePlan function ---

  // theme definition (No changes needed here)
  const theme = createTheme({ /* ... */ });

  // --- Component Return (JSX) ---
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ mt: 4 }}>
        <TextField
          fullWidth
          label="Your Preferences"
          value={userPrefs}
          onChange={(e) => setUserPrefs(e.target.value)}
          sx={{ mb: 2 }}
        />
        {/* --- UPDATED Button onClick --- */}
        <Button
          variant="contained"
          disabled={loadingPlan}
          onClick={handleGeneratePlan} // Now calls the new secure handler function
        >
          {loadingPlan ? "Generating..." : "Generate Plan from Preferences"}
        </Button>
        {/* --- End of Updated Button onClick --- */}

        <Button variant="outlined" onClick={resetCustomPlan} sx={{ ml: 2 }}>
          Reset to Default
        </Button>

        {/* Day view with motion */}
        <Box sx={{ mt: 4, position: "relative", height: "100%" }}>
          <AnimatePresence custom={direction}>
            <motion.div
              key={selectedDay}
              // ... (rest of motion.div props unchanged) ...
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => { /* ... */ }}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
            >
              <Box>
                <Typography variant="h5" textAlign="center" mb={2}>
                  {selectedDay}
                </Typography>

                {/* Fitness Card */}
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">🏋️ Fitness</Typography>
                    <FormControlLabel
                      control={ <Checkbox checked={checkedItems["fitness"] || false} onChange={() => handleCheck("fitness")} /> }
                      label={fitness}
                    />
                  </CardContent>
                </Card>

                {/* Meals Card */}
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">🍽️ Meals</Typography>
                    {meals.map((meal, i) => (
                      <FormControlLabel
                        key={i}
                        control={ <Checkbox checked={checkedItems[`meal-${i}`] || false} onChange={() => handleCheck(`meal-${i}`)} /> }
                        label={
                          <Box>
                            <Typography fontWeight="bold">{meal.name}</Typography>
                            <Typography variant="body2">{meal.recipe}</Typography>
                          </Box>
                        }
                      />
                    ))}
                  </CardContent>
                </Card>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Progress: {progress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Grocery List */}
        <Box mt={6}>
          <Typography variant="h6">🛒 Grocery List</Typography>
          <Grid container spacing={2}>
            {Object.entries(activeGroceries).map(([category, items]) => (
              <Grid item xs={12} md={6} key={category}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">{category}</Typography>
                    {items.map((item, i) => (
                      <FormControlLabel
                        key={i}
                        control={ <Checkbox checked={groceryChecked[item] || false} onChange={() => setGroceryChecked(prev => ({ ...prev, [item]: !prev[item] })) } /> }
                        label={item}
                      />
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Confetti */}
        {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />}
      </Container>
    </ThemeProvider>
  );
}

export default App;