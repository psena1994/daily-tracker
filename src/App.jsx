import React, { useState, useMemo, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Tabs, Tab, Box, Card, CardContent, Checkbox,
  FormControlLabel, Grid, Container, CssBaseline, createTheme, ThemeProvider,
  Divider, LinearProgress, Switch, Grow, Button, TextField
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { blueGrey } from "@mui/material/colors";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { motion, AnimatePresence } from "framer-motion";
import OpenAI from "openai";

// OpenAI setup
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});


// Swipe transition vrnt
const variants = {
  enter: (dir) => ({
    x: dir > 0 ? -window.innerWidth : window.innerWidth,
    position: "absolute",
    width: "100%"
  }),
  center: {
    x: 0,
    position: "absolute",
    width: "100%"
  },
  exit: (dir) => ({
    x: dir > 0 ? window.innerWidth : -window.innerWidth,
    position: "absolute",
    width: "100%"
  })
};

const fetchCustomPlan = async (userPrefs) => {
  const prompt = `
You are a meal planner and fitness assistant. Based on the following preferences, generate a full 7-day plan with meals and fitness. Also, provide a categorized grocery list.

Preferences: ${userPrefs}

Output as valid JSON:
{
  "plan": {
    "Monday": {
      "fitness": "...",
      "meals": [
        { "name": "...", "recipe": "..." }
      ]
    },
    ...
  },
  "grocerySections": {
    "Category": ["item1", "item2"]
  }
}`;
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });
  return JSON.parse(response.data.choices[0].message.content);
};

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Default plan (same as original)
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

const defaultGroceries = {
  "🍗 Protein": ["12 Eggs", "1.4 kg Chicken breast", "700 g Lean beef", "1.2 kg Greek yogurt", "500 g Protein powder"],
  "🍞 Carbs": ["14 Bananas", "4 Sweet potatoes", "2 kg Potatoes", "300 g Quinoa", "20 Dates"],
  "🥦 Fruits & Veg": ["500 g Strawberries", "300 g Blueberries", "150 g Spinach", "3 Bell peppers", "150 g Arugula", "1 Lettuce head", "6 Figs", "500 g Grapes", "4 Oranges", "5 Apples"],
  "🧂 Condiments": ["150 ml Honey", "20 g Cinnamon", "50 g Pink salt", "100 ml Barbecue sauce", "100 ml Coconut oil", "100 ml Maple syrup"],
  "🍿 Snacks": ["100 g Dark chocolate", "2 bags Popcorn", "3 Granola bars"]
};

