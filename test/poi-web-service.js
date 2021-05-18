"use strict";

const axios = require("axios");
const baseUrl = "http://localhost:3000";

class PoiWebService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getPois() {
        const response = await axios.get(this.baseUrl + "/api/pois");
        return response.data;
    }

    async getPoi(id) {
        try{
            const response = await axios.get(this.baseUrl + "/api/pois/" + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createPoi(newPoi) {
        const response = await axios.post(this.baseUrl + "/api/pois" , newPoi);
        return response.data;
    }

    async deleteAllPois() {
        const response = await axios.delete(this.baseUrl + "/api/pois");
        return response.data;
    }

    async deleteOnePoi(id) {
        const response = await axios.delete(this.baseUrl + "/api/pois/" + id);
        return response.data;
    }

    async getUsers() {
        const response = await axios.get(this.baseUrl + "/api/users");
        return response.data;
    }

    async getUser(id) {
        try {
            const response = await axios.get(this.baseUrl + "/api/users/" + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createUser(newUser) {
        const response = await axios.post(this.baseUrl + "/api/users", newUser);
        return response.data;
    }

    async deleteAllUsers() {
        try {
            const response = await axios.delete(this.baseUrl + "/api/users");
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteOneUser(id) {
        try {
            const response = await axios.delete(this.baseUrl + "/api/users/" + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getImages() {
        try {
            const response = await axios.get(this.baseUrl + "/api/images/");
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getOneImage(id) {
        try {
            const response = await axios.get(this.baseUrl + "/api/images/" + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteAllImages() {
        try {
            const response = await axios.delete(this.baseUrl + "/api/images");
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async addImage(id, image) {
        try {
            const response = await axios.post(this.baseUrl + "/api/images/" + id , image);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async authenticate(user) {
        try {
            const response = await axios.post(this.baseUrl + "/api/users/authenticate", user);
            axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async clearAuth(user) {
        axios.defaults.headers.common["Authorization"] = "";
    }
}

module.exports = PoiWebService;