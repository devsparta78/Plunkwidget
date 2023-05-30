// Using all caps with the address string values will help with validation
const addressObj = {
  addressLineOne: "1675 E ALTADENA DR",
  aptNum: "",
  city: "ALTADENA",
  state: "CA",
  zipcode: "91001",
};

// Fetch Remodel Valuation data from the API using the the address in addressObj
const getPlunkRemodelValue = async (addressObj) => {
  const url = `/api/remodelValue`;
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

  const remodelValueData = await apiRes.json();

  return remodelValueData;
};

// Fetch real home value data from the API using the the address in addressObj
const getPlunkHomeValue = async (addressObj) => {
  const url = `/api/homeValue`;
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

  return homeValueData;
};

// renderRemodelValue will render the Remodel Value component
const renderRemodelValue = async (addressObj) => {
  // Get real Remodel Value data from Plunk's API
  let remodelValueData = {};
  if (addressObj) {
    remodelValueData = await getPlunkRemodelValue(addressObj);
  }

  // Get the home value to use in the remodel value component as the baseline_valuation
  let homeValueData = {};
  if (addressObj) {
    homeValueData = await getPlunkHomeValue(addressObj);
  }

  /*
  Our third component example below renders an error message when there are no recommended projects.
  If you don't want to render our pre-built error message check if the value for recommendation
  is null. If it is null, you may choose to render your own UI.
  */
  if (remodelValueData.recommendation === null) {
    console.log("Show your own UI error message");
  }

  // Plunk Remodel Value component examples
  if (!!PlunkWidget) {
    PlunkWidget.initPlunkComponent([
      {
        id: "remodel_value_example_01", // Happy path: showing the Plunk Remodel Value graph UI
        type: "remodel-value",
        baseValuation: homeValueData.valuation_dollars,
        data: {
          ...remodelValueData,
        },
      },
      {
        id: "remodel_value_example_02", // UI component example to handle when no baseValuation or data is provided
        type: "remodel-value",
        data: {},
      },
      {
        id: "remodel_value_example_03", // UI component example to handle when there is no remodel value due to no recommended projects
        type: "remodel-value",
        baseValuation: homeValueData.valuation_dollars,
        data: {
          parcel_id: "43f5edd2-0605-5c9b-8210-1c647be0e8d6",
          recommendation: null,
          project_valuations: [
            {
              project_id: "add-full-bath-add-space",
              value_change_proportion: 0.0,
            },
          ],
          project_descriptions: [
            {
              project_id: "add-full-bath-add-space",
              display_name: "Add a full bath (+ sq ft)",
              description:
                "The average cost of adding a bathroom is between $15,100 and $52,600. Creating a new full bathroom in a home will usually add to the home's value, especially with additional new square footage. Its impact on the home value will also be determined by the quality of the addition, including the flooring, fixtures, tile, hardware, and lighting.",
              image_urls: [
                "https://plunk-images.s3.amazonaws.com/84e05454-f826-407c-88f4-78ffcd9d16df",
              ],
              cost_estimate: {
                typical: 29500,
                min: 15100,
                max: 52600,
              },
            },
          ],
        },
      },
    ]);
  }
};

// Call the render function
renderRemodelValue(addressObj);