function App() {
  const [userPrefs, setUserPrefs] = useState("high protein, gluten-free");
  const [selectedDay, setSelectedDay] = useState(() => localStorage.getItem("selectedDay") || days[new Date().getDay()]);
  const [checkedItemsByDay, setCheckedItemsByDay] = useState(() => {
    try {
      const stored = localStorage.getItem("checkedItemsByDay");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [groceryChecked, setGroceryChecked] = useState(() => {
    try {
      const stored = localStorage.getItem("groceryChecked");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [dynamicPlan, setDynamicPlan] = useState(() => {
    try {
      const stored = localStorage.getItem("dynamicPlan");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [dynamicGroceries, setDynamicGroceries] = useState(() => {
    try {
      const stored = localStorage.getItem("dynamicGroceries");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [direction, setDirection] = useState(0);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();

  const activePlan = dynamicPlan ?? defaultPlan;
  const activeGroceries = dynamicGroceries ?? defaultGroceries;
  const meals = activePlan[selectedDay]?.meals || [];
  const fitness = activePlan[selectedDay]?.fitness || "";
  const checkedItems = checkedItemsByDay[selectedDay] || {};

  const progress = useMemo(() => {
    const total = meals.length + 1;
    const completed = meals.filter((_, i) => checkedItems[`meal-${i}`]).length + (checkedItems["fitness"] ? 1 : 0);
    return Math.round((completed / total) * 100);
  }, [checkedItems, meals]);

  useEffect(() => {
    localStorage.setItem("selectedDay", selectedDay);
    localStorage.setItem("checkedItemsByDay", JSON.stringify(checkedItemsByDay));
    localStorage.setItem("groceryChecked", JSON.stringify(groceryChecked));
    if (dynamicPlan) localStorage.setItem("dynamicPlan", JSON.stringify(dynamicPlan));
    if (dynamicGroceries) localStorage.setItem("dynamicGroceries", JSON.stringify(dynamicGroceries));
  }, [selectedDay, checkedItemsByDay, groceryChecked, dynamicPlan, dynamicGroceries]);

  useEffect(() => {
    if (progress === 100 && !showConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const handleSwipe = (dir) => {
    const currentIndex = days.indexOf(selectedDay);
    let newIndex;
    if (dir === "LEFT") {
      newIndex = (currentIndex + 1) % days.length;
      setDirection(-1);
    } else if (dir === "RIGHT") {
      newIndex = (currentIndex - 1 + days.length) % days.length;
      setDirection(1);
    }
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
    localStorage.removeItem("dynamicPlan");
    localStorage.removeItem("dynamicGroceries");
  };

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: blueGrey,
      background: { default: "#010137", paper: "#ffffff" }
    },
    shape: { borderRadius: 16 }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ mt: 4 }}>
        <TextField
          fullWidth
          label="Your Preferences"
          value={userPrefs}
          onChange={(e) => setUserPrefs(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          disabled={loadingPlan}
          onClick={async () => {
            setLoadingPlan(true);
            try {
              const { plan: newPlan, grocerySections: newGroceries } = await fetchCustomPlan(userPrefs);
              setDynamicPlan(newPlan);
              setDynamicGroceries(newGroceries);
            } catch (err) {
              console.error("Failed to fetch plan:", err);
            } finally {
              setLoadingPlan(false);
            }
          }}
        >
          {loadingPlan ? "Generating..." : "Generate Plan from Preferences"}
        </Button>
        <Button variant="outlined" onClick={resetCustomPlan} sx={{ ml: 2 }}>
          Reset to Default
        </Button>

        <Box sx={{ mt: 4, position: "relative", height: "100%" }}>
          <AnimatePresence custom={direction}>
          <motion.div
  key={selectedDay}
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(event, info) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    if (offsetX < -100 || velocityX < -500) {
      // Swipe Left → Next Day
      const nextIndex = (days.indexOf(selectedDay) + 1) % days.length;
      setSelectedDay(days[nextIndex]);
      setDirection(-1);
    } else if (offsetX > 100 || velocityX > 500) {
      // Swipe Right → Previous Day
      const prevIndex = (days.indexOf(selectedDay) - 1 + days.length) % days.length;
      setSelectedDay(days[prevIndex]);
      setDirection(1);
    }
  }}
  variants={variants}
  initial="enter"
  animate="center"
  exit="exit"
  transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
>
<Box>
  <Typography variant="h5" textAlign="center" mb={2}>
    {selectedDay}
  </Typography>

  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold">🏋️ Fitness</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={checkedItems["fitness"] || false}
            onChange={() => handleCheck("fitness")}
          />
        }
        label={fitness}
      />
    </CardContent>
  </Card>

  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold">🍽️ Meals</Typography>
      {meals.map((meal, i) => (
        <FormControlLabel
          key={i}
          control={
            <Checkbox
              checked={checkedItems[`meal-${i}`] || false}
              onChange={() => handleCheck(`meal-${i}`)}
            />
          }
          label={
            <Box>
              <Typography fontWeight="bold">{meal.name}</Typography>
              <Typography variant="body2">{meal.recipe}</Typography>
            </Box>
          }
        />
      ))}
    </CardContent>
  </Card>

  <Box sx={{ mb: 2 }}>
    <Typography variant="body2" sx={{ mb: 1 }}>
      Progress: {progress}%
    </Typography>
    <LinearProgress variant="determinate" value={progress} />
  </Box>
</Box>
</motion.div>
          </AnimatePresence>
        </Box>

        <Box mt={6}>
          <Typography variant="h6">🛒 Grocery List</Typography>
          <Grid container spacing={2}>
            {Object.entries(activeGroceries).map(([category, items]) => (
              <Grid item xs={12} md={6} key={category}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">{category}</Typography>
                    {items.map((item, i) => (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            checked={groceryChecked[item] || false}
                            onChange={() =>
                              setGroceryChecked(prev => ({
                                ...prev,
                                [item]: !prev[item]
                              }))
                            }
                          />
                        }
                        label={item}
                      />
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
