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
  enter: { opacity: 0, },
  center: { opacity: 1, },
  exit: { opacity: 0, }
};
// Expanded transition for the fade effect
const transition = { duration: 0.3, ease: "easeInOut" };


// Expanded days array
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// --- Expanded Default plan ---
const defaultPlan = { /* ... */ };

// --- Expanded Default groceries ---
const defaultGroceries = { /* ... */ };


// Main App Component
function App() {
  // --- State, Refs, Hooks, Derived State, Memos, Effects, Handlers (no changes) ---
  const [userPrefs, setUserPrefs] = useState("high protein, gluten-free");
  const [selectedDay, setSelectedDay] = useState(() => { /* ... */ });
  const [checkedItemsByDay, setCheckedItemsByDay] = useState(() => { /* ... */ });
  const [groceryChecked, setGroceryChecked] = useState(() => { /* ... */ });
  const [dynamicPlan, setDynamicPlan] = useState(() => { /* ... */ });
  const [dynamicGroceries, setDynamicGroceries] = useState(() => { /* ... */ });
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();
  const activePlan = dynamicPlan ?? defaultPlan ?? {};
  const activeGroceries = dynamicGroceries ?? defaultGroceries ?? {};
  const currentDayPlan = activePlan[selectedDay] || {};
  const meals = currentDayPlan.meals || [];
  const fitness = currentDayPlan.fitness || "";
  const checkedItems = checkedItemsByDay[selectedDay] || {};
  const progress = useMemo(() => { /* ... */ }, [checkedItems, meals, fitness]);
  useEffect(() => { /* ...localStorage sync logic... */ }, [selectedDay, checkedItemsByDay, groceryChecked, dynamicPlan, dynamicGroceries]);
  useEffect(() => { /* ...confetti logic... */ }, [progress, showConfetti]);
  const handleChangeDay = (direction) => { /* ... */ };
  const handleCheck = (key) => { /* ... */ };
  const resetCustomPlan = () => { /* ... */ };
  const handleGeneratePlan = async () => { /* ... calls /api/generate-plan ... */ };

  // --- Updated Theme with Teal and Amber ---
  const theme = createTheme({ /* ... */ });

  // --- Render ---
  return (
    <ThemeProvider theme={theme}>
      {/* --- Updated: Top Header AppBar position="sticky" --- */}
      {/* Changed position to sticky */}
      <AppBar position="sticky" elevation={1}>
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
      {/* Apply gradient background using GlobalStyles */}
      <GlobalStyles styles={(theme) => ({ /* ... body gradient ... */ })} />

      {/* --- Updated Container Padding --- */}
      {/* Increased pt (top padding) to prevent content hiding under sticky AppBar */}
      {/* Kept pb (bottom padding) for fixed Footer */}
      <Container sx={{ pt: 9, pb: 10 }}>

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

      {/* --- Static Footer Progress Bar --- */}
      {/* This remains position="fixed" */}
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
