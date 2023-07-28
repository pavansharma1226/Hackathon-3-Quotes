let showCreateForm = false;
let showAllQuotes = true;

function toggleCreateQuoteForm() {
  const createQuoteForm = document.getElementById("createQuoteForm");
  const showAllBtn = document.getElementById("showAllBtn");
  const allQuotes = document.getElementById("allQuotes");

  if(!showCreateForm){
    showCreateForm = true;
    showAllQuotes = false;
  }
  
  createQuoteForm.style.display = showCreateForm ? "block" : "none";
  showAllBtn.style.display = showCreateForm ? "block" : "block";
  allQuotes.style.display = showCreateForm ? "none" : "block";
  
}

function toggleAllQuotes() {
  const showAllBtn = document.getElementById("showAllBtn");
  const createQuoteForm = document.getElementById("createQuoteForm");
  const allQuotes = document.getElementById("allQuotes");

  if(!showAllQuotes){
    showAllQuotes = true;
    showCreateForm = false;
  
  }
  allQuotes.style.display = showAllQuotes ? "block" : "none";
  createQuoteForm.style.display = showAllQuotes ? "none" : "block";
  showAllBtn.textContent = showAllQuotes ? "All Quotes" : "All Quotes";
}


function shortenQuote(quote) {
  const maxLength = 45;
  if (quote.length > maxLength) {
    return quote.substring(0, maxLength) + "..";
  }
  return quote;
}

function viewQuote(quoteId, fullQuote) {
  if (fullQuote) {
    // Redirect to a new webpage to view the full quote
    window.location.href = `/quote.html?id=${quoteId}`;
  } else {
    // Show the full quote in an alert dialog
    alert(fullQuote);
  }
}

function addQuote() {
  const authorInput = document.getElementById("authorInput");
  const quoteInput = document.getElementById("quoteInput");
  const author = authorInput.value.trim();
  const quote = quoteInput.value.trim();

  if (!author || !quote) {
    alert("Please enter both author and quote.");
    return;
  }

  fetch("/api/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ author, quote }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Clear input fields
        authorInput.value = "";
        quoteInput.value = "";

        // Refresh the quotes list
        getQuotes();
        allQuotes.style.display = "block";
        createQuoteForm.style.display = "none";
      } else {
        alert("Failed to add the quote. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    });
}

function viewQuote(quoteId) {
  // Redirect to a new webpage to view the quote
  window.location.href = `/quote.html?id=${quoteId}`;
}

function getQuotes() {
  fetch("/api/quotes")
    .then((response) => response.json())
    .then((data) => {
      const quoteList = document.getElementById("quoteList");
      quoteList.innerHTML = "";

      
      data.quotes.forEach((quote) => {
        const li = document.createElement("li");
        li.classList.add("quote-item"); // Add a class for styling
    
        const shortenedQuote = shortenQuote(quote.quote);
        const quoteText = document.createElement("h3");
        quoteText.textContent = ` ${shortenedQuote}`;
        li.appendChild(quoteText);

        const author = document.createElement("p");
        author.textContent = `~ ${quote.author}`;
        li.appendChild(author);
    
        // Check if the quote needs to be shortened or not
      
        const viewButton = document.createElement("button");
        viewButton.textContent = "View Full Quote";
        viewButton.onclick = () => viewQuote(quote._id, quote.quote);
        li.appendChild(viewButton);
  
        
        quoteList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to get quotes. Please try again later.");
    });
}

document.getElementById("newQuoteBtn").style.display = "block";
document.getElementById("showAllBtn").style.display = "block";
document.getElementById("createQuoteForm").style.display = "none";

document.getElementById("newQuoteBtn").addEventListener("click", toggleCreateQuoteForm);
document.getElementById("showAllBtn").addEventListener("click", toggleAllQuotes);

document.addEventListener("DOMContentLoaded", () => {
  getQuotes();
}); 

