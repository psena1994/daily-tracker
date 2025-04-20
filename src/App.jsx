import React, { useState, useMemo, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Tabs, Tab, Box, Card, CardContent, Checkbox,
  FormControlLabel, Grid, Container, CssBaseline, createTheme, ThemeProvider,
  Divider, LinearProgress, Switch, Grow, Button, TextField, Stack // Added Stack
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { blueGrey } from "@mui/material/colors";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { motion, AnimatePresence } from "framer-motion";

// Swipe transition variants (No changes needed here)
const variants = {
  enter: (dir) => ({
    x: dir > 0 ? -window.innerWidth : window.innerWidth,
    opacity: 0, // Fade in
    position: "absolute",
    width: "100%"
  }),
  center: {
    x: 0,
    opacity: 1, // Fully visible
    position: "absolute",
    width: "100%"
  },
  exit: (dir) => ({
    x: dir > 0 ? window.innerWidth : -window.innerWidth,
    opacity: 0, // Fade out
    position: "absolute",
    width: "100%"
  })
};


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Default plan (No changes needed here)
const defaultPlan = {
  Monday: { fitness: "🚴‍♂️ Bike commute to work", meals: [ /*...*/ ] },
  Tuesday: { fitness: "🚶 Stretch + 15 min walk post-work", meals: [ /*...*/ ] },
  Wednesday: { fitness: "🏋️‍♂️ Bodyweight workout", meals: [ /*...*/ ] },
  Thursday: { fitness: "🚴‍♀️ Bike commute to work", meals: [ /*...*/ ] },
  Friday: { fitness: "🧘‍♂️ Stretchy + short walky", meals: [ /*...*/ ] },
  Saturday: { fitness: "🥾 Outdoor hike or long walk", meals: [ /*...*/ ] },
  Sunday: { fitness: "🛌 Full rest day with optional stretch", meals: [ /*...*/ ] }
};

// Default groceries (No changes needed here)
const defaultGroceries = {
  "🍗 Protein": ["12 Eggs", "1.4 kg Chicken breast", "700 g Lean beef", "1.2 kg Greek yogurt", "500 g Protein powder"],
  "🍞 Carbs": ["14 Bananas", "4 Sweet potatoes", "2 kg Potatoes", "300 g Quinoa", "20 Dates"],
  "🥦 Fruits & Veg": ["500 g Strawberries", "300 g Blueberries", "150 g Spinach", "3 Bell peppers", "150 g Arugula", "1 Lettuce head", "6 Figs", "500 g Grapes", "4 Oranges", "5 Apples"],
  "🧂 Condiments": ["150 ml Honey", "20 g Cinnamon", "50 g Pink salt", "100 ml Barbecue sauce", "100 ml Coconut oil", "100 ml Maple syrup"],
  "🍿 Snacks": ["100 g Dark chocolate", "2 bags Popcorn", "3 Granola bars"]
};


// Main App Component
function App() {
  // State variables (No changes needed here)
  const [userPrefs, setUserPrefs] = useState("high protein, gluten-free");
  const [selectedDay, setSelectedDay] = useState(() => localStorage.getItem("selectedDay") || days[new Date().getDay()]);
  const [checkedItemsByDay, setCheckedItemsByDay] = useState(() => { /* ...localStorage */ });
  const [groceryChecked, setGroceryChecked] = useState(() => { /* ...localStorage */ });
  const [dynamicPlan, setDynamicPlan] = useState(() => { /* ...localStorage */ });
  const [dynamicGroceries, setDynamicGroceries] = useState(() => { /* ...localStorage */ });
  const [direction, setDirection] = useState(0);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();

  // Derived state (No changes needed here)
  const activePlan = dynamicPlan ?? defaultPlan;
  const activeGroceries = dynamicGroceries ?? defaultGroceries;
  const meals = activePlan[selectedDay]?.meals || [];
  const fitness = activePlan[selectedDay]?.fitness || "";
  const checkedItems = checkedItemsByDay[selectedDay] || {};

  // progress calculation (No changes needed here)
  const progress = useMemo(() => { /* ... */ }, [checkedItems, meals]);

  // useEffect hooks for localStorage and confetti (No changes needed here)
  useEffect(() => { /* ...localStorage */ }, [selectedDay, checkedItemsByDay, groceryChecked, dynamicPlan, dynamicGroceries]);
  useEffect(() => { /* ...confetti */ }, [progress, showConfetti]);

  // handleSwipe function (No changes needed here)
  const handleSwipe = (dir) => { /* ... */ };

  // handleCheck function (No changes needed here)
  const handleCheck = (key) => { /* ... */ };

  // resetCustomPlan function (No changes needed here)
  const resetCustomPlan = () => { /* ... */ };

  // handleGeneratePlan function (No changes needed here)
  const handleGeneratePlan = async () => { /* ... calls /api/generate-plan ... */ };

  // theme definition (No changes needed here)
  const theme = createTheme({
    palette: { /* ... */ },
    shape: { borderRadius: 12 }
  });

  // --- Component Return (JSX) ---
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Main container with vertical padding */}
      <Container sx={{ pt: 2, pb: 4 }}> {/* Reduced top padding, kept bottom */}

        {/* Preferences Input */}
        <TextField
          fullWidth
          label="Your Dietary Preferences & Goals"
          value={userPrefs}
          onChange={(e) => setUserPrefs(e.target.value)}
          sx={{ mb: 2 }} // Keep bottom margin
          variant="outlined"
        />

        {/* Action Buttons - Using Stack for better layout */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }} // Stack vertically on extra-small, row otherwise
          spacing={2} // Consistent spacing
          sx={{ mb: 4 }} // Bottom margin before next section
        >
          <Button
            variant="contained"
            disabled={loadingPlan}
            onClick={handleGeneratePlan}
            startIcon={loadingPlan ? null : <RestartAltIcon />}
            // Allow button to take full width on mobile when stacked
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {loadingPlan ? "Generating..." : "Generate Custom Plan"}
          </Button>
          <Button
            variant="outlined"
            onClick={resetCustomPlan}
            // Allow button to take full width on mobile when stacked
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Reset to Default
          </Button>
        </Stack>
        {/* --- End of Action Buttons --- */}


        {/* Day view container - Relative positioning, manage spacing with margin */}
        {/* Removed minHeight and overflow: hidden */}
        <Box sx={{ position: "relative", mb: 4 }}> {/* Added bottom margin to create space */}
          {/* AnimatePresence needs a direct child for key prop */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={selectedDay} // Key triggers animation on change
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8} // Slightly reduced elasticity
              onDragEnd={(e, { offset, velocity }) => {
                const swipePower = Math.abs(offset.x) * velocity.x;
                if (swipePower < -10000) { handleSwipe('LEFT'); }
                else if (swipePower > 10000) { handleSwipe('RIGHT'); }
              }}
              // Style needed for absolute positioning during animation
              style={{ width: '100%', position: 'absolute', top: 0, left: 0 }}
            >
              {/* Inner Box for padding and content */}
              {/* This Box defines the visible content for the day */}
              <Box sx={{ pb: 2 }}> {/* Add some padding at the bottom of the day's content */}
                <Typography variant="h5" textAlign="center" mb={2} fontWeight="medium">
                  {selectedDay}
                </Typography>

                {/* Fitness Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}> {/* Slightly reduced shadow */}
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>🏋️ Fitness</Typography>
                    <FormControlLabel
                      control={ <Checkbox checked={checkedItems["fitness"] || false} onChange={() => handleCheck("fitness")} /> }
                      label={fitness || "No fitness activity planned."}
                      sx={{ display: 'flex', alignItems: 'flex-start' }} // Align items better if label wraps
                    />
                  </CardContent>
                </Card>

                {/* Meals Card */}
                <Card sx={{ mb: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>🍽️ Meals</Typography>
                    {meals.length > 0 ? meals.map((meal, i) => (
                      <FormControlLabel
                        key={i}
                        sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }} // Align items, add margin
                        control={ <Checkbox checked={checkedItems[`meal-${i}`] || false} onChange={() => handleCheck(`meal-${i}`)} sx={{ pt: 0.5 }}/> } // Adjust checkbox padding
                        label={
                          <Box>
                            <Typography fontWeight="bold">{meal.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{meal.recipe}</Typography>
                          </Box>
                        }
                      />
                    )) : (
                       <Typography variant="body2" color="text.secondary">No meals planned for this day.</Typography>
                    )}
                  </CardContent>
                </Card>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Daily Progress: {progress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>
          {/* Placeholder Box to reserve space based on typical content height */}
          {/* This helps prevent the grocery list jumping up too much */}
          {/* Adjust height based on testing average content size */}
          <Box sx={{ visibility: 'hidden', minHeight: '450px' }} aria-hidden="true">
             {/* Render minimal content structure to estimate height */}
             <Typography variant="h5" mb={2}>&nbsp;</Typography>
             <Card sx={{ mb: 2 }}><CardContent><Typography variant="h6" gutterBottom>&nbsp;</Typography></CardContent></Card>
             <Card sx={{ mb: 2 }}><CardContent><Typography variant="h6" gutterBottom>&nbsp;</Typography></CardContent></Card>
             <Box sx={{ mb: 2 }}><Typography variant="body2" sx={{ mb: 1 }}>&nbsp;</Typography><LinearProgress variant="determinate" value={0} /></Box>
          </Box>
        </Box>
        {/* --- End of Day View --- */}


        {/* Grocery List */}
        <Box mt={2}> {/* Reduced margin top slightly */}
          <Typography variant="h6" gutterBottom>🛒 Grocery List</Typography>
          <Grid container spacing={2}>
            {Object.entries(activeGroceries).map(([category, items]) => (
              // Keep xs={12} for full width on mobile
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Card sx={{ height: '100%', boxShadow: 1 }}> {/* Lighter shadow */}
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{category}</Typography>
                    {items.map((item, i) => (
                      <FormControlLabel
                        key={i}
                        sx={{ display: 'block' }}
                        control={ <Checkbox size="small" checked={groceryChecked[item] || false} onChange={() => setGroceryChecked(prev => ({ ...prev, [item]: !prev[item] })) } /> }
                        label={item}
                      />
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* --- End of Grocery List --- */}

        {/* Confetti (fixed position) */}
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
