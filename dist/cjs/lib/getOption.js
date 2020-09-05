"use strict";

exports.__esModule = true;
exports["default"] = getOption;

function getOption(value, defaultOptions) {
  // console.log(
  //   "get option in searching:" +
  //     JSON.stringify(value) +
  //     "default options is :" +
  //     JSON.stringify(defaultOptions)
  // );
  if (value && defaultOptions.length > 0) {
    if (Array.isArray(value)) {
      return value.map(function (singleValue) {
        return defaultOptions.find(function (option) {
          return option.value === singleValue;
        });
      });
    }

    return defaultOptions.find(function (option) {
      return option.value === value;
    }) || null;
  }

  return null;
}