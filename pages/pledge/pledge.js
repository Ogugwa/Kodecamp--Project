document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const pledgeList = document.getElementById("pledgeList");
  const pledgeCount = document.getElementById("pledgeCount");

  // Load pledges from localStorage or start empty
  let pledges = JSON.parse(localStorage.getItem("pledges")) || [];

  // Function to update display
  function renderPledges() {
    pledgeList.innerHTML = "";
    pledges.forEach((pledge) => {
      const item = document.createElement("div");
      item.className = "list-group-item";
      item.innerHTML = `
          <h5 class="mb-1">${pledge.name}</h5>
          <p class="mb-1">${pledge.text}</p>
          <small class="text-muted">Pledged on: ${pledge.date}</small>
        `;
      pledgeList.prepend(item); // newest on top
    });
    pledgeCount.textContent = pledges.length;
  }

  // Handle form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim(); // optional
    const text = document.getElementById("pledge").value.trim();

    if (!name || !text) return;

    const newPledge = {
      name,
      email,
      text,
      date: new Date().toISOString().split("T")[0],
    };

    pledges.push(newPledge);
    localStorage.setItem("pledges", JSON.stringify(pledges));

    renderPledges();
    form.reset();
  });

  // Initial render on page load
  renderPledges();
});
