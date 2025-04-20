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
// Define a transition for the fade effect
const transition = { duration: 0.3, ease: "easeInOut" };


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
  // const [direction, setDirection] = useState(0); // No longer needed for fade animation
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  // --- REMOVED dayContentHeight state ---
  // --- REMOVED dayContentRef ref ---

  // --- Hooks ---
  const [width, height] = useWindowSize();

  // --- Derived State ---
  const activePlan = dynamicPlan ?? defaultPlan;
  const activeGroceries = dynamicGroceries ?? defaultGroceries;
  const meals = activePlan[selectedDay]?.meals || [];
  const fitness = activePlan[selectedDay]?.fitness || "";
  const checkedItems = checkedItemsByDay[selectedDay] || {};

  // --- Memos ---
  const progress = useMemo(() => { /* ... */ }, [checkedItems, meals]);

  // --- Effects ---
  useEffect(() => { /* ...localStorage sync logic... */ }, [selectedDay, checkedItemsByDay, groceryChecked, dynamicPlan, dynamicGroceries]);
  useEffect(() => { /* ...confetti logic... */ }, [progress, showConfetti]);
  // --- REMOVED useLayoutEffect for height calculation ---


  // --- Handlers ---
  // Renamed handleSwipe to handleChangeDay, simplified logic
  const handleChangeDay = (direction) => { // direction is -1 for prev, 1 for next
    const currentIndex = days.indexOf(selectedDay);
    const newIndex = (currentIndex + direction + days.length) % days.length; // Handles wrap-around
    setSelectedDay(days[newIndex]);
  };

  const handleCheck = (key) => { /* ... */ };
  const resetCustomPlan = () => { /* ... */ };
  const handleGeneratePlan = async () => { /* ... calls /api/generate-plan ... */ };

  // --- Theme ---
  const theme = createTheme({ /* ... */ });

  // --- Render ---
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ pt: 2, pb: 4 }}>

        {/* --- Preferences & Actions --- */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: theme.shape.borderRadius }}>
           {/* ... TextField and Stack with Buttons ... */}
             <TextField /* ... */ />
             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} >
                 <Button /* Generate */ onClick={handleGeneratePlan} /* ... */ >{loadingPlan ? "Generating..." : "Generate Custom Plan"}</Button>
                 <Button /* Reset */ onClick={resetCustomPlan} /* ... */ >Reset to Default</Button>
             </Stack>
        </Paper>
        {/* --- End Preferences & Actions --- */}


        {/* --- Day View Container --- */}
        {/* Removed dynamic height, transition, overflow. Kept relative positioning for AnimatePresence context if needed */}
        <Box sx={{ position: "relative", mb: 4 }}>
          {/* Day Title and Navigation Buttons */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
             <IconButton onClick={() => handleChangeDay(-1)} aria-label="Previous Day" size="small">
                 <ArrowBackIosNewIcon fontSize="inherit" />
             </IconButton>
             <Typography variant="h5" textAlign="center" fontWeight="medium">
               {selectedDay}
             </Typography>
             <IconButton onClick={() => handleChangeDay(1)} aria-label="Next Day" size="small">
                 <ArrowForwardIosIcon fontSize="inherit" />
             </IconButton>
          </Stack>

          {/* Animated Content Area */}
          <AnimatePresence initial={false} mode='wait'> {/* Use mode='wait' for cleaner fade transition */}
            <motion.div
              key={selectedDay} // Key triggers animation on change
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition} // Apply the simple fade transition
              // --- REMOVED drag props ---
              // --- REMOVED style related to absolute positioning ---
            >
              {/* Content Box - No ref needed */}
              <Box sx={{ pb: 2 }}>
                {/* Fitness Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                   <CardContent sx={{ p: 1.5 }}>
                     {/* ... Fitness content ... */}
                       <Typography variant="h6" fontWeight="bold" gutterBottom>🏋️ Fitness</Typography>
                       <FormControlLabel control={ <Checkbox size="small" /*...*/ /> } label={fitness || "..."} /*...*/ />
                   </CardContent>
                </Card>

                {/* Meals Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                   <CardContent sx={{ p: 1.5 }}>
                     {/* ... Meals content ... */}
                       <Typography variant="h6" fontWeight="bold" gutterBottom>🍽️ Meals</Typography>
                       {meals.length > 0 ? meals.map((meal, i) => ( <FormControlLabel key={i} /*...*/ /> )) : ( /*...*/ )}
                   </CardContent>
                </Card>

                {/* Progress Bar */}
                <Box sx={{ mb: 2, px: 1.5 }}>
                   {/* ... Progress content ... */}
                   <Typography variant="body2" sx={{ mb: 1 }}>Daily Progress: {progress}%</Typography>
                   <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
        {/* --- End of Day View --- */}


        {/* --- Grocery List --- */}
        <Box mt={4}> {/* Increased margin-top for more separation */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>🛒 Grocery List</Typography>
          <Grid container spacing={2}>
             {/* ... Grocery grid items ... */}
             {Object.entries(activeGroceries).map(([category, items]) => (
                 <Grid item xs={12} sm={6} md={4} key={category}>
                     <Card sx={{ height: '100%', boxShadow: 1 }}>
                         <CardContent sx={{ p: 1.5 }}>
                             {/* ... Category & Items ... */}
                         </CardContent>
                     </Card>
                 </Grid>
             ))}
          </Grid>
        </Box>
        {/* --- End of Grocery List --- */}

        {/* --- Confetti --- */}
        {showConfetti && ( <Confetti /* ... */ /> )}

      </Container>
    </ThemeProvider>
  );
}

export default App;
