// Initial Quotes Array
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const categorySelect = document.getElementById("categorySelect");

// Utility: Get Random Element
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Display Random Quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory
    ? quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase())
    : quotes;

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes available in this category.";
    return;
  }

  const randomQuote = getRandomElement(filteredQuotes);
  quoteDisplay.innerText = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// Add New Quote
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) {
    alert("Both fields are required!");
    return;
  }

  // Add to array
  quotes.push({ text, category });

  // Update Category Select if it's a new category
  if (![...categorySelect.options].some(option => option.value.toLowerCase() === category.toLowerCase())) {
    const newOption = document.createElement("option");
    newOption.value = category;
    newOption.text = category;
    categorySelect.appendChild(newOption);
  }

  // Clear input fields
  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("Quote added successfully!");
}

// Populate category filter
function populateCategoryOptions() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categorySelect.appendChild(option);
  });
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categorySelect.addEventListener("change", showRandomQuote);

// Initial population
populateCategoryOptions();
