document.getElementById("newQuoteBtn").addEventListener("click", () => {
  // Redirect to index.html when "New Quotes" button is clicked
  window.location.href = "/index.html";
});

document.getElementById("showAllBtn").addEventListener("click", () => {
  // Redirect to index.html when "All Quotes" button is clicked
  window.location.href = "/index.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const quoteId = urlParams.get("id");

  fetch(`/api/quotes/${quoteId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const quote = data.quote;
        document.getElementById("author").textContent = `Author: ${quote.author}`;
        document.getElementById("quote").textContent = `Quote: ${quote.quote}`;
      } else {
        alert("Failed to get the quote. Please try again later.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    });
});
