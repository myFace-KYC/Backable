webpackHotUpdate(4,{

/***/ "./ethereum/factory.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__web3__ = __webpack_require__("./ethereum/web3.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__build_CampaignFactory_json__ = __webpack_require__("./ethereum/build/CampaignFactory.json");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__build_CampaignFactory_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__build_CampaignFactory_json__);
(function () {
  var enterModule = __webpack_require__("./node_modules/react-hot-loader/index.js").enterModule;

  enterModule && enterModule(module);
})();


 // We need to refference the address of the CampaignFactory Address here

var instance = new __WEBPACK_IMPORTED_MODULE_0__web3__["a" /* default */].eth.Contract(JSON.parse(__WEBPACK_IMPORTED_MODULE_1__build_CampaignFactory_json___default.a.interface), "0xCA7740C40E82f945D4e48b9Cf2475c2674B2813D");
var _default = instance;
/* harmony default export */ __webpack_exports__["a"] = (_default);
;

(function () {
  var reactHotLoader = __webpack_require__("./node_modules/react-hot-loader/index.js").default;

  var leaveModule = __webpack_require__("./node_modules/react-hot-loader/index.js").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(instance, "instance", "/Users/Skara/Documents/Skara/Academics/ISTD/Term 6/Blockchain/Final_Project/Backable/ethereum/factory.js");
  reactHotLoader.register(_default, "default", "/Users/Skara/Documents/Skara/Academics/ISTD/Term 6/Blockchain/Final_Project/Backable/ethereum/factory.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=4.3cfe9964f0c2d1456a67.hot-update.js.map