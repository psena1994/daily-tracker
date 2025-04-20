import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from "react";
import {
  AppBar, Toolbar, Typography, Tabs, Tab, Box, Card, CardContent, Checkbox,
  FormControlLabel, Grid, Container, CssBaseline, createTheme, ThemeProvider,
  Divider, LinearProgress, Switch, Grow, Button, TextField, Stack, Paper,
  IconButton,
  GlobalStyles // Import GlobalStyles
} from "@mui/material";
// Import arrow icons
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// Other imports...
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
// Import icons for header
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'; // Import food icon
// Import new colors for the theme
import { teal, amber } from "@mui/material/colors"; // Changed from blueGrey
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { motion, AnimatePresence } from "framer-motion";

// --- Expanded Animation Variants (Fade Only) ---
const variants = {
  enter: {
    opacity: 0, // Start transparent
  },
  center: {
    opacity: 1, // Fade in to fully visible
    // No position: 'absolute', no x transform
  },
  exit: {
    opacity: 0, // Fade out
    // No position: 'absolute', no x transform
  }
};
// Expanded transition for the fade effect
const transition = { duration: 0.3, ease: "easeInOut" };


// Expanded days array
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// --- Expanded Default plan ---
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
    fitness: "🧘‍♂️ Stretchy + short walky",
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

// --- Expanded Default groceries ---
const defaultGroceries = {
  "🍗 Protein": ["12 Eggs", "1.4 kg Chicken breast", "700 g Lean beef", "1.2 kg Greek yogurt", "500 g Protein powder"],
  "🍞 Carbs": ["14 Bananas", "4 Sweet potatoes", "2 kg Potatoes", "300 g Quinoa", "20 Dates"],
  "🥦 Fruits & Veg": ["500 g Strawberries", "300 g Blueberries", "150 g Spinach", "3 Bell peppers", "150 g Arugula", "1 Lettuce head", "6 Figs", "500 g Grapes", "4 Oranges", "5 Apples"],
  "🧂 Condiments": ["150 ml Honey", "20 g Cinnamon", "50 g Pink salt", "100 ml Barbecue sauce", "100 ml Coconut oil", "100 ml Maple syrup"],
  "🍿 Snacks": ["100 g Dark chocolate", "2 bags Popcorn", "3 Granola bars"]
};


