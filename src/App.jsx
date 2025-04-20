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
  enter: { opacity: 0, },
  center: { opacity: 1, },
  exit: { opacity: 0, }
};
// Define a transition for the fade effect
const transition = { duration: 0.3, ease: "easeInOut" };


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Default plan (structure assumed - replace with your actual default)
const defaultPlan = {
  Monday: { fitness: "Default Fitness", meals: [{ name: "Default Meal", recipe: "Default recipe" }] },
  // Add other days...
};

// Default groceries (structure assumed - replace with your actual default)
const defaultGroceries = {
  "Default Category": ["Item 1", "Item 2"],
};


// Main App Component
function App() {
  // --- State ---
  const [userPrefs, setUserPrefs] = useState("high protein, gluten-free");
  const [selectedDay, setSelectedDay] = useState(() => localStorage.getItem("selectedDay") || days[new Date().getDay()]);
  // Assuming localStorage reading logic exists here
  const [checkedItemsByDay, setCheckedItemsByDay] = useState(() => { try { const stored = localStorage.getItem("checkedItemsByDay"); return stored ? JSON.parse(stored) : {}; } catch { return {}; } });
  const [groceryChecked, setGroceryChecked] = useState(() => { try { const stored = localStorage.getItem("groceryChecked"); return stored ? JSON.parse(stored) : {}; } catch { return {}; } });
  const [dynamicPlan, setDynamicPlan] = useState(() => { try { const stored = localStorage.getItem("dynamicPlan"); return stored ? JSON.parse(stored) : null; } catch { return null; } });
  const [dynamicGroceries, setDynamicGroceries] = useState(() => { try { const stored = localStorage.getItem("dynamicGroceries"); return stored ? JSON.parse(stored) : null; } catch { return null; } });

  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // --- Hooks ---
  const [width, height] = useWindowSize();

  // --- Derived State ---
  const activePlan = dynamicPlan ?? defaultPlan;
  const activeGroceries = dynamicGroceries ?? defaultGroceries;
  // Add null checks for safety when accessing nested properties
  const meals = activePlan?.[selectedDay]?.meals || [];
  const fitness = activePlan?.[selectedDay]?.fitness || "";
  const checkedItems = checkedItemsByDay?.[selectedDay] || {};

  // --- Memos ---
  // Restored Progress Calculation Logic
  const progress = useMemo(() => {
    const totalItems = (meals?.length || 0) + 1; // +1 for fitness
    if (totalItems <= 1 && !fitness) return 0; // Handle case with no meals and no fitness activity planned

    const completedMeals = meals?.filter((_, i) => checkedItems[`meal-${i}`]).length || 0;
    const completedFitness = checkedItems["fitness"] ? 1 : 0;
    const totalCompleted = completedMeals + completedFitness;

    // Ensure totalItems is at least 1 if there's fitness, even with 0 meals
    const effectiveTotal = Math.max(totalItems, completedFitness);
    if (effectiveTotal === 0) return 0; // Avoid division by zero

    return Math.round((totalCompleted / effectiveTotal) * 100);
  }, [checkedItems, meals, fitness]); // Added fitness dependency

  // --- Effects ---
  // Assuming localStorage sync logic exists here
  useEffect(() => {
      localStorage.setItem("selectedDay", selectedDay);
      localStorage.setItem("checkedItemsByDay", JSON.stringify(checkedItemsByDay));
      localStorage.setItem("groceryChecked", JSON.stringify(groceryChecked));
      if (dynamicPlan) localStorage.setItem("dynamicPlan", JSON.stringify(dynamicPlan)); else localStorage.removeItem("dynamicPlan");
      if (dynamicGroceries) localStorage.setItem("dynamicGroceries", JSON.stringify(dynamicGroceries)); else localStorage.removeItem("dynamicGroceries");
  }, [selectedDay, checkedItemsByDay, groceryChecked, dynamicPlan, dynamicGroceries]);

  // Assuming confetti logic exists here
  useEffect(() => {
      if (progress === 100 && !showConfetti) {
          setShowConfetti(true);
          const timer = setTimeout(() => setShowConfetti(false), 4000);
          return () => clearTimeout(timer);
      }
  }, [progress, showConfetti]);


  // --- Handlers ---
  const handleChangeDay = (direction) => { // direction is -1 for prev, 1 for next
    const currentIndex = days.indexOf(selectedDay);
    const newIndex = (currentIndex + direction + days.length) % days.length; // Handles wrap-around
    setSelectedDay(days[newIndex]);
  };

  // Assuming handleCheck implementation exists
  const handleCheck = (key) => {
      setCheckedItemsByDay(prev => ({
          ...prev,
          [selectedDay]: {
              ...prev[selectedDay],
              [key]: !prev[selectedDay]?.[key]
          }
      }));
  };

  // Assuming resetCustomPlan implementation exists
  const resetCustomPlan = () => {
      setDynamicPlan(null);
      setDynamicGroceries(null);
  };

  // Assuming handleGeneratePlan implementation exists (calling API)
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
              throw new Error(`API request failed: ${errorData.error || response.statusText}`);
          }
          const { plan: newPlan, grocerySections: newGroceries } = await response.json();
           if (!newPlan || !newGroceries) { throw new Error("Invalid data from API."); }
          setDynamicPlan(newPlan);
          setDynamicGroceries(newGroceries);
      } catch (err) {
          console.error("Failed to fetch plan:", err);
          // TODO: Replace with Snackbar
          console.error(`Error generating plan: ${err.message}`);
      } finally {
          setLoadingPlan(false);
      }
  };

  // --- Theme ---
  // Assuming theme definition exists
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
             {/* Filled TextField props */}
             <TextField
                 fullWidth
                 label="Your Dietary Preferences & Goals"
                 value={userPrefs}
                 onChange={(e) => setUserPrefs(e.target.value)}
                 sx={{ mb: 2 }}
                 variant="outlined"
                 size="small"
             />
             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} >
                 {/* Filled Button props */}
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


        {/* --- Day View Container --- */}
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
                       {/* Filled Fitness FormControlLabel */}
                       <FormControlLabel
                           control={
                               <Checkbox
                                   size="small"
                                   checked={checkedItems["fitness"] || false}
                                   onChange={() => handleCheck("fitness")}
                               />
                           }
                           label={fitness || "No fitness activity planned."}
                           sx={{ display: 'flex', alignItems: 'flex-start', ml: 0 }}
                       />
                   </CardContent>
                </Card>

                {/* Meals Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                   <CardContent sx={{ p: 1.5 }}>
                       <Typography variant="h6" fontWeight="bold" gutterBottom>🍽️ Meals</Typography>
                       {/* Corrected Meals mapping and else condition */}
                       {meals.length > 0 ? meals.map((meal, i) => (
                           <FormControlLabel
                               key={i}
                               sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5, ml: 0 }}
                               control={
                                   <Checkbox
                                       size="small"
                                       checked={checkedItems[`meal-${i}`] || false}
                                       onChange={() => handleCheck(`meal-${i}`)}
                                       sx={{ pt: 0.5 }}
                                   />
                               }
                               label={
                                   <Box>
                                       <Typography fontWeight="bold" variant="body1">{meal.name}</Typography>
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
                <Box sx={{ mb: 2, px: 1.5 }}>
                   {/* Restored Progress content */}
                   <Typography variant="body2" sx={{ mb: 1 }}>
                       Daily Progress: {progress}%
                   </Typography>
                   <LinearProgress
                       variant="determinate"
                       value={progress}
                       sx={{ height: 8, borderRadius: 4 }}
                   />
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
             {/* Restored Grocery mapping */}
             {Object.entries(activeGroceries).map(([category, items]) => (
                 <Grid item xs={12} sm={6} md={4} key={category}>
                     <Card sx={{ height: '100%', boxShadow: 1 }}>
                         <CardContent sx={{ p: 1.5 }}>
                             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{category}</Typography>
                             {/* Restored Item mapping */}
                             {items.map((item, i) => (
                                 <FormControlLabel
                                     key={i}
                                     sx={{ display: 'block', mb: -0.5 }}
                                     control={
                                         <Checkbox
                                             size="small"
                                             checked={groceryChecked[item] || false}
                                             onChange={() => setGroceryChecked(prev => ({ ...prev, [item]: !prev[item] })) }
                                         />
                                     }
                                     label={<Typography variant="body2">{item}</Typography>}
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
        {/* Restored Confetti component */}
        {showConfetti && (
            <Confetti
                width={width}
                height={height}
                numberOfPieces={300}
                recycle={false}
                style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
            />
        )}

      </Container>
    </ThemeProvider>
  );
}

export default App;
