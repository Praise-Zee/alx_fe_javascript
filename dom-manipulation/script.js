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



function createAddQuoteForm() {
  const formContainer = document.getElementById("quoteFormContainer");

  // Create input for quote text
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";
  textInput.id = "newQuoteText";

  // Create input for category
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  // Create Add button
  const addButton = document.createElement("button");
  addButton.innerText = "Add Quote";
  addButton.id = "addQuoteBtn";
  addButton.addEventListener("click", addQuote);

  // Append to form container
  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}


function notifySyncUpdate() {
  const syncNotice = document.getElementById("syncNotice");
  syncNotice.style.display = "block";

  setTimeout(() => {
    syncNotice.style.display = "none";
  }, 5000);
}


// Show Random Quote
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filteredQuotes = selectedCategory
    ? quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase())
    : quotes;

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available in this category.";
    return;
  }

  const randomQuote = getRandomElement(filteredQuotes);
  quoteDisplay.innerHTML = `"${randomQuote.text}" — ${randomQuote.category}`;
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
  saveQuotes(); // Save to localStorage

  newQuoteText.value = "";
  newQuoteCategory.value = "";

  alert("Quote added!");

  //Re-populate filter categories
  populateCategories();
}

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

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const saved = localStorage.getItem("quotes");
  if (saved) {
    quotes = JSON.parse(saved);
  }
}


// Populate category filter
function populateCategory() {
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category;
    categorySelect.appendChild(option);
  });
}

function exportQuotesAsJson() {
  const data = JSON.stringify(quotes, null, 2); // formatted for readability
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid file format");
      }

      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategory();
      alert("Quotes imported successfully!");
    } catch (err) {
      alert("Error importing quotes: " + err.message);
    }
  };

  fileReader.readAsText(event.target.files[0]);
}


function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Clear existing options
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter (if any)
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes(); // Display quotes for saved category
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  localStorage.setItem("selectedCategory", selectedCategory); // Save user's preference

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<em>No quotes available for this category.</em>";
    return;
  }

  // Show one random quote from the filtered list
  const randomQuote = getRandomElement(filteredQuotes);
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <strong>— ${randomQuote.category}</strong>
  `;
}


async function syncWithServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();

    const transformedQuotes = serverQuotes.map(post => ({
      text: post.title,
      category: post.body
    }));

    // Compare with current local quotes
    const localJson = JSON.stringify(quotes);
    const serverJson = JSON.stringify(transformedQuotes);

    if (localJson !== serverJson) {
      // Conflict resolution: Server wins
      quotes = transformedQuotes;
      saveQuotes();
      populateCategories();
      filterQuotes();
      notifySyncUpdate(); // UI notification
    }
  } catch (err) {
    console.error("Error syncing with server:", err);
  }
}


// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);
categorySelect.addEventListener("change", showRandomQuote);

loadQuotes(); //Load saved quotes
createAddQuoteForm(); // Create the input form
populateCategory(); //Populate categories for filtering

// Start sync every 30 seconds
setInterval(syncWithServer, 30000);




