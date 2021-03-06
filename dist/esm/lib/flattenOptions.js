function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export default function flattenOptions(options) {
  // console.log(`flatening options ${JSON.stringify(options)}`);
  if (!Array.isArray(options)) {
    return [];
  }

  const nextOptions = [];
  options.forEach((option, index) => {
    if ("type" in option && option.type === "group" && option) {
      const id = option.name.replace(/\s+/g, "-").toLowerCase() + "-" + index;
      option.items.forEach(groupOption => {
        const nextGroupOption = _objectSpread({}, groupOption);

        nextGroupOption.groupId = id;
        nextGroupOption.groupName = option.name;
        nextOptions.push(nextGroupOption);
      });
      return;
    }

    nextOptions.push(_objectSpread(_objectSpread({}, option), {}, {
      index
    }));
  });
  return nextOptions;
}