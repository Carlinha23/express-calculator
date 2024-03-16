const express = require('express');
const app = express();
const ExpressError = require('./expressError');

// Middleware to parse HTTP request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// Homepage route
app.get('/', (req, res) => {
  res.send("HOMEPAGE!");
});

// Route for calculating the mean
app.get('/mean', (req, res, next) => {
  try {
    const nums = getNumbersFromQuery(req.query.nums);
    if (nums.length === 0) {
      throw new ExpressError('Nums are required', 400);
    }
    const mean = nums.reduce((acc, val) => acc + val, 0) / nums.length;
    res.json({ mean });
  } catch (err) {
    next(err);
  }
});

// Route for calculating the median
app.get('/median', (req, res, next) => {
  try {
    const nums = getNumbersFromQuery(req.query.nums);
    if (nums.length === 0) {
      throw new ExpressError('Nums are required', 400);
    }
    const median = calculateMedian(nums);
    res.json({ median });
  } catch (err) {
    next(err);
  }
});

// Route for calculating the mode
app.get('/mode', (req, res, next) => {
  try {
    const nums = getNumbersFromQuery(req.query.nums);
    if (nums.length === 0) {
      throw new ExpressError('Nums are required', 400);
    }
    const mode = calculateMode(nums);
    res.json({ mode });
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  res.status(status).json({ error: { message: err.message } });
});

// Helper functions

function getNumbersFromQuery(queryString) {
    if (!queryString) {
      return [];
    }
    const nums = queryString.split(',').map(num => {
      const parsedNum = parseFloat(num.trim());
      if (isNaN(parsedNum)) {
        throw new ExpressError(`${num.trim()} is not a valid number`, 400);
      }
      return parsedNum;
    });
    return nums;
}
  
function calculateMedian(nums) {
  const sortedNums = nums.slice().sort((a, b) => a - b);
  const mid = Math.floor(sortedNums.length / 2);
  return sortedNums.length % 2 !== 0 ? sortedNums[mid] : (sortedNums[mid - 1] + sortedNums[mid]) / 2;
}

function calculateMode(nums) {
  const frequencyMap = {};
  nums.forEach(num => {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1;
  });
  let mode;
  let maxFrequency = 0;
  for (const num in frequencyMap) {
    if (frequencyMap[num] > maxFrequency) {
      maxFrequency = frequencyMap[num];
      mode = parseFloat(num);
    }
  }
  return mode;
}

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
