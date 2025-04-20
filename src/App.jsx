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
const variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 }
};
const transition = { duration: 0.3, ease: "easeInOut" };


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// --- RESTORED Default plan ---
const defaultPlan = {
  Monday: { /* ... */ },
  Tuesday: { /* ... */ },
  Wednesday: { /* ... */ },
  Thursday: { /* ... */ },
  Friday: { /* ... */ },
  Saturday: { /* ... */ },
  Sunday: { /* ... */ }
};

// --- RESTORED Default groceries ---
const defaultGroceries = {
  "🍗 Protein": ["12 Eggs", "1.4 kg Chicken breast", "700 g Lean beef", "1.2 kg Greek yogurt", "500 g Protein powder"],
  "🍞 Carbs": ["14 Bananas", "4 Sweet potatoes", "2 kg Potatoes", "300 g Quinoa", "20 Dates"],
  "🥦 Fruits & Veg": ["500 g Strawberries", "300 g Blueberries", "150 g Spinach", "3 Bell peppers", "150 g Arugula", "1 Lettuce head", "6 Figs", "500 g Grapes", "4 Oranges", "5 Apples"],
  "🧂 Condiments": ["150 ml Honey", "20 g Cinnamon", "50 g Pink salt", "100 ml Barbecue sauce", "100 ml Coconut oil", "100 ml Maple syrup"],
  "🍿 Snacks": ["100 g Dark chocolate", "2 bags Popcorn", "3 Granola bars"]
};


// Main App Component
function App() {
  // --- State & Refs (no changes) ---
  const [userPrefs, setUserPrefs] = useState("high protein, gluten-free");
  const [selectedDay, setSelectedDay] = useState(() => localStorage.getItem("selectedDay") || days[new Date().getDay()]);
  const [checkedItemsByDay, setCheckedItemsByDay] = useState(() => { /* ...localStorage */ });
  const [groceryChecked, setGroceryChecked] = useState(() => { /* ...localStorage */ });
  const [dynamicPlan, setDynamicPlan] = useState(() => { /* ...localStorage */ });
  const [dynamicGroceries, setDynamicGroceries] = useState(() => { /* ...localStorage */ });
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();

  // --- Derived State & Memos ---
  const activePlan = dynamicPlan ?? defaultPlan ?? {};
  const activeGroceries = dynamicGroceries ?? defaultGroceries ?? {};
  const currentDayPlan = activePlan[selectedDay] || {};
  const meals = currentDayPlan.meals || [];
  const fitness = currentDayPlan.fitness || "";
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
  const theme = createTheme({ /* ... */ });

  // --- Render ---
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ pt: 2, pb: 4 }}>

        {/* --- Preferences & Actions --- */}
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: '16px' }}>
           {/* ... TextField and Stack with Buttons ... */}
           <TextField /* ... */ />
           <Stack /* ... */ >
             <Button /* Generate */ /* ... */ >{/* ... */}</Button>
             <Button /* Reset */ /* ... */ >{/* ... */}</Button>
           </Stack>
        </Paper>

        {/* --- Day View Container --- */}
        <Box sx={{ position: "relative", mb: 4 }}>
          {/* Day Title and Navigation Buttons */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
             {/* ... IconButtons and Typography ... */}
             <IconButton /* Prev */ /* ... */ />
             <Typography /* ... */ > {selectedDay} </Typography>
             <IconButton /* Next */ /* ... */ />
          </Stack>

          {/* Animated Content Area */}
          <AnimatePresence initial={false} mode='wait'>
            <motion.div key={selectedDay} variants={variants} initial="enter" animate="center" exit="exit" transition={transition} >
              {/* Content Box */}
              <Box sx={{ pb: 2 }}>
                {/* Fitness Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                   <CardContent sx={{ p: 2 }}>
                     {/* ... Fitness content ... */}
                   </CardContent>
                </Card>

                {/* Meals Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                   <CardContent sx={{ p: 2 }}>
                     {/* ... Meals content ... */}
                   </CardContent>
                </Card>

                {/* Progress Bar */}
                <Box sx={{ mb: 2, px: 2 }}>
                   {/* ... Progress content ... */}
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* --- Grocery List --- */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>🛒 Grocery List</Typography>
          <Grid container spacing={2}>
             {Object.keys(activeGroceries).length > 0 ? Object.entries(activeGroceries).map(([category, items]) => (
                 <Grid item xs={12} sm={6} md={4} key={category}>
                     <Card sx={{ height: '100%', boxShadow: 1 }}>
                         {/* --- Increased CardContent Padding --- */}
                         <CardContent sx={{ p: 2.5 }}> {/* Increased padding */}
                             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{category}</Typography>
                             {Array.isArray(items) && items.map((item, i) => (
                               <FormControlLabel
                                 key={i}
                                 // --- Increased Margin Between Items ---
                                 sx={{ display: 'block', mb: 1 }} // Increased margin-bottom
                                 control={ <Checkbox size="small" checked={groceryChecked[item] || false} onChange={() => setGroceryChecked(prev => ({ ...prev, [item]: !prev[item] })) } /> }
                                 label={<Typography variant="body2">{item}</Typography>}
                               />
                             ))}
                         </CardContent>
                     </Card>
                 </Grid>
             )) : (
                <Grid item xs={12}><Typography>No grocery list available.</Typography></Grid>
             )}
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
