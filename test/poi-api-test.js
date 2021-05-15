"use strict";

const assert = require("chai").assert;
const axios = require("axios");

suite("POI API tests", function () {
    test("get pois", async function () {
        const response = await axios.get("http://localhost:3000/api/pois");
        const pois = response.data;
        assert.equal(2, pois.length);
    })

    test("get one POI", async function () {
        let response = await axios.get("http://localhost:3000/api/pois")
        const pois = response.data;
        assert.equal(2, pois.length);

        const onePoiUrl = "http://localhost:3000/api/pois/" + pois[0]._id;
        response = await  axios.get(onePoiUrl);
        const onePoi = response.data;

        assert.equal(onePoi.name, "GreenWay");
        assert.equal(onePoi.description, "Walk by the River Suir");
    })
})