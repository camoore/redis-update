"use strict";

const Axios = require("axios");

const getOdds = async (
  apiKey,
  sport,
  mkt,
  region = "us",
  dateFormat = "unix",
  oddsFormat = "american"
) => {
  try {
    const { data } = await Axios({
      method: "GET",
      url: `https://api.the-odds-api.com/v3/odds`,
      params: {
        apiKey,
        sport,
        region,
        mkt,
        oddsFormat,
        dateFormat
      }
    });
    return JSON.stringify(data);
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = { getOdds };
