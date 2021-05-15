"use strict";

const assert = require("chai").assert;
const PoiWebService = require("./poi-web-service")
const fixtures = require("./fixtures.json")

suite("POI API tests", function () {

    let pois = fixtures.pois
    let newPoi = fixtures.newPoi

    const poiWebService = new PoiWebService("http://localhost:3000")

    test("create a poi", async function() {
        const returnedPoi = await poiWebService.createPoi(newPoi);
        assert.equal(returnedPoi.name, newPoi.name);
        assert.equal(returnedPoi.description, newPoi.description);
        assert.equal(returnedPoi.lat, newPoi.lat);
        assert.equal(returnedPoi.lon, newPoi.lon);
        assert.equal(returnedPoi.category, newPoi.category);
        assert.isDefined(returnedPoi._id);
    });
})