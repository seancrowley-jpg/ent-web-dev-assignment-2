"use strict";

const assert = require("chai").assert;
const PoiWebSerivce = require("./poi-web-service");
const fixtures = require("./fixtures.json");
const utils = require("../app/api/utils");

suite("Authentication API tests", function () {
    let users = fixtures.users;
    let newUser = fixtures.newUser;

    const poiWebService = new PoiWebSerivce(fixtures.poiWebService);

    setup(async function () {
        await poiWebService.deleteAllUsers();
    })

    test("authenticate", async function () {
        const returnedUser = await poiWebService.createUser(newUser);
        const response = await poiWebService.authenticate(newUser);
        assert(response.success);
        assert.isDefined(response.token);
    });

    test("verify Token", async function () {
        const returnedUser = await poiWebService.createUser(newUser);
        const response = await poiWebService.authenticate(newUser);

        const userInfo = utils.decodeToken(response.token);
        assert.equal(userInfo.email, returnedUser.email);
        assert.equal(userInfo.userId, returnedUser._id);
    });
})