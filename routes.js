const Poi = require("./app/controllers/poi");
const Accounts = require("./app/controllers/accounts");

module.exports = [
  { method: "GET", path: "/", config: Accounts.index },
  { method: "GET", path: "/signup", config: Accounts.showSignup },
  { method: "GET", path: "/login", config: Accounts.showLogin },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "GET", path: "/settings", config: Accounts.showSettings },
  { method: "GET", path: "/admin-dashboard", config: Accounts.showAdmin },
  { method: "GET", path: "/adminDeleteUser/{_id}", config: Accounts.adminDeleteUser },
  { method: "POST", path: "/settings", config: Accounts.updateSettings },
  { method: "POST", path: "/deleteUser", config: Accounts.deleteUser },
  { method: "POST", path: "/signup", config: Accounts.signup },
  { method: "POST", path: "/login", config: Accounts.login },

  { method: "GET", path: "/home", config: Poi.home },
  { method: "GET", path: "/report", config: Poi.report },
  { method: "GET", path: "/user-report", config: Poi.userReport },
  { method: "GET", path: "/deletePoi/{_id}", config: Poi.deletePoi },
  { method: "GET", path: "/poi/{_id}", config: Poi.viewPoi },
  { method: "GET", path: "/user-poi/{_id}", config: Poi.viewUserPoi },
  { method: "GET", path: "/update-poi/{_id}", config: Poi.showUpdatePoi },
  { method: "GET", path: "/deleteimage/{public_id}", config: Poi.deleteImage },
  { method: "POST", path: "/update-poi/{_id}", config: Poi.updatePoi },
  { method: "POST", path: "/add-poi", config: Poi.addPoi },
  { method: "POST", path: "/uploadfile/{_id}", config: Poi.addImage },

  {
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: "./public",
      },
    },
    options: { auth: false },
  },
];
