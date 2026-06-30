NS.findArray = ({
  items,
  element
}) => {
  if (!items || !element) return console.error("Make sure all arguments exist!.");
  const foundElement = document.querySelector(element);
  const checkIfMatch = () => {
    for (let item of items) {
      const text = (item.textContent || item).toLowerCase().trim();
      if (text.includes(foundElement.value.toLowerCase().trim())) item.style.display = "block";
      else item.style.display = "none";
    }
  };

  foundElement.addEventListener("input", function () {
    checkIfMatch();
  });

  checkIfMatch();
}

/* 
  Providing a list of items:
 (Examples include: const meals = ["burger", "fried-chicken", "tomato-soup"])
 it will filter your items using the .includes() method. 

 It's not desgined for large datasets, just for simple, quick serach.
*/