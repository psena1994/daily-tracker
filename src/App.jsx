import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from "react"; // Added useRef, useLayoutEffect
import {
  AppBar, Toolbar, Typography, Tabs, Tab, Box, Card, CardContent, Checkbox,
  FormControlLabel, Grid, Container, CssBaseline, createTheme, ThemeProvider,
  Divider, LinearProgress, Switch, Grow, Button, TextField, Stack, Paper // Added Paper (optional), Stack
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { blueGrey } from "@mui/material/colors";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { motion, AnimatePresence } from "framer-motion";

// Swipe transition variants - Simplified opacity for smoother height transition
const variants = {
  enter: (dir) => ({
    x: dir > 0 ? -window.innerWidth : window.innerWidth,
    opacity: 0,
    position: "absolute", // Keep absolute for slide effect
    width: "100%"
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "absolute", // Keep absolute for slide effect
    width: "100%"
  },
  exit: (dir) => ({
    x: dir > 0 ? window.innerWidth : -window.innerWidth,
    opacity: 0,
    position: "absolute", // Keep absolute for slide effect
    width: "100%"
  })
};


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Default plan (structure assumed)
const defaultPlan = { /* ... */ };

// Default groceries (structure assumed)
const defaultGroceries = { /* ... */ };


// Main App Component
function App() {
  // --- State ---
  const [userPrefs, setUserPrefs] = useState("high protein, gluten-free");
  const [selectedDay, setSelectedDay] = useState(() => localStorage.getItem("selectedDay") || days[new Date().getDay()]);
  const [checkedItemsByDay, setCheckedItemsByDay] = useState(() => { /* ...localStorage */ });
  const [groceryChecked, setGroceryChecked] = useState(() => { /* ...localStorage */ });
  const [dynamicPlan, setDynamicPlan] = useState(() => { /* ...localStorage */ });
  const [dynamicGroceries, setDynamicGroceries] = useState(() => { /* ...localStorage */ });
  const [direction, setDirection] = useState(0);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dayContentHeight, setDayContentHeight] = useState('auto'); // State for dynamic height

  // --- Refs ---
  const dayContentRef = useRef(null); // Ref to measure the inner content box

  // --- Hooks ---
  const [width, height] = useWindowSize();

  // --- Derived State ---
  const activePlan = dynamicPlan ?? defaultPlan;
  const activeGroceries = dynamicGroceries ?? defaultGroceries;
  const meals = activePlan[selectedDay]?.meals || [];
  const fitness = activePlan[selectedDay]?.fitness || "";
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
  useEffect(() => { /* ...localStorage sync logic... */ }, [selectedDay, checkedItemsByDay, groceryChecked, dynamicPlan, dynamicGroceries]);

  // Confetti Trigger
  useEffect(() => { /* ...confetti logic... */ }, [progress, showConfetti]);

  // --- Dynamic Height Calculation ---
  useLayoutEffect(() => {
    // Measure height after render but before paint when selectedDay or plan changes
    if (dayContentRef.current) {
      const measuredHeight = dayContentRef.current.scrollHeight; // Get the full scroll height
      setDayContentHeight(`${measuredHeight}px`);
    } else {
        setDayContentHeight('auto'); // Fallback
    }
    // Rerun when the day changes OR the plan data changes (meals/fitness might change height)
  }, [selectedDay, activePlan]);


  // --- Handlers ---
  const handleSwipe = (dir) => {
    const currentIndex = days.indexOf(selectedDay);
    let newIndex;
    if (dir === "LEFT") {
      newIndex = (currentIndex + 1) % days.length;
      setDirection(1); // Swiping left means content comes from the right (positive direction)
    } else if (dir === "RIGHT") {
      newIndex = (currentIndex - 1 + days.length) % days.length;
      setDirection(-1); // Swiping right means content comes from the left (negative direction)
    }
    setSelectedDay(days[newIndex]);
  };

  const handleCheck = (key) => { /* ... */ };
  const resetCustomPlan = () => { /* ... */ };

  const handleGeneratePlan = async () => {
    setLoadingPlan(true);
    try {
      const response = await fetch('/api/generate-plan', { /* ... */ });
      if (!response.ok) { /* ... error handling ... */ }
      const { plan: newPlan, grocerySections: newGroceries } = await response.json();
       if (!newPlan || !newGroceries || typeof newPlan !== 'object' || typeof newGroceries !== 'object') {
          throw new Error("Received invalid data structure from API.");
      }
      setDynamicPlan(newPlan);
      setDynamicGroceries(newGroceries);
    } catch (err) {
      console.error("Failed to fetch plan:", err);
      // TODO: Replace alert with a Snackbar or other UI feedback
      // alert(`Error generating plan: ${err.message}`);
      console.error(`Error generating plan: ${err.message}`); // Log error for debugging
    } finally {
      setLoadingPlan(false);
    }
  };

  // --- Theme ---
  const theme = createTheme({
     palette: {
      mode: "light",
      primary: blueGrey,
      background: { default: "#f4f7f9", paper: "#ffffff" } // Slightly adjusted background
    },
    shape: { borderRadius: 12 }
  });

  // --- Render ---
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ pt: 2, pb: 4 }}>

        {/* --- Preferences & Actions --- */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: theme.shape.borderRadius }}> {/* Wrap top controls in Paper */}
          <TextField
            fullWidth
            label="Your Dietary Preferences & Goals"
            value={userPrefs}
            onChange={(e) => setUserPrefs(e.target.value)}
            sx={{ mb: 2 }}
            variant="outlined"
            size="small" // Smaller text field
          />
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5} // Slightly reduced spacing
          >
            <Button
              variant="contained"
              disabled={loadingPlan}
              onClick={handleGeneratePlan}
              startIcon={loadingPlan ? null : <RestartAltIcon />}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {loadingPlan ? "Generating..." : "Generate Custom Plan"}
            </Button>
            <Button
              variant="outlined"
              onClick={resetCustomPlan}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Reset to Default
            </Button>
          </Stack>
        </Paper>
        {/* --- End Preferences & Actions --- */}


        {/* --- Day View Container (Dynamically Sized) --- */}
        <Box
          sx={{
            position: "relative", // Needed for absolute positioning of children
            mb: 4,
            height: dayContentHeight, // Apply dynamic height
            transition: 'height 0.35s ease-in-out', // Smooth height transition
            overflow: 'hidden' // Hide overflow during animation/resize
          }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={selectedDay}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 35 }, // Adjusted damping
                opacity: { duration: 0.3 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7} // Further reduced elasticity
              onDragEnd={(e, { offset, velocity }) => {
                const swipePower = Math.abs(offset.x) * velocity.x;
                 // Increased threshold slightly for less sensitivity
                if (swipePower < -12000) { handleSwipe('LEFT'); }
                else if (swipePower > 12000) { handleSwipe('RIGHT'); }
              }}
              // Style ensures it fills the dynamically sized container
              style={{
                  width: '100%',
                  height: '100%', // Fill the container
                  position: 'absolute',
                  top: 0,
                  left: 0
              }}
            >
              {/* Inner Box for padding & content - THIS is measured */}
              <Box ref={dayContentRef} sx={{ pb: 2 }}> {/* Assign ref here */}
                <Typography variant="h5" textAlign="center" mb={2} fontWeight="medium">
                  {selectedDay}
                </Typography>

                {/* Fitness Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardContent sx={{ p: 1.5 }}> {/* Reduced padding */}
                    <Typography variant="h6" fontWeight="bold" gutterBottom>🏋️ Fitness</Typography>
                    <FormControlLabel
                      control={ <Checkbox size="small" checked={checkedItems["fitness"] || false} onChange={() => handleCheck("fitness")} /> } // Smaller checkbox
                      label={fitness || "No fitness activity planned."}
                      sx={{ display: 'flex', alignItems: 'flex-start', ml: 0 }} // Align items, remove default margin
                    />
                  </CardContent>
                </Card>

                {/* Meals Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardContent sx={{ p: 1.5 }}> {/* Reduced padding */}
                     <Typography variant="h6" fontWeight="bold" gutterBottom>🍽️ Meals</Typography>
                     {meals.length > 0 ? meals.map((meal, i) => (
                       <FormControlLabel
                         key={i}
                         sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5, ml: 0 }} // Align items, reduce margin
                         control={ <Checkbox size="small" checked={checkedItems[`meal-${i}`] || false} onChange={() => handleCheck(`meal-${i}`)} sx={{ pt: 0.5 }}/> }
                         label={
                           <Box>
                             <Typography fontWeight="bold" variant="body1">{meal.name}</Typography> {/* Slightly larger meal name */}
                             <Typography variant="body2" color="text.secondary">{meal.recipe}</Typography>
                           </Box>
                         }
                       />
                     )) : (
                        <Typography variant="body2" color="text.secondary">No meals planned.</Typography>
                     )}
                  </CardContent>
                </Card>

                {/* Progress Bar */}
                <Box sx={{ mb: 2, px: 1.5 }}> {/* Add padding to align with card content */}
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Daily Progress: {progress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>
          {/* Removed the hidden placeholder Box */}
        </Box>
        {/* --- End of Day View --- */}


        {/* --- Grocery List --- */}
        <Box mt={2}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>🛒 Grocery List</Typography>
          <Grid container spacing={2}>
            {Object.entries(activeGroceries).map(([category, items]) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Card sx={{ height: '100%', boxShadow: 1 }}>
                  <CardContent sx={{ p: 1.5 }}> {/* Reduced padding */}
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{category}</Typography>
                    {items.map((item, i) => (
                      <FormControlLabel
                        key={i}
                        sx={{ display: 'block', mb: -0.5 }} // Negative margin to tighten list
                        control={ <Checkbox size="small" checked={groceryChecked[item] || false} onChange={() => setGroceryChecked(prev => ({ ...prev, [item]: !prev[item] })) } /> }
                        label={<Typography variant="body2">{item}</Typography>} // Ensure label uses body2
                      />
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* --- End of Grocery List --- */}

        {/* --- Confetti --- */}
        {showConfetti && ( /* ... confetti component ... */ )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
