"use strict";

const assert = require("chai").assert;
const axios = require("axios");

suite("POI API tests", function () {
    test("get pois", async function () {
        const response = await axios.get("http://localhost:3000/api/pois");
        const pois = response.data;
        assert.equal(4, pois.length);
    })

    test("get one POI", async function () {
        let response = await axios.get("http://localhost:3000/api/pois")
        const pois = response.data;
        assert.equal(4, pois.length);

        const onePoiUrl = "http://localhost:3000/api/pois/" + pois[0]._id;
        response = await  axios.get(onePoiUrl);
        const onePoi = response.data;

        assert.equal(onePoi.name, "GreenWay");
        assert.equal(onePoi.description, "Walk by the River Suir");
    })

    test("create a Poi", async function () {
        const poisUrl = "http://localhost:3000/api/pois";
        const newPoi = {
            name: "Cliff Walk",
            description: "demo2",
            lat: 45.8,
            lon: 56.7,
            category: "Cycle Path",
        };

        const response = await  axios.post(poisUrl, newPoi);
        const returnedPoi = response.data;
        assert.equal(201, response.status);

        assert.equal(returnedPoi.name, "Cliff Walk");
        assert.equal(returnedPoi.description, "demo2")
        assert.equal(returnedPoi.category, "Cycle Path")
    })
})