document.addEventListener("DOMContentLoaded", () => {
  // Array of "Did You Know?" facts
  const wasteFacts = [
    "Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
    "Plastic takes over 400 years to decompose in landfills.",
    "Recycling one ton of paper saves 17 trees and 7,000 gallons of water.",
    "Glass is 100% recyclable and can be recycled endlessly without losing quality.",
    "Organic waste in landfills produces methane, a greenhouse gas 25x stronger than CO₂.",
    "Composting food scraps can reduce household waste by up to 30%.",
    "E-waste contains valuable metals like gold, copper, and silver that can be reused.",
    "Using recycled materials in manufacturing saves up to 95% of the energy compared to using raw materials.",
  ];

  // Selecting the elements
  const factBox = document.getElementById("didYouKnowBox");
  const newFactBtn = document.getElementById("newFactBtn");

  let lastIndex = -1;

  // Function to pick and display a random fact
  function showDidYouKnow() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * wasteFacts.length);
    } while (randomIndex === lastIndex);

    lastIndex = randomIndex;

    if (factBox) {
      // Fade-out effect
      factBox.classList.remove("show");
      setTimeout(() => {
        factBox.textContent = wasteFacts[randomIndex];
        factBox.classList.add("show"); // Fade-in
      }, 300);
    }
  }

  // Initial display on page load
  if (factBox) {
    factBox.classList.add("fade", "show");
    showDidYouKnow();
  }

  // Button click handler
  if (newFactBtn) {
    newFactBtn.addEventListener("click", showDidYouKnow);
  }
});
