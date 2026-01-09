const optionForm = document.getElementById("option-form");
const optionList = document.getElementById("option-list");
const bestOptionLabel = document.getElementById("best-option");
const bestScoreLabel = document.getElementById("best-score");
const bulkInput = document.getElementById("bulk-input");
const bulkAddButton = document.getElementById("bulk-add");
const resetButton = document.getElementById("reset");

const weightPrice = document.getElementById("weight-price");
const weightRating = document.getElementById("weight-rating");
const weightValue = document.getElementById("weight-value");
const weightPriceValue = document.getElementById("weight-price-value");
const weightRatingValue = document.getElementById("weight-rating-value");
const weightValueValue = document.getElementById("weight-value-value");

const sampleOptions = [
  { name: "CloudRest Mattress", price: 899, rating: 4.7, value: 8.9 },
  { name: "Breeze Sofa", price: 749, rating: 4.5, value: 8.3 },
  { name: "Studio Desk", price: 329, rating: 4.4, value: 7.5 },
  { name: "Zen Lamp", price: 129, rating: 4.8, value: 7.9 },
];

let options = [...sampleOptions];

const toNumber = (value) => Number.parseFloat(value);

const getWeights = () => ({
  price: toNumber(weightPrice.value),
  rating: toNumber(weightRating.value),
  value: toNumber(weightValue.value),
});

const scoreOption = (option, weights) => {
  const priceScore = option.price > 0 ? (1 / option.price) * 1000 : 0;
  return (
    priceScore * weights.price +
    option.rating * weights.rating * 10 +
    option.value * weights.value * 10
  );
};

const updateWeightLabels = () => {
  weightPriceValue.textContent = weightPrice.value;
  weightRatingValue.textContent = weightRating.value;
  weightValueValue.textContent = weightValue.value;
};

const renderOptions = () => {
  const weights = getWeights();
  const ranked = options
    .map((option) => ({
      ...option,
      score: scoreOption(option, weights),
    }))
    .sort((a, b) => b.score - a.score);

  optionList.innerHTML = "";

  if (ranked.length === 0) {
    bestOptionLabel.textContent = "Add options to see a recommendation.";
    bestScoreLabel.textContent = "--";
    return;
  }

  ranked.forEach((option, index) => {
    const row = document.createElement("div");
    row.className = "table-row";
    row.innerHTML = `
      <span>${option.name}${index === 0 ? " <strong>(Best)</strong>" : ""}</span>
      <span>$${option.price.toFixed(2)}</span>
      <span>${option.rating.toFixed(1)}</span>
      <span>${option.value.toFixed(1)}</span>
      <span>${option.score.toFixed(1)}</span>
    `;
    optionList.appendChild(row);
  });

  bestOptionLabel.textContent = ranked[0].name;
  bestScoreLabel.textContent = ranked[0].score.toFixed(1);
};

const addOption = (option) => {
  if (!option.name || Number.isNaN(option.price)) {
    return;
  }
  options = [...options, option];
  renderOptions();
};

const parseBulkOptions = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, price, rating, value] = line.split(",").map((item) => item.trim());
      return {
        name,
        price: toNumber(price),
        rating: toNumber(rating),
        value: toNumber(value),
      };
    })
    .filter((option) => option.name && !Number.isNaN(option.price));

optionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(optionForm);
  addOption({
    name: formData.get("name"),
    price: toNumber(formData.get("price")),
    rating: toNumber(formData.get("rating")),
    value: toNumber(formData.get("value")),
  });
  optionForm.reset();
});

bulkAddButton.addEventListener("click", () => {
  const newOptions = parseBulkOptions(bulkInput.value);
  if (newOptions.length) {
    options = [...options, ...newOptions];
    bulkInput.value = "";
    renderOptions();
  }
});

[weightPrice, weightRating, weightValue].forEach((slider) => {
  slider.addEventListener("input", () => {
    updateWeightLabels();
    renderOptions();
  });
});

resetButton.addEventListener("click", () => {
  options = [...sampleOptions];
  weightPrice.value = 6;
  weightRating.value = 8;
  weightValue.value = 7;
  updateWeightLabels();
  renderOptions();
});

updateWeightLabels();
renderOptions();
