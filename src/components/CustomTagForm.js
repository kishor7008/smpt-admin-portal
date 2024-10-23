import React, { useState } from "react";
import { TextField, Slider, Checkbox, FormControlLabel, Button, Box } from "@mui/material";

function CustomTagForm({ onSubmit }) {
  // States for the checkboxes and length
  const [length, setLength] = useState(10);
  const [tagName, setTagName] = useState("");
  const [lettersUpper, setLettersUpper] = useState(true);
  const [lettersLower, setLettersLower] = useState(true);
  const [numbers, setNumbers] = useState(true);

  // Character sets
  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbersSet = "0123456789";

  // Handle length change from slider and input field
  const handleLengthChange = (event, newValue) => {
    setLength(newValue);
  };

  const handleInputChange = (event) => {
    setLength(event.target.value === '' ? '' : Number(event.target.value));
  };

  // Function to generate random tag
  const generateRandomTag = () => {
    let characterPool = "";

    if (lettersUpper) characterPool += upperCaseLetters;
    if (lettersLower) characterPool += lowerCaseLetters;
    if (numbers) characterPool += numbersSet;

    if (characterPool.length === 0) {
      alert("Please select at least one character set");
      return;
    }

    // Generate random string
    let randomTag = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characterPool.length);
      randomTag += characterPool[randomIndex];
    }

    // Set the generated tag as the tagName
    setTagName(randomTag);
  };

  // Handle form submission
  const handleSubmit = () => {
    const options = {
      tagName,
      length,
      lettersUpper,
      lettersLower,
      numbers,
    };
    onSubmit(options);
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', maxWidth: 400, boxShadow: 3 }}>
      {/* Input for Tag Name */}
      <TextField
        fullWidth
        label="Tag Name"
        value={tagName}
        onChange={(e) => setTagName(e.target.value)}
        variant="outlined"
        margin="normal"
      />

      {/* Checkboxes for character sets */}
      <FormControlLabel
        control={
          <Checkbox
            checked={lettersUpper}
            onChange={(e) => setLettersUpper(e.target.checked)}
          />
        }
        label="Letters (A-Z)"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={lettersLower}
            onChange={(e) => setLettersLower(e.target.checked)}
          />
        }
        label="Letters (a-z)"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={numbers}
            onChange={(e) => setNumbers(e.target.checked)}
          />
        }
        label="Numbers (0-9)"
      />

      {/* Slider for length */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <Slider
          value={typeof length === 'number' ? length : 0}
          onChange={handleLengthChange}
          aria-labelledby="length-slider"
          step={1}
          min={1}
          max={20}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Length"
          value={length}
          onChange={handleInputChange}
          inputProps={{
            step: 1,
            min: 1,
            max: 20,
            type: 'number',
          }}
        />
      </Box>

      {/* Buttons */}
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={generateRandomTag} // Generate the random tag
        >
          Generate Random Tag
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ ml: 2 }}
          onClick={handleSubmit} // Submit form
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default CustomTagForm;
