"use strict";

const assert = require("chai").assert;
const PoiWebService = require("./poi-web-service")
const fixtures = require("./fixtures.json")
const _ = require('lodash');

suite("Image API tests", function () {
    let images = fixtures.images;
    let newPoi = fixtures.newPoi;

    const poiWebService = new PoiWebService(fixtures.poiWebService);

    setup(async function () {
        poiWebService.deleteAllPois();
        poiWebService.deleteAllImages();
    });

    teardown(async function () {});

});