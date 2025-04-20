import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from "react";
import {
  AppBar, Toolbar, Typography, Tabs, Tab, Box, Card, CardContent, Checkbox,
  FormControlLabel, Grid, Container, CssBaseline, createTheme, ThemeProvider,
  Divider, LinearProgress, Switch, Grow, Button, TextField, Stack, Paper,
  IconButton // Added IconButton for Nav Buttons
} from "@mui/material";
// Import arrow icons
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// Other imports...
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { blueGrey } from "@mui/material/colors";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { motion, AnimatePresence } from "framer-motion";

// --- Simplified Animation Variants (Fade Only) ---
const variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 }
};
const transition = { duration: 0.3, ease: "easeInOut" };


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// --- Restored Default Plan Data ---
const defaultPlan = {
  Monday: {
    fitness: "🚴‍♂️ Bike commute to work",
    meals: [
      { name: "☕ Morning Fast", recipe: "Black coffee with pink salt and cinnamon." },
      { name: "🍳 2pm Lunch", recipe: "Scrambled 4 eggs + banana + honey." },
      { name: "🍓 Fruits", recipe: "Strawberries and dates." },
      { name: "🥗 Dinner", recipe: "Salad + 2 chicken breasts + potato fries." },
      { name: "🍫 Dessert", recipe: "Dark chocolate or popcorn." }
    ]
  },
  Tuesday: {
    fitness: "🚶 Stretch + 15 min walk post-work",
    meals: [
      { name: "☕ Morning Fast", recipe: "Black coffee with pink salt and cinnamon." },
      { name: "🍳 2pm Lunch", recipe: "4-egg omelet + spinach + banana + honey." },
      { name: "🍎 Fruits", recipe: "Apple + dates." },
      { name: "🥩 Dinner", recipe: "Beef stir-fry + sweet potato fries." },
      { name: "🍫 Dessert", recipe: "Dark chocolate or popcorn." }
    ]
  },
  Wednesday: {
    fitness: "🏋️‍♂️ Bodyweight workout",
    meals: [
      { name: "☕ Morning Fast", recipe: "Black coffee with pink salt and cinnamon." },
      { name: "🍳 2pm Lunch", recipe: "Protein pancakes: 2 eggs + banana + protein powder." },
      { name: "🍐 Fruits", recipe: "Pear + blueberries." },
      { name: "🍗 Dinner", recipe: "Chicken + quinoa + salad." },
      { name: "🍿 Dessert", recipe: "Cocoa-dusted almonds or popcorn." }
    ]
  },
  Thursday: {
    fitness: "🚴‍♀️ Bike commute to work",
    meals: [
      { name: "☕ Morning Fast", recipe: "Black coffee with pink salt and cinnamon." },
      { name: "🍳 2pm Lunch", recipe: "Scrambled eggs + banana + cinnamon + honey." },
      { name: "🍇 Fruits", recipe: "Dates and berries." },
      { name: "🌯 Dinner", recipe: "Chicken lettuce wraps + wedges." },
      { name: "🍫 Dessert", recipe: "Dark chocolate or popcorn." }
    ]
  },
  Friday: {
    // Corrected typo from user's old code
    fitness: "🧘‍♂️ Stretch + short walk",
    meals: [
      { name: "☕ Morning Fast", recipe: "Black coffee with pink salt and cinnamon." },
      { name: "🍳 2pm Lunch", recipe: "Fried eggs + banana in coconut oil." },
      { name: "🍓 Fruits", recipe: "Strawberries and figs." },
      { name: "🥗 Dinner", recipe: "Grilled chicken salad + fries." },
      { name: "🍿 Dessert", recipe: "Granola bar or popcorn." }
    ]
  },
  Saturday: {
    fitness: "🥾 Outdoor hike or long walk",
    meals: [
      { name: "☕ Morning Fast", recipe: "Black coffee with pink salt and cinnamon." },
      { name: "🍳 2pm Lunch", recipe: "Banana-egg scramble + honey." },
      { name: "🍊 Fruits", recipe: "Grapes and 1 orange." },
      { name: "🍗 Dinner", recipe: "Roasted veggies + grilled chicken + fries." },
      { name: "🍫 Dessert", recipe: "Popcorn or dark chocolate." }
    ]
  },
  Sunday: {
    fitness: "🛌 Full rest day with optional stretch",
    meals: [
      { name: "☕ Morning Fast", recipe: "Black coffee with pink salt and cinnamon." },
      { name: "🍳 2pm Lunch", recipe: "Scrambled eggs + mashed banana + maple syrup." },
      { name: "🍓 Fruits", recipe: "Mixed berries + apple." },
      { name: "🥗 Dinner", recipe: "Chicken quinoa bowl + greens." },
      { name: "🍿 Dessert", recipe: "Popcorn or dark chocolate." }
    ]
  }
};
// --- End of Restored Default Plan Data ---

