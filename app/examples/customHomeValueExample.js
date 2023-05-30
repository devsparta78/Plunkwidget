// Using all caps with the address string values will help with validation
const addressObj = {
  fips: "04013",
  apn: "301-55-105",
  addressLineOne: "11635 S MOHAVE ST",
  aptNum: "",
  city: "PHOENIX",
  state: "AZ",
  zipcode: "85044",
};

// Fetch real home value data from the API using the the address in addressObj
const getPlunkHomeValue = async (addressObj) => {
  // Decide which route to use based on the endpoint you want to use to search for an address
  const url = `/api/homeValue`; // this will use the Address Search endpoint requiring a complete address string
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(addressObj),
  };
  const apiRes = await fetch(url, options);

  if (apiRes.status !== 200) {
    alert(apiRes.statusText);
    return undefined;
  }

  const homeValueData = await apiRes.json();

  addValueToDOM(homeValueData);
};

// Format Plunk Home Value
function commaFormatted(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// SVGs
const arrowDown =
  '<svg viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62584 12.6765C7.00685 13.3623 7.99315 13.3623 8.37416 12.6765L14.1746 2.23564C14.5449 1.56911 14.063 0.75 13.3005 0.75H1.69951C0.93703 0.75 0.455062 1.56911 0.825357 2.23564L6.62584 12.6765Z" fill="currentColor"/></svg>';
const arrowUp =
  '<svg viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62584 0.573483C7.00685 -0.112327 7.99315 -0.112326 8.37416 0.573483L14.1746 11.0144C14.5449 11.6809 14.063 12.5 13.3005 12.5H1.69951C0.93703 12.5 0.455062 11.6809 0.825357 11.0144L6.62584 0.573483Z" fill="currentColor"/></svg>';

// Add Plunk Home Value Data to the DOM
const addValueToDOM = (plunkHomeValueApiResponse) => {
  // Round the value to whole number
  const roundedPlunkHomeValue = Math.round(
    plunkHomeValueApiResponse.valuation_dollars
  );

  // Format the value with commas
  const formattedPlunkHomeValue = commaFormatted(roundedPlunkHomeValue);
  const plunkHomeValue = document.querySelector(".plunk-home-value-home-value");
  plunkHomeValue.innerHTML = formattedPlunkHomeValue;

  // Calculate appreciation per day and round to 2 decimal places
  const appreciationPerDay =
    plunkHomeValueApiResponse.appreciation_per_second * 60 * 60 * 24;
  const plunkAppreciationPerDay = document.querySelector(
    ".plunk-home-value-appreciation-value"
  );
  plunkAppreciationPerDay.innerHTML = `$${Math.abs(appreciationPerDay).toFixed(
    2
  )}`;

  // If appreciation is negative, the change in value per day is red and the arrow is down.
  // If the appreciation is positive the value is green and the arrow is up.
  const appreciationPerDayContainer = document.querySelector(
    ".plunk-home-value-appreciation-container"
  );
  const appreciationArrow = document.querySelector(
    ".plunk-home-value-appreciation-arrow"
  );
  if (plunkAppreciationPerDay < 0) {
    appreciationPerDayContainer.style.color = "#E05547";
    appreciationArrow.innerHTML = arrowDown;
  } else {
    appreciationPerDayContainer.style.color = "#20BE8E";
    appreciationArrow.innerHTML = arrowUp;
  }
};

getPlunkHomeValue(addressObj);
