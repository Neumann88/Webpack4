const test = document.getElementById("test");

test.addEventListener("click", () =>
  setTimeout(() => console.log("test ready"), 1000)
);