// --- Restored Default Grocery Data ---
const defaultGroceries = {
  "🍗 Protein": [
    "12 Eggs",
    "1.4 kg Chicken breast",
    "700 g Lean beef",
    "1.2 kg Greek yogurt",
    "500 g Protein powder"
  ],
  "🍞 Carbs": [
    "14 Bananas",
    "4 Sweet potatoes",
    "2 kg Potatoes",
    "300 g Quinoa",
    "20 Dates"
  ],
  "🥦 Fruits & Veg": [
    "500 g Strawberries",
    "300 g Blueberries",
    "150 g Spinach",
    "3 Bell peppers",
    "150 g Arugula",
    "1 Lettuce head",
    "6 Figs",
    "500 g Grapes",
    "4 Oranges",
    "5 Apples"
  ],
  "🧂 Condiments": [
    "150 ml Honey",
    "20 g Cinnamon",
    "50 g Pink salt",
    "100 ml Barbecue sauce",
    "100 ml Coconut oil",
    "100 ml Maple syrup"
  ],
  "🍿 Snacks": [
    "100 g Dark chocolate",
    "2 bags Popcorn",
    "3 Granola bars"
  ]
};
// --- End of Restored Default Grocery Data ---


// Main App Component
function App() {
  // --- State ---
  const [userPrefs, setUserPrefs] = useState("high protein, gluten-free");
  const [selectedDay, setSelectedDay] = useState(() => localStorage.getItem("selectedDay") || days[new Date().getDay()]);
  const [checkedItemsByDay, setCheckedItemsByDay] = useState(() => {
     try { const stored = localStorage.getItem("checkedItemsByDay"); return stored ? JSON.parse(stored) : {}; } catch { return {}; }
  });
  const [groceryChecked, setGroceryChecked] = useState(() => {
     try { const stored = localStorage.getItem("groceryChecked"); return stored ? JSON.parse(stored) : {}; } catch { return {}; }
  });
  const [dynamicPlan, setDynamicPlan] = useState(() => {
     try { const stored = localStorage.getItem("dynamicPlan"); return stored ? JSON.parse(stored) : null; } catch { return null; }
  });
  const [dynamicGroceries, setDynamicGroceries] = useState(() => {
     try { const stored = localStorage.getItem("dynamicGroceries"); return stored ? JSON.parse(stored) : null; } catch { return null; }
  });
  // const [direction, setDirection] = useState(0); // No longer needed
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // --- Hooks ---
  const [width, height] = useWindowSize();

  // --- Derived State ---
  // Use the dynamic plan/groceries if they exist, otherwise fall back to the defaults
  const activePlan = dynamicPlan ?? defaultPlan;
  const activeGroceries = dynamicGroceries ?? defaultGroceries;
  // Safely access meals and fitness for the selected day
  const currentDayPlan = activePlan[selectedDay] ?? {}; // Ensure fallback if day is missing
  const meals = currentDayPlan.meals || [];
  const fitness = currentDayPlan.fitness || "";
  const checkedItems = checkedItemsByDay[selectedDay] || {};

  // --- Memos ---
  const progress = useMemo(() => {
      const total = (meals?.length || 0) + 1; // +1 for fitness
      const completedMeals = meals?.filter((_, i) => checkedItems[`meal-${i}`]).length || 0;
      const completedFitness = checkedItems["fitness"] ? 1 : 0;
      return total > 0 ? Math.round(((completedMeals + completedFitness) / total) * 100) : 0;
  }, [checkedItems, meals]);

  // --- Effects ---
  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem("selectedDay", selectedDay);
    localStorage.setItem("checkedItemsByDay", JSON.stringify(checkedItemsByDay));
    localStorage.setItem("groceryChecked", JSON.stringify(groceryChecked));
    // Only store dynamic plan/groceries if they exist
    if (dynamicPlan) localStorage.setItem("dynamicPlan", JSON.stringify(dynamicPlan)); else localStorage.removeItem("dynamicPlan");
    if (dynamicGroceries) localStorage.setItem("dynamicGroceries", JSON.stringify(dynamicGroceries)); else localStorage.removeItem("dynamicGroceries");
  }, [selectedDay, checkedItemsByDay, groceryChecked, dynamicPlan, dynamicGroceries]);

  // Confetti Trigger
  useEffect(() => {
    if (progress === 100 && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [progress, showConfetti]);


  // --- Handlers ---
  const handleChangeDay = (direction) => {
    const currentIndex = days.indexOf(selectedDay);
    const newIndex = (currentIndex + direction + days.length) % days.length;
    setSelectedDay(days[newIndex]);
  };

  const handleCheck = (key) => {
     setCheckedItemsByDay(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [key]: !prev[selectedDay]?.[key]
      }
    }));
  };

  const resetCustomPlan = () => {
    setDynamicPlan(null);
    setDynamicGroceries(null);
    // Local storage removal will happen in the useEffect hook
  };

  const handleGeneratePlan = async () => {
    setLoadingPlan(true);
    try {
      const response = await fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify({ userPrefs }),
       });
      if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API Error Response:", errorData);
          throw new Error(`API request failed: ${errorData.error || response.statusText}`);
      }
      const { plan: newPlan, grocerySections: newGroceries } = await response.json();
       if (!newPlan || !newGroceries || typeof newPlan !== 'object' || typeof newGroceries !== 'object') {
          throw new Error("Received invalid data structure from API.");
      }
      setDynamicPlan(newPlan);
      setDynamicGroceries(newGroceries);
    } catch (err) {
      console.error("Failed to fetch plan:", err);
      // TODO: Replace alert with a Snackbar or other UI feedback
      console.error(`Error generating plan: ${err.message}`);
    } finally {
      setLoadingPlan(false);
    }
  };

  // --- Theme ---
  const theme = createTheme({
     palette: { mode: "light", primary: blueGrey, background: { default: "#f4f7f9", paper: "#ffffff" } },
     shape: { borderRadius: 12 }
   });

  // --- Render ---
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ pt: 2, pb: 4 }}>

        {/* --- Preferences & Actions --- */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: theme.shape.borderRadius }}>
             <TextField fullWidth label="Your Dietary Preferences & Goals" value={userPrefs} onChange={(e) => setUserPrefs(e.target.value)} sx={{ mb: 2 }} variant="outlined" size="small"/>
             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} >
                 <Button variant="contained" disabled={loadingPlan} onClick={handleGeneratePlan} startIcon={loadingPlan ? null : <RestartAltIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }}>{loadingPlan ? "Generating..." : "Generate Custom Plan"}</Button>
                 <Button variant="outlined" onClick={resetCustomPlan} sx={{ width: { xs: '100%', sm: 'auto' } }}>Reset to Default</Button>
             </Stack>
        </Paper>
        {/* --- End Preferences & Actions --- */}


        {/* --- Day View Container --- */}
        <Box sx={{ position: "relative", mb: 4 }}>
          {/* Day Title and Navigation Buttons */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
             <IconButton onClick={() => handleChangeDay(-1)} aria-label="Previous Day" size="small"> <ArrowBackIosNewIcon fontSize="inherit" /> </IconButton>
             <Typography variant="h5" textAlign="center" fontWeight="medium"> {selectedDay} </Typography>
             <IconButton onClick={() => handleChangeDay(1)} aria-label="Next Day" size="small"> <ArrowForwardIosIcon fontSize="inherit" /> </IconButton>
          </Stack>

          {/* Animated Content Area */}
          <AnimatePresence initial={false} mode='wait'>
            <motion.div
              key={selectedDay}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              {/* Content Box */}
              <Box sx={{ pb: 2 }}>
                {/* Fitness Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                   <CardContent sx={{ p: 1.5 }}>
                       <Typography variant="h6" fontWeight="bold" gutterBottom>🏋️ Fitness</Typography>
                       <FormControlLabel control={ <Checkbox size="small" checked={checkedItems["fitness"] || false} onChange={() => handleCheck("fitness")} /> } label={fitness || "No fitness activity planned."} sx={{ display: 'flex', alignItems: 'flex-start', ml: 0 }} />
                   </CardContent>
                </Card>

                {/* Meals Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                   <CardContent sx={{ p: 1.5 }}>
                       <Typography variant="h6" fontWeight="bold" gutterBottom>🍽️ Meals</Typography>
                       {meals.length > 0 ? meals.map((meal, i) => (
                         <FormControlLabel key={i} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5, ml: 0 }} control={ <Checkbox size="small" checked={checkedItems[`meal-${i}`] || false} onChange={() => handleCheck(`meal-${i}`)} sx={{ pt: 0.5 }}/> } label={ <Box> <Typography fontWeight="bold" variant="body1">{meal.name}</Typography> <Typography variant="body2" color="text.secondary">{meal.recipe}</Typography> </Box> } />
                       )) : (
                          <Typography variant="body2" color="text.secondary">No meals planned.</Typography>
                       )}
                   </CardContent>
                </Card>

                {/* Progress Bar */}
                <Box sx={{ mb: 2, px: 1.5 }}>
                   <Typography variant="body2" sx={{ mb: 1 }}> Daily Progress: {progress}% </Typography>
                   <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
        {/* --- End of Day View --- */}


        {/* --- Grocery List --- */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>🛒 Grocery List</Typography>
          <Grid container spacing={2}>
             {Object.entries(activeGroceries).map(([category, items]) => (
                 <Grid item xs={12} sm={6} md={4} key={category}>
                     <Card sx={{ height: '100%', boxShadow: 1 }}>
                         <CardContent sx={{ p: 1.5 }}>
                             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{category}</Typography>
                             {items.map((item, i) => (
                               <FormControlLabel key={i} sx={{ display: 'block', mb: -0.5 }} control={ <Checkbox size="small" checked={groceryChecked[item] || false} onChange={() => setGroceryChecked(prev => ({ ...prev, [item]: !prev[item] })) } /> } label={<Typography variant="body2">{item}</Typography>} />
                             ))}
                         </CardContent>
                     </Card>
                 </Grid>
             ))}
          </Grid>
        </Box>
        {/* --- End of Grocery List --- */}

        {/* --- Confetti --- */}
        {showConfetti && ( <Confetti width={width} height={height} numberOfPieces={300} recycle={false} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }} /> )}

      </Container>
    </ThemeProvider>
  );
}

export default App;
