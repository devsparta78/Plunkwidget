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
    const url = "./routes/api/homevaule";
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
  
  // renderHomeValue will render the valuation and rate of change for an address
  const renderHomeValue = async (addressObj) => {
    // Get real Home Value data from Plunk's API
    let homeValueData = {};
    if (addressObj) {
      homeValueData = await getPlunkHomeValue(addressObj);
    }
  
    // Plunk Home Value component
    if (!!PlunkWidget) {
      PlunkWidget.initPlunkComponent([
        {
          id: "home_value_test_01",
          type: "home-value",
          data: {
            appreciation_per_second: homeValueData.appreciation_per_second,
            valuation_dollars: homeValueData.valuation_dollars,
            valuation_timestamp: homeValueData.valuation_timestamp,
          },
          dynamic: false, // value will tick as default and have title Home Ticker™
        },
      ]);
    }
  };
  
  // Client API Example Request
  renderHomeValue(addressObj);
  