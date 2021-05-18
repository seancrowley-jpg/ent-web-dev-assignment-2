"use strict";

const assert = require("chai").assert;
const PoiWebService = require("./poi-web-service")
const fixtures = require("./fixtures.json")
const _ = require('lodash');

suite("POI API tests", function () {

    let pois = fixtures.pois
    let newPoi = fixtures.newPoi
    let newUser = fixtures.newUser;

    const poiWebService = new PoiWebService(fixtures.poiWebService);

    suiteSetup(async function () {
        await poiWebService.deleteAllUsers();
        const returnedUser = await poiWebService.createUser(newUser);
        const response = await poiWebService.authenticate(newUser);
    });

    suiteTeardown(async function () {
        await poiWebService.deleteAllUsers();
        poiWebService.clearAuth();
    })
    setup(async function () {
        await poiWebService.deleteAllPois();
    });

    teardown(async function () {

    });

    //Creates a Poi and compares it against the new poi in the fixtures file
    //Uses lodash to ignore IDs
    test("create a poi", async function() {
        const returnedPoi = await poiWebService.createPoi(newPoi);
        assert(_.some([returnedPoi], newPoi))
        assert.isDefined(returnedPoi._id);
    });

    //Creates a new poi, then the get method is used on new poi. Pois are then
    //compared to ensure they are equal
    test("get poi", async function () {
        const poi1 = await poiWebService.createPoi(newPoi);
        const poi2 = await poiWebService.getPoi(poi1._id);
        assert.deepEqual(poi1, poi2);
    });

    //Gets two pois with invaild ids and checks that they are null
    test("get invalid poi", async function () {
        const poi1 = await poiWebService.getPoi("111");
        assert.isNull(poi1);
        const poi2 = await poiWebService.getPoi("111111111111111111");
        assert.isNull(poi2);
    });

    //For loop creates pois for the amount of pois in the fixtures file
    //allPois variable call getPois which calls the API
    //The length of the two are compared to assert that all the pois are actually returned
    test("get all pois", async function () {
        for (let poi of pois) {
            await poiWebService.createPoi(poi);
        }

        const allPois = await poiWebService.getPois();
        assert.equal(allPois.length, pois.length)
    })

    //A new poi is created. Assert checks that it is not NULL. The API is called to delete it.
    //Then the get request is called. Assert checks if it is null (has been deleted)
    test("delete a poi", async function () {
        let poi = await poiWebService.createPoi(newPoi);
        assert(poi._id != null);
        await poiWebService.deleteOnePoi(poi._id);
        poi = await poiWebService.getPoi(poi._id);
        assert(poi == null);
    });

    test("get pois detail", async function () {
        for (let poi of pois) {
            await poiWebService.createPoi(poi);
        }
        const allPois = await poiWebService.getPois();
        for (var i = 0; i < pois.length; i++) {
            assert(_.some([allPois[i]], pois[i])), "returnedPOi must be a superset of NewPoi"
        }
    })

    test("get all pois empty", async function () {
        const allPOis = await poiWebService.getPois();
        assert.equal(allPOis.length, 0);
    });
})