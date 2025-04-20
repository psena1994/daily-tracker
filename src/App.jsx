// Add useMemo to imports
import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from "react";
import {
  AppBar, Toolbar, Typography, Tabs, Tab, Box, Card, CardContent, Checkbox,
  FormControlLabel, Grid, Container, CssBaseline, createTheme, ThemeProvider,
  Divider, LinearProgress, Switch, Grow, Button, TextField, Stack, Paper,
  IconButton,
  GlobalStyles,
  // --- Accordion Imports ---
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
// --- Icon Imports ---
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Icon for Accordion
// Other imports...
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
// Import icons for header (from user's code)
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'; // Import food icon
// Import new colors for the theme (from user's code)
import { teal, amber } from "@mui/material/colors";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { motion, AnimatePresence } from "framer-motion";

// Animation Variants
const variants = {
  enter: { opacity: 0, },
  center: { opacity: 1, },
  exit: { opacity: 0, }
};
// Transition
const transition = { duration: 0.2, ease: "easeInOut" };

// Days array
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Default plan
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

// Default groceries
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
  const [selectedDate, setSelectedDate] = useState(() => {
      const storedDateString = localStorage.getItem("selectedDate"); // Look for stored date string
      if (storedDateString) {
          const storedDate = new Date(storedDateString);
          // Basic validation: Check if it's a valid date
          if (!isNaN(storedDate.getTime())) {
              storedDate.setHours(0, 0, 0, 0); // Normalize time
              return storedDate;
          }
      }
      // Default to today, ensuring time is reset
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
  });
  const [checkedItemsByDay, setCheckedItemsByDay] = useState(() => {
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
  const selectedDayName = useMemo(() => days[selectedDate.getDay()], [selectedDate]);
  const currentDayPlan = activePlan[selectedDayName] || {};
  const meals = currentDayPlan.meals || [];
  const fitness = currentDayPlan.fitness || "";
  const checkedItems = checkedItemsByDay[selectedDayName] || {};
  const progress = useMemo(() => {
    const currentMeals = Array.isArray(meals) ? meals : [];
    const currentChecks = typeof checkedItems === 'object' && checkedItems !== null ? checkedItems : {};
    const total = currentMeals.length + (fitness ? 1 : 0);
    if (total === 0) return 0;
    const completedMeals = currentMeals.filter((_, i) => currentChecks[`meal-${i}`]).length;
    const completedFitness = (fitness && currentChecks["fitness"]) ? 1 : 0;
    return Math.round(((completedMeals + completedFitness) / total) * 100);
  }, [checkedItems, meals, fitness]);


  // --- Effects ---
  useEffect(() => {
    try {
         localStorage.setItem("selectedDate", selectedDate.toISOString());
         localStorage.setItem("checkedItemsByDay", JSON.stringify(checkedItemsByDay));
         localStorage.setItem("groceryChecked", JSON.stringify(groceryChecked));
         if (dynamicPlan) { localStorage.setItem("dynamicPlan", JSON.stringify(dynamicPlan)); } else { localStorage.removeItem("dynamicPlan"); }
         if (dynamicGroceries) { localStorage.setItem("dynamicGroceries", JSON.stringify(dynamicGroceries)); } else { localStorage.removeItem("dynamicGroceries"); }
    } catch (e) { console.error("Failed to update localStorage", e); }
   }, [selectedDate, checkedItemsByDay, groceryChecked, dynamicPlan, dynamicGroceries]);

  useEffect(() => {
    if (progress === 100 && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [progress, showConfetti]);

  // --- Handlers ---
  const handleChangeDay = (direction) => {
    setSelectedDate(currentDate => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + direction);
        return newDate;
    });
   };
  const handleCheck = (key) => {
      setCheckedItemsByDay(prev => {
        const currentDayChecks = prev[selectedDayName] || {};
        const newDayChecks = { ...currentDayChecks, [key]: !currentDayChecks[key] };
        return { ...prev, [selectedDayName]: newDayChecks };
      });
     };
  const resetCustomPlan = () => {
      setDynamicPlan(null);
      setDynamicGroceries(null);
   };
  const handleGeneratePlan = async () => {
    console.log('Generate button clicked, handleGeneratePlan started...');
    setLoadingPlan(true);
    try {
      const response = await fetch('/api/generate-plan', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify({ userPrefs }), });
      if (!response.ok) { const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' })); throw new Error(`API request failed: ${response.status} ${errorData.error || ''}`); }
      const { plan: newPlan, grocerySections: newGroceries } = await response.json();
       if (!newPlan || !newGroceries || typeof newPlan !== 'object' || typeof newGroceries !== 'object') { throw new Error("Received invalid data structure from API."); }
      setDynamicPlan(newPlan);
      setDynamicGroceries(newGroceries);
    } catch (err) { console.error("Failed to fetch plan:", err); /* TODO: Snackbar feedback */ }
    finally { setLoadingPlan(false); }
  };

  // --- Theme ---
  const theme = createTheme({
      palette: {
        mode: "light",
        primary: { main: teal[500], light: teal[300], dark: teal[700], contrastText: '#ffffff', },
        secondary: { main: amber[700], light: amber[300], dark: amber[900], contrastText: 'rgba(0, 0, 0, 0.87)', },
        background: { default: "#f4f7f9", paper: "#ffffff" }
      },
      shape: { borderRadius: 12 }
  });

  // --- Helper function to format date display ---
  const formatDateDisplay = (date) => {
      return date.toLocaleDateString(navigator.language || 'en-US', {
          weekday: 'long',
          day: 'numeric'
      });
  };

  // --- Render ---
  return (
    <ThemeProvider theme={theme}>
      {/* Header */}
      <AppBar position="sticky" elevation={1}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <FitnessCenterIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', mx: 1.5 }}>
            Easy Fitness Planner
          </Typography>
          <RestaurantMenuIcon sx={{ ml: 1 }} />
        </Toolbar>
      </AppBar>

      <CssBaseline />
      {/* Gradient Background */}
      <GlobalStyles
        styles={(theme) => ({
          body: {
            background: `linear-gradient(180deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            margin: 0,
          },
        })}
      />

      {/* Main Content Container */}
      <Container sx={{ pt: 7, pb: 10 }}>

        {/* Preferences & Actions */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: '16px' }}>
            <TextField fullWidth label="Your Dietary Preferences & Goals" value={userPrefs} onChange={(e) => setUserPrefs(e.target.value)} sx={{ mb: 2 }} variant="outlined" size="small"/>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} >
              <Button variant="contained" disabled={loadingPlan} onClick={handleGeneratePlan} startIcon={loadingPlan ? null : <RestartAltIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }}> {loadingPlan ? "Generating..." : "Generate Custom Plan"} </Button>
              <Button variant="outlined" onClick={resetCustomPlan} sx={{ width: { xs: '100%', sm: 'auto' } }}> Reset to Default </Button>
            </Stack>
        </Paper>

        {/* Day View Container */}
        <Box sx={{ position: "relative", mb: 2 }}>
          {/* Day Title and Navigation Buttons */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <IconButton onClick={() => handleChangeDay(-1)} aria-label="Previous Day" size="small" sx={{ color: 'text.primary' }}> <ArrowBackIosNewIcon fontSize="inherit" /> </IconButton>
              <Typography variant="h5" textAlign="center" fontWeight="bold" sx={{ color: 'text.primary' }}>
                 {formatDateDisplay(selectedDate)}
              </Typography>
              <IconButton onClick={() => handleChangeDay(1)} aria-label="Next Day" size="small" sx={{ color: 'text.primary' }}> <ArrowForwardIosIcon fontSize="inherit" /> </IconButton>
          </Stack>

          {/* Animated Content Area */}
          <AnimatePresence initial={false} mode='wait'>
            <motion.div key={selectedDate.toISOString()} variants={variants} initial="enter" animate="center" exit="exit" transition={transition} >
              {/* Content Box */}
              <Box sx={{ pb: 2 }}>
                {/* Fitness Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>🏋️ Fitness</Typography>
                      {fitness ? (
                         <FormControlLabel control={ <Checkbox size="small" checked={checkedItems["fitness"] || false} onChange={() => handleCheck("fitness")} /> } label={fitness} sx={{ display: 'flex', alignItems: 'flex-start', ml: 0 }} />
                       ) : (
                         <Typography variant="body2" color="text.secondary">No fitness activity planned.</Typography>
                       )}
                    </CardContent>
                </Card>
                {/* Meals Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>🍽️ Meals</Typography>
                      {meals.length > 0 ? meals.map((meal, i) => (
                         <FormControlLabel key={i} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, ml: 0 }} control={ <Checkbox size="small" checked={checkedItems[`meal-${i}`] || false} onChange={() => handleCheck(`meal-${i}`)} sx={{ pt: 0.5 }}/> } label={ <Box> <Typography fontWeight="bold" variant="body1">{meal.name}</Typography> <Typography variant="body2" color="text.secondary">{meal.recipe}</Typography> </Box> } />
                       )) : (
                         <Typography variant="body2" color="text.secondary">No meals planned.</Typography>
                       )}
                    </CardContent>
                </Card>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
        {/* End of Day View */}


        {/* Grocery List (Accordion) */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, color: 'text.primary' }}>🛒 Grocery List</Typography>
          {Object.keys(activeGroceries).length > 0 ? Object.entries(activeGroceries).map(([category, items], index) => (
            <Accordion
              key={category}
              disableGutters
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                '&:not(:last-child)': { borderBottom: 0, },
                '&:before': { display: 'none', },
                mb: 1,
                borderRadius: `${theme.shape.borderRadius}px !important`,
                overflow: 'hidden'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`grocery-panel-content-${index}`}
                id={`grocery-panel-header-${index}`}
                sx={{
                    backgroundColor: 'rgba(0, 0, 0, .03)',
                    minHeight: 48,
                    '& .MuiAccordionSummary-content': { margin: '12px 0', fontWeight: 'bold' },
                }}
              >
                <Typography>{category}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                 {Array.isArray(items) && items.map((item, i) => (
                   <FormControlLabel
                     key={i}
                     sx={{ mb: 0.5 }}
                     control={ <Checkbox size="small" checked={groceryChecked[item] || false} onChange={() => setGroceryChecked(prev => ({ ...prev, [item]: !prev[item] })) } /> }
                     label={<Typography variant="body2">{item}</Typography>}
                   />
                 ))}
              </AccordionDetails>
            </Accordion>
          )) : (
             <Typography sx={{ color: 'text.secondary' }}>No grocery list available.</Typography>
           )}
        </Box>
        {/* End of Grocery List */}

        {/* Confetti */}
        {showConfetti && ( <Confetti width={width} height={height} numberOfPieces={300} recycle={false} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }} /> )}

      </Container> {/* End Main Content Container */}

      {/* Footer Progress Bar */}
      <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2, px: { xs: 0, sm: 1 } }}>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}> Daily Progress: </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, flexGrow: 1 }} color={progress === 100 ? "secondary" : "primary"} />
            <Typography variant="body2" color="text.primary" fontWeight="medium" sx={{ minWidth: '40px', textAlign: 'right' }}> {progress}% </Typography>
          </Box>
        </Toolbar>
      </AppBar>

    </ThemeProvider>
  );
}

export default App;
