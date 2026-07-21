NS.findArray = ({
  items,
  element,
  autoRun = true,
  onInput
}) => {
  if (!items || !element) return console.error("Make sure all arguments exist!.");
  const foundElement = document.querySelector(element);

  const checkIfMatch = () => {
    const matches = [];

    for (let item of items) {
      const text = (item.textContent || item).toLowerCase().trim();
      if (text.includes(foundElement.value.toLowerCase().trim())) {
        item.style.display = "block";
        matches.push(text);
      }
      else item.style.display = "none";
    }

    if (typeof onInput === "function") onInput(matches);
  };

  foundElement.addEventListener("input", function () {
    checkIfMatch();
  });

  if (autoRun) checkIfMatch();
}

/* 
  Providing a list of items:
 (Examples include: const meals = ["burger", "fried-chicken", "tomato-soup"])
 it will filter your items using the .includes() method. 

 It's not desgined for large datasets, just for simple, quick serach.
*/