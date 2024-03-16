const express = require('express');

const app = express();

// To parse http request body on each request:
app.use(express.json()); //For JSON
app.use(express.urlencoded({ extended: true })); //For Form Data

app.get('/', (req, res) => {
  res.send("HOMEPAGE!")
})

app.get('/mean', (req, res) => {
    const nums = req.query.nums.split(',').map(num => parseFloat(num));
    const mean = nums.reduce((acc, val) => acc + val, 0) / nums.length;
    res.json({ mean });
});

// Route for calculating the median (midpoint)
app.get('/median', (req, res) => {
    const nums = req.query.nums.split(',').map(num => parseFloat(num));
    nums.sort((a, b) => a - b);
    let median;
    if (nums.length % 2 === 0) {
        median = (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2;
    } else {
        median = nums[Math.floor(nums.length / 2)];
    }
    res.json({ median });
});

// Route for calculating the mode (most frequent)
app.get('/mode', (req, res) => {
    const nums = req.query.nums.split(',').map(num => parseFloat(num));
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
    res.json({ mode });
});



app.listen(3000, () => {
  console.log("Server running on port 3000")
});
