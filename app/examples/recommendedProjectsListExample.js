// Using all caps with the address string values will help with validation
const addressObj = {
  addressLineOne: "3467 MASON LAKE RD NE",
  aptNum: "",
  city: "GRAND RAPIDS",
  state: "MI",
  zipcode: "49525",
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

const renderRecommendedProjectsList = async (addressObj) => {
  // Get real Remodel Value data from Plunk's API
  let remodelValueData = {};
  if (addressObj) {
    remodelValueData = await getPlunkRemodelValue(addressObj);
  }

  // Get the home value to use in the projects list component as the baseline_valuation
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
        id: "projects_list_example_01", // Happy path: showing the Plunk Recommended Projects list
        type: "recommended-projects",
        baseValuation: homeValueData.valuation_dollars,
        data: {
          ...remodelValueData,
        },
      },
      {
        id: "projects_list_example_02", // Response contains only recommended projects
        type: "recommended-projects",
        baseValuation: homeValueData.valuation_dollars,
        data: {
          parcel_id: "0aedcb29-175f-5ef7-907f-ded0b8bf78a2",
          recommendation: {
            value_change_proportion: 0.42179499876502413,
            component_projects: [
              {
                project_id: "add-full-bath-add-space",
                value_change_proportion: 0.21842004301297432,
              },
              {
                project_id: "add-two-bedrooms-add-space",
                value_change_proportion: 0.2033749557520498,
              },
            ],
          },
          project_valuations: [
            {
              project_id: "add-full-bath-add-space",
              value_change_proportion: 0.23532164177310838,
            },
            {
              project_id: "add-two-bedrooms-add-space",
              value_change_proportion: 0.21911234803787122,
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
            {
              project_id: "add-two-bedrooms-add-space",
              display_name: "Add-on two bedrooms",
              description:
                "Adding two new bedrooms will cost between $16,800 and $102,000. There's a good chance that adding two new bedrooms will add value to this home, and it's much more likely when also adding new square footage. The quality of the fit and finish, like flooring, light fixtures, surfaces, and windows, will also affect how much value this project could add.",
              image_urls: [
                "https://plunk-images.s3.amazonaws.com/fa18e968-fc8d-4864-9ee6-e24e746dacf5",
              ],
              cost_estimate: {
                typical: 45200,
                min: 16800,
                max: 102000,
              },
            },
          ],
        },
      },
      {
        id: "projects_list_example_03", // No projects response error message
        type: "recommended-projects",
        baseValuation: homeValueData.valuation_dollars,
        data: {
          parcel_id: "0aedcb29-175f-5ef7-907f-ded0b8bf78a2",
          recommendation: null,
          project_valuations: [],
          project_descriptions: [],
        },
      },
    ]);
  }
};

// Call the render function
renderRecommendedProjectsList(addressObj);
