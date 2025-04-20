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

// Simplified Animation Variants (Fade Only)
const variants = { /* ... (no changes) ... */ };
const transition = { duration: 0.3, ease: "easeInOut" };


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Default plan (structure assumed)
const defaultPlan = { /* ... */ };

// Default groceries (structure assumed)
const defaultGroceries = { /* ... */ };


// Main App Component
function App() {
  // --- State & Refs (no changes) ---
  const [userPrefs, setUserPrefs] = useState("high protein, gluten-free");
  const [selectedDay, setSelectedDay] = useState(() => localStorage.getItem("selectedDay") || days[new Date().getDay()]);
  const [checkedItemsByDay, setCheckedItemsByDay] = useState(() => { /* ...localStorage */ });
  const [groceryChecked, setGroceryChecked] = useState(() => { /* ...localStorage */ });
  const [dynamicPlan, setDynamicPlan] = useState(() => { /* ...localStorage */ });
  const [dynamicGroceries, setDynamicGroceries] = useState(() => { /* ...localStorage */ });
  // const [direction, setDirection] = useState(0); // Still not needed
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();

  // --- Derived State & Memos (no changes) ---
  const activePlan = dynamicPlan ?? defaultPlan;
  const activeGroceries = dynamicGroceries ?? defaultGroceries;
  const meals = activePlan[selectedDay]?.meals || [];
  const fitness = activePlan[selectedDay]?.fitness || "";
  const checkedItems = checkedItemsByDay[selectedDay] || {};
  const progress = useMemo(() => { /* ... */ }, [checkedItems, meals]);

  // --- Effects (no changes) ---
  useEffect(() => { /* ...localStorage sync logic... */ }, [selectedDay, checkedItemsByDay, groceryChecked, dynamicPlan, dynamicGroceries]);
  useEffect(() => { /* ...confetti logic... */ }, [progress, showConfetti]);

  // --- Handlers (no changes) ---
  const handleChangeDay = (direction) => { /* ... */ };
  const handleCheck = (key) => { /* ... */ };
  const resetCustomPlan = () => { /* ... */ };
  const handleGeneratePlan = async () => { /* ... calls /api/generate-plan ... */ };

  // --- Theme ---
  const theme = createTheme({
     palette: { /* ... */ },
     shape: { borderRadius: 12 } // Base border radius
  });

  // --- Render ---
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ pt: 2, pb: 4 }}>

        {/* --- Preferences & Actions --- */}
        {/* Increased border radius for a softer look */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: '16px' }}> {/* Applied specific borderRadius */}
           <TextField
             fullWidth
             label="Your Dietary Preferences & Goals"
             value={userPrefs}
             onChange={(e) => setUserPrefs(e.target.value)}
             sx={{ mb: 2 }}
             variant="outlined"
             size="small"
           />
           <Stack
             direction={{ xs: 'column', sm: 'row' }}
             spacing={1.5}
           >
             <Button variant="contained" disabled={loadingPlan} onClick={handleGeneratePlan} startIcon={loadingPlan ? null : <RestartAltIcon />} sx={{ width: { xs: '100%', sm: 'auto' } }}>
               {loadingPlan ? "Generating..." : "Generate Custom Plan"}
             </Button>
             <Button variant="outlined" onClick={resetCustomPlan} sx={{ width: { xs: '100%', sm: 'auto' } }}>
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
                   {/* Increased padding in CardContent */}
                   <CardContent sx={{ p: 2 }}>
                     <Typography variant="h6" fontWeight="bold" gutterBottom>🏋️ Fitness</Typography>
                     <FormControlLabel
                       control={ <Checkbox size="small" checked={checkedItems["fitness"] || false} onChange={() => handleCheck("fitness")} /> }
                       label={fitness || "No fitness activity planned."}
                       sx={{ display: 'flex', alignItems: 'flex-start', ml: 0 }}
                     />
                   </CardContent>
                </Card>

                {/* Meals Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                   {/* Increased padding in CardContent */}
                   <CardContent sx={{ p: 2 }}>
                     <Typography variant="h6" fontWeight="bold" gutterBottom>🍽️ Meals</Typography>
                     {meals.length > 0 ? meals.map((meal, i) => (
                       <FormControlLabel
                         key={i}
                         sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, ml: 0 }} // Added slightly more margin-bottom
                         control={ <Checkbox size="small" checked={checkedItems[`meal-${i}`] || false} onChange={() => handleCheck(`meal-${i}`)} sx={{ pt: 0.5 }}/> }
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
                <Box sx={{ mb: 2, px: 2 }}> {/* Match padding with CardContent */}
                   <Typography variant="body2" sx={{ mb: 1 }}>
                     Daily Progress: {progress}%
                   </Typography>
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
                         {/* Increased padding in CardContent */}
                         <CardContent sx={{ p: 2 }}>
                             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{category}</Typography>
                             {items.map((item, i) => (
                               <FormControlLabel
                                 key={i}
                                 // Adjusted margin for better spacing between grocery items
                                 sx={{ display: 'block', mb: 0.5 }}
                                 control={ <Checkbox size="small" checked={groceryChecked[item] || false} onChange={() => setGroceryChecked(prev => ({ ...prev, [item]: !prev[item] })) } /> }
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
        {showConfetti && ( <Confetti width={width} height={height} /* ... */ /> )}

      </Container>
    </ThemeProvider>
  );
}

export default App;