// Main App Component
function App() {
  // --- State & Refs ---
  const [userPrefs, setUserPrefs] = useState("high protein, gluten-free");
  const [selectedDay, setSelectedDay] = useState(() => {
      // Expanded localStorage logic for selectedDay
      const storedDay = localStorage.getItem("selectedDay");
      // Validate if the stored day is one of the valid days
      return storedDay && days.includes(storedDay) ? storedDay : days[new Date().getDay()];
  });
  const [checkedItemsByDay, setCheckedItemsByDay] = useState(() => {
     // Expanded localStorage logic for checkedItemsByDay
     try {
       const stored = localStorage.getItem("checkedItemsByDay");
       const parsed = stored ? JSON.parse(stored) : null;
       return typeof parsed === 'object' && parsed !== null ? parsed : {};
     } catch (e) {
       console.error("Failed to parse checkedItemsByDay from localStorage", e);
       return {}; // Return default on error
     }
  });
  const [groceryChecked, setGroceryChecked] = useState(() => {
     // Expanded localStorage logic for groceryChecked
     try {
       const stored = localStorage.getItem("groceryChecked");
       const parsed = stored ? JSON.parse(stored) : null;
       return typeof parsed === 'object' && parsed !== null ? parsed : {};
     } catch (e) {
       console.error("Failed to parse groceryChecked from localStorage", e);
       return {}; // Return default on error
     }
  });
  const [dynamicPlan, setDynamicPlan] = useState(() => {
     // Expanded localStorage logic for dynamicPlan
     try {
       const stored = localStorage.getItem("dynamicPlan");
       const parsed = stored ? JSON.parse(stored) : null;
       return typeof parsed === 'object' && parsed !== null ? parsed : null;
     } catch (e) {
       console.error("Failed to parse dynamicPlan from localStorage", e);
       return null; // Return default on error
     }
  });
  const [dynamicGroceries, setDynamicGroceries] = useState(() => {
     // Expanded localStorage logic for dynamicGroceries
     try {
       const stored = localStorage.getItem("dynamicGroceries");
       const parsed = stored ? JSON.parse(stored) : null;
       return typeof parsed === 'object' && parsed !== null ? parsed : null;
     } catch (e) {
       console.error("Failed to parse dynamicGroceries from localStorage", e);
       return null; // Return default on error
     }
  });
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();

  // --- Derived State & Memos ---
  const activePlan = dynamicPlan ?? defaultPlan ?? {};
  const activeGroceries = dynamicGroceries ?? defaultGroceries ?? {};

  const currentDayPlan = activePlan[selectedDay] || {}; // Default to empty object if day not found
  const meals = currentDayPlan.meals || [];
  const fitness = currentDayPlan.fitness || "";

  const checkedItems = checkedItemsByDay[selectedDay] || {};

  // Expanded progress calculation
  const progress = useMemo(() => {
    // Ensure meals is definitely an array and checkedItems is an object
    const currentMeals = Array.isArray(meals) ? meals : [];
    const currentChecks = typeof checkedItems === 'object' && checkedItems !== null ? checkedItems : {};

    const total = currentMeals.length + (fitness ? 1 : 0);
    if (total === 0) return 0;

    const completedMeals = currentMeals.filter((_, i) => currentChecks[`meal-${i}`]).length;
    const completedFitness = (fitness && currentChecks["fitness"]) ? 1 : 0;

    return Math.round(((completedMeals + completedFitness) / total) * 100);
  }, [checkedItems, meals, fitness]);


  // --- Effects ---
  // Expanded localStorage synchronization effect
  useEffect(() => {
    try {
         localStorage.setItem("selectedDay", selectedDay);
         localStorage.setItem("checkedItemsByDay", JSON.stringify(checkedItemsByDay));
         localStorage.setItem("groceryChecked", JSON.stringify(groceryChecked));
         if (dynamicPlan) {
             localStorage.setItem("dynamicPlan", JSON.stringify(dynamicPlan));
         } else {
             localStorage.removeItem("dynamicPlan");
         }
         if (dynamicGroceries) {
             localStorage.setItem("dynamicGroceries", JSON.stringify(dynamicGroceries));
         } else {
             localStorage.removeItem("dynamicGroceries");
         }
    } catch (e) {
         console.error("Failed to update localStorage", e);
    }
   }, [selectedDay, checkedItemsByDay, groceryChecked, dynamicPlan, dynamicGroceries]);

  // Expanded confetti effect
  useEffect(() => {
    if (progress === 100 && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000); // Show confetti for 4 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount or if progress changes
    }
  }, [progress, showConfetti]);

  // --- Handlers ---
  // Expanded day change handler
  const handleChangeDay = (direction) => { // direction is -1 for prev, 1 for next
    const currentIndex = days.indexOf(selectedDay);
    const newIndex = (currentIndex + direction + days.length) % days.length; // Handles wrap-around
    setSelectedDay(days[newIndex]);
   };

  // Expanded item check handler
  const handleCheck = (key) => {
      setCheckedItemsByDay(prev => {
        const currentDayChecks = prev[selectedDay] || {};
        const newDayChecks = {
          ...currentDayChecks,
          [key]: !currentDayChecks[key] // Toggle the specific key
        };
        return {
          ...prev,
          [selectedDay]: newDayChecks
        };
      });
     };

  // Expanded reset handler
  const resetCustomPlan = () => {
      setDynamicPlan(null);
      setDynamicGroceries(null);
   };

  // Expanded plan generation handler (includes the debug log from earlier)
  const handleGeneratePlan = async () => {
    console.log('Generate button clicked, handleGeneratePlan started...'); // Debug log
    setLoadingPlan(true);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ userPrefs }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(`API request failed: ${response.status} ${errorData.error || ''}`);
      }
      const { plan: newPlan, grocerySections: newGroceries } = await response.json();
       if (!newPlan || !newGroceries || typeof newPlan !== 'object' || typeof newGroceries !== 'object') {
           throw new Error("Received invalid data structure from API.");
       }
      setDynamicPlan(newPlan);
      setDynamicGroceries(newGroceries);
    } catch (err) {
      console.error("Failed to fetch plan:", err);
      // TODO: Replace console.error with a Snackbar or other UI feedback for the user
    } finally {
      setLoadingPlan(false);
    }
  };

  // --- Updated Theme with Teal and Amber ---
  const theme = createTheme({
      palette: {
        mode: "light",
        primary: { main: teal[500], light: teal[300], dark: teal[700], contrastText: '#ffffff', },
        secondary: { main: amber[700], light: amber[300], dark: amber[900], contrastText: 'rgba(0, 0, 0, 0.87)', },
        background: { default: "#f4f7f9", paper: "#ffffff" }
      },
      shape: { borderRadius: 12 }
  });

  // --- Render ---
  return (
    <ThemeProvider theme={theme}>
      {/* AppBar reverted to static for debugging */}
      <AppBar position="static" elevation={1}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <FitnessCenterIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', mx: 1.5 }}>
            Easy Fitness Planner
          </Typography>
          <RestaurantMenuIcon sx={{ ml: 1 }} />
        </Toolbar>
      </AppBar>
      {/* --- End Header --- */}

      <CssBaseline />
      {/* GlobalStyles still commented out for debugging */}
      {/* <GlobalStyles styles={(theme) => ({ body: { background: `linear-gradient(180deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`, backgroundAttachment: 'fixed', minHeight: '100vh', margin: 0, }, })} /> */}

      {/* Container padding reverted for debugging, reduced bottom padding */}
      <Container sx={{ pt: 4, pb: 4 }}> {/* Reduced pb */}

        {/* --- Preferences & Actions --- */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: '16px' }}>
            <TextField fullWidth label="Your Dietary Preferences & Goals" value={userPrefs} onChange={(e) => setUserPrefs(e.target.value)} sx={{ mb: 2 }} variant="outlined" size="small"/>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} >
              <Button variant="contained" disabled={loadingPlan} onClick={handleGeneratePlan} startIcon={loadingPlan ? null : <RestartAltIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }}> {loadingPlan ? "Generating..." : "Generate Custom Plan"} </Button>
              <Button variant="outlined" onClick={resetCustomPlan} sx={{ width: { xs: '100%', sm: 'auto' } }}> Reset to Default </Button>
            </Stack>
        </Paper>

        {/* --- Day View Container --- */}
        <Box sx={{ position: "relative", mb: 4 }}>
          {/* Day Title and Navigation Buttons */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <IconButton onClick={() => handleChangeDay(-1)} aria-label="Previous Day" size="small" sx={{ color: 'text.primary' }}> <ArrowBackIosNewIcon fontSize="inherit" /> </IconButton>
              <Typography variant="h5" textAlign="center" fontWeight="medium" sx={{ color: 'text.primary' }}> {selectedDay} </Typography>
              <IconButton onClick={() => handleChangeDay(1)} aria-label="Next Day" size="small" sx={{ color: 'text.primary' }}> <ArrowForwardIosIcon fontSize="inherit" /> </IconButton>
          </Stack>

          {/* Animated Content Area */}
          <AnimatePresence initial={false} mode='wait'>
            <motion.div key={selectedDay} variants={variants} initial="enter" animate="center" exit="exit" transition={transition} >
              {/* Content Box */}
              <Box sx={{ pb: 2 }}>
                {/* Fitness Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>🏋️ Fitness</Typography>
                      {fitness ? ( <FormControlLabel control={ <Checkbox size="small" /*...*/ /> } label={fitness} /*...*/ /> ) : ( <Typography /*...*/ >No fitness activity planned.</Typography> )}
                    </CardContent>
                </Card>
                {/* Meals Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>🍽️ Meals</Typography>
                      {meals.length > 0 ? meals.map((meal, i) => ( <FormControlLabel key={i} /*...*/ /> )) : ( <Typography /*...*/ >No meals planned.</Typography> )}
                    </CardContent>
                </Card>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* --- Grocery List --- */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'text.primary' }}>🛒 Grocery List</Typography>
          <Grid container spacing={2}>
              {Object.keys(activeGroceries).length > 0 ? Object.entries(activeGroceries).map(([category, items]) => (
                  <Grid item xs={12} sm={6} md={4} key={category}> {/* Using the reverted grid settings */}
                      <Card sx={{ height: '100%', boxShadow: 1 }}>
                          <CardContent sx={{ p: 2.5 }}>
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{category}</Typography>
                              {Array.isArray(items) && items.map((item, i) => ( <FormControlLabel key={i} /*...*/ /> ))}
                          </CardContent>
                      </Card>
                  </Grid>
              )) : ( <Grid item xs={12}><Typography /*...*/ >No grocery list available.</Typography></Grid> )}
          </Grid>
        </Box>

        {/* --- Confetti --- */}
        {showConfetti && ( <Confetti /*...*/ /> )}

      </Container> {/* End Main Content Container */}

      {/* --- DEBUGGING: Static Footer Progress Bar Commented Out --- */}
      {/*
      <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2, px: { xs: 0, sm: 1 } }}>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}> Daily Progress: </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, flexGrow: 1 }} color={progress === 100 ? "secondary" : "primary"} />
            <Typography variant="body2" color="text.primary" fontWeight="medium" sx={{ minWidth: '40px', textAlign: 'right' }}> {progress}% </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      */}

    </ThemeProvider>
  );
}

export default App;
