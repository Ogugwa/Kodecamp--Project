document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const categorySelect = form.querySelector("select");
  const quantityInput = document.getElementById("quantity");
  const tableBody = document.querySelector("#logsTable tbody");
  const chartCanvas = document.getElementById("recyclingChart");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const badgeContainer = document.getElementById("badgeContainer");

  let logs = JSON.parse(localStorage.getItem("recyclingLogs")) || [];

  // 🎖 Badge Tracking
  const badgeThreshold = 10; // 10 items for a badge

  function checkBadges() {
    const totals = {};
    logs.forEach((log) => {
      totals[log.category] = (totals[log.category] || 0) + Number(log.quantity);
    });

    Object.keys(totals).forEach((category) => {
      if (totals[category] >= badgeThreshold) {
        badgeContainer.classList.remove("d-none");
        badgeContainer.textContent = `🎉 Congratulations! You earned a Recycler Badge for ${category}!`;
        setTimeout(() => badgeContainer.classList.add("d-none"), 5000);
      }
    });
  }

  // 🎯 Search Filter
  searchInput.addEventListener("input", () => {
    renderLogs();
  });

  // 🔽 Sorting
  sortSelect.addEventListener("change", () => {
    if (sortSelect.value === "category") {
      logs.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortSelect.value === "quantity") {
      logs.sort((a, b) => a.quantity - b.quantity);
    }
    renderLogs();
  });

  // Clear All Logs
  clearAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all logs?")) {
      logs = [];
      localStorage.removeItem("recyclingLogs");
      renderLogs();
    }
  });

  // Categories
  const categories = ["Plastic", "Organic", "E-waste", "Paper", "Glass"];

  // Chart.js setup (bar chart)
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Recycling (kg)",
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(13, 110, 253, 0.7)", // Plastic - blue
          "rgba(25, 135, 84, 0.7)", // Organic - green
          "rgba(220, 53, 69, 0.7)", // E-waste - red
          "rgba(255, 193, 7, 0.7)", // Paper - yellow
          "rgba(111, 66, 193, 0.7)", // Glass - purple
        ],
        borderColor: ["#0d6efd", "#198754", "#dc3545", "#ffc107", "#6f42c1"],
        borderWidth: 1,
      },
    ],
  };

  const recyclingChart = new Chart(chartCanvas, {
    type: "bar",
    data: chartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5,
          },
          title: {
            display: true,
            text: "Quantity (kg)",
          },
        },
      },
    },
  });

  // Render Logs
  function renderLogs() {
    tableBody.innerHTML = "";
    const searchText = searchInput.value.toLowerCase();

    logs
      .filter((log) => log.category.toLowerCase().includes(searchText))
      .forEach((log, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${log.category}</td>
          <td>
            <input type="number" class="form-control form-control-sm" value="${log.quantity}" />
          </td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteLog(${index})">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

    updateChart();
    checkBadges();
  }

  // Update chart totals
  function updateChart() {
    const totals = [0, 0, 0, 0, 0];
    logs.forEach((log) => {
      const idx = categories.indexOf(log.category);
      if (idx !== -1) totals[idx] += log.quantity;
    });
    recyclingChart.data.datasets[0].data = totals;
    recyclingChart.update();
    localStorage.setItem("recyclingLogs", JSON.stringify(logs));
  }

  // Form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const category = categorySelect.options[categorySelect.selectedIndex].text;
    const quantity = parseFloat(quantityInput.value);
    if (!isNaN(quantity) && category !== "Select a Waste Category") {
      logs.push({ category, quantity });
      quantityInput.value = "";
      categorySelect.selectedIndex = 0;
      renderLogs();
    }
  });

  // Edit/Delete handlers
  tableBody.addEventListener("input", (e) => {
    if (e.target.matches("input[type='number']")) {
      const idx = e.target.dataset.index;
      logs[idx].quantity = parseFloat(e.target.value) || 0;
      updateChart();
    }
  });

  tableBody.addEventListener("click", (e) => {
    if (e.target.dataset.delete !== undefined) {
      logs.splice(e.target.dataset.delete, 1);
      renderLogs();
    }
  });

  // Init
  renderLogs();
});
