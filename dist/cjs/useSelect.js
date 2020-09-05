"use strict";

exports.__esModule = true;
exports["default"] = useSelectSearch;

var _react = require("react");

var _highlightReducer = _interopRequireDefault(require("./highlightReducer"));

var _getDisplayValue = _interopRequireDefault(require("./lib/getDisplayValue"));

var _flattenOptions = _interopRequireDefault(require("./lib/flattenOptions"));

var _groupOptions = _interopRequireDefault(require("./lib/groupOptions"));

var _getNewValue = _interopRequireDefault(require("./lib/getNewValue"));

var _getOption = _interopRequireDefault(require("./lib/getOption"));

var _search = _interopRequireDefault(require("./search"));

var _propTypes = require("prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function multiInput(multiple, input, options, originOptions, onSelect) {
  if (multiple) {
    var multiValue = Array.isArray(input) ? input : input.replace(/\，/g, ",").split(","); // console.log("inside multi input and to call onselect");

    for (var _iterator = _createForOfIteratorHelperLoose(multiValue), _step; !(_step = _iterator()).done;) {
      var m = _step.value;

      // console.log(`value in input with comma ` + m);
      //   originOptions.map((a) => {
      //     console.log(`value in original options value ` + JSON.stringify(a));
      //     if (a.type === "group") {
      //       console.log("is a group,quiting...");
      //       return originOptions;
      //     } else if (a.value === m) {
      //       console.log("value exsisted,quitting...");
      //       return;
      //     }
      //   });
      for (var _iterator2 = _createForOfIteratorHelperLoose(originOptions), _step2; !(_step2 = _iterator2()).done;) {
        var a = _step2.value;

        // console.log(`value in original options value ` + JSON.stringify(a));
        if (a.type === "group") {
          // console.log("is a group,quiting...");
          return originOptions;
        } else if (a.value === m) {
          // console.log("value exsisted,quitting...");
          return originOptions;
        }
      }

      originOptions.push({
        name: m,
        value: m
      });
      if (onSelect) onSelect(m);
    }

    return originOptions;
  } else {
    if (onSelect) onSelect(input);
    return options;
  }
}

function useSelectSearch(_ref) {
  var _ref$value = _ref.value,
      defaultValue = _ref$value === void 0 ? null : _ref$value,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      _ref$multiple = _ref.multiple,
      multiple = _ref$multiple === void 0 ? false : _ref$multiple,
      _ref$manualAdd = _ref.manualAdd,
      manualAdd = _ref$manualAdd === void 0 ? false : _ref$manualAdd,
      _ref$onRenderUpdate = _ref.onRenderUpdate,
      onRenderUpdate = _ref$onRenderUpdate === void 0 ? false : _ref$onRenderUpdate,
      _ref$search = _ref.search,
      canSearch = _ref$search === void 0 ? false : _ref$search,
      _ref$fuse = _ref.fuse,
      fuse = _ref$fuse === void 0 ? false : _ref$fuse,
      defaultOptions = _ref.options,
      _ref$arrayOptions = _ref.arrayOptions,
      arrayOptions = _ref$arrayOptions === void 0 ? [] : _ref$arrayOptions,
      name = _ref.name,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? function () {} : _ref$onChange,
      _ref$getOptions = _ref.getOptions,
      getOptions = _ref$getOptions === void 0 ? null : _ref$getOptions,
      _ref$allowEmpty = _ref.allowEmpty,
      allowEmpty = _ref$allowEmpty === void 0 ? true : _ref$allowEmpty,
      _ref$closeOnSelect = _ref.closeOnSelect,
      closeOnSelect = _ref$closeOnSelect === void 0 ? true : _ref$closeOnSelect;
  var ref = (0, _react.useRef)(null); // console.log(arrayOptions);

  var _useState = (0, _react.useState)({
    flat: [],
    addedOptions: [],
    value: defaultValue,
    search: "",
    display: "none",
    selecting: false,
    focus: false,
    newOptions: defaultOptions,
    searching: false,
    e: null,
    highlighted: -1,
    changed: false
  }),
      state = _useState[0],
      setState = _useState[1];

  var newOptions = state.newOptions,
      selecting = state.selecting,
      addedOptions = state.addedOptions,
      value = state.value,
      display = state.display,
      search = state.search,
      focus = state.focus,
      searching = state.searching,
      highlighted = state.highlighted,
      e = state.e,
      flat = state.flat; // console.log(`newoptions is ${JSON.stringify(newOptions)}`);

  var flatDefaultOptions = (0, _react.useMemo)(function () {
    return (0, _flattenOptions["default"])(newOptions);
  }, [focus, newOptions, addedOptions, arrayOptions]); // console.log(`flat default options ${JSON.stringify(flatDefaultOptions)}`);

  (0, _react.useEffect)(function () {
    if (onRenderUpdate) setState({
      flat: [],
      addedOptions: [],
      value: defaultValue,
      search: "",
      display: "none",
      selecting: false,
      focus: false,
      newOptions: defaultOptions,
      searching: false,
      e: null,
      highlighted: -1,
      changed: false
    });
  }, [defaultOptions]);
  (0, _react.useEffect)(function () {
    if (arrayOptions && arrayOptions.length > 0) {
      var updatedOptions = multiInput("multiple", arrayOptions, [], [], onSelect); // console.log(updatedOptions);
      // console.log(flattenOptions(updatedOptions));

      setState({
        addedOptions: [],
        value: defaultValue,
        search: "",
        selecting: false,
        focus: false,
        flat: flatDefaultOptions,
        newOptions: (0, _flattenOptions["default"])(updatedOptions),
        searching: false,
        e: null,
        highlighted: -1,
        changed: false
      });
    }
  }, [arrayOptions]);
  (0, _react.useEffect)(function () {
    setState(function (oldState) {
      return _objectSpread(_objectSpread({}, oldState), {}, {
        flat: flatDefaultOptions
      });
    });
  }, [flatDefaultOptions]);
  (0, _react.useMemo)(function () {
    if (focus || selecting || !manualAdd) {
      var show = "block";
    } else if (!focus && !selecting) {
      var show = "none";
    }

    setState(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, {
        display: show
      });
    });
  }, [focus, selecting]); // console.log(`display value is ${display}`);

  var option = (0, _react.useMemo)(function () {
    // console.log("get option on line 111");
    // console.log(value);
    // console.log(flatDefaultOptions);
    // console.log(addedOptions);
    var addedOption = addedOptions ? addedOptions : [];
    var newOption = (0, _getOption["default"])(value, [].concat(flatDefaultOptions));

    if (!newOption && !allowEmpty && !multiple) {
      newOption = flatDefaultOptions[0];
    }

    return newOption;
  }, [value, flatDefaultOptions, addedOptions, allowEmpty, multiple]);
  var options = (0, _react.useMemo)(function () {
    return (0, _groupOptions["default"])(flat);
  }, [flat, focus, newOptions]);
  var displayValue = (0, _react.useMemo)(function () {
    return (0, _getDisplayValue["default"])(option);
  }, [option]);
  var onBlur = (0, _react.useCallback)(function () {
    setState(function (oldState) {
      return _objectSpread(_objectSpread({}, oldState), {}, {
        focus: false,
        selecting: false,
        search: "",
        // flat: flattenOptions(oldState.options),
        highlighted: -1
      });
    });

    if (ref.current) {
      ref.current.blur();
    }
  }, [flatDefaultOptions, ref]);
  (0, _react.useEffect)(function () {
    // console.log(e);
    if (!search || !manualAdd) return;

    if (newOptions) {
      // console.log(`options before adding new ${JSON.stringify(options)}`);
      var Options = [].concat(newOptions);

      for (var _iterator3 = _createForOfIteratorHelperLoose(Options), _step3; !(_step3 = _iterator3()).done;) {
        var a = _step3.value;

        if (a.value === search) {
          return;
        }
      }

      Options.push({
        name: search,
        value: search
      });
    } else {
      Options = [{
        name: search,
        value: search
      }];
    }

    var updatedOptions = multiInput(multiple, search, Options, [].concat(newOptions), onSelect); // console.log("updated options is " + JSON.stringify(updatedOptions));
    // console.log(`options after adding new ${JSON.stringify(Options)}`);

    setState(function (oldState) {
      return _objectSpread(_objectSpread({}, oldState), {}, {
        flat: flatDefaultOptions,
        newOptions: (0, _flattenOptions["default"])(updatedOptions)
      });
    }); // console.log(
    //   `options after adding new and flattened ${JSON.stringify(newOptions)}`
    // );
  }, [focus, e]);

  var setFocus = function setFocus(newFocus) {
    return setState(function (oldState) {
      return _objectSpread(_objectSpread({}, oldState), {}, {
        focus: newFocus
      });
    });
  };

  var onClick = function onClick() {
    return setFocus(!focus);
  };

  var onFocus = function onFocus() {
    return setFocus(true);
  };

  var onSelect = (0, _react.useCallback)(function (val, e) {
    // console.log(state);
    // console.log(val);
    // console.log(e);
    setState(function (oldState) {
      var defaultItem = oldState.flat[oldState.highlighted];
      var oldStateValue = defaultItem && defaultItem.value;
      var item = val || oldStateValue;

      if (!item) {
        return oldState;
      } // console.log(item);


      var values = (0, _getNewValue["default"])(item, oldState.value, multiple); // console.log(values);
      // console.log(oldState);

      var newOptions = (0, _getOption["default"])(values, state.newOptions); // console.log(newOptions);

      return _objectSpread(_objectSpread({}, oldState), {}, {
        addedOptions: multiple ? newOptions : [newOptions],
        value: values,
        changed: [values, newOptions, e],
        selecting: true
      });
    });
  }, [multiple]);
  var onMouseDown = (0, _react.useCallback)(function (e) {
    if (!closeOnSelect || multiple) {
      e.preventDefault();

      if (multiple) {
        e.target.focus();
      }
    }

    var currentTarget = e.currentTarget;
    setState(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, {
        e: currentTarget
      });
    });
    onSelect(currentTarget.value, currentTarget);
  }, [onSelect, closeOnSelect, multiple]);
  var onKeyDown = (0, _react.useCallback)(function (e) {
    var key = e.key;

    if (key === "ArrowDown" || key === "ArrowUp") {
      e.preventDefault();
      setState(function (oldState) {
        return _objectSpread(_objectSpread({}, oldState), {}, {
          highlighted: (0, _highlightReducer["default"])(oldState.highlighted, {
            key: key,
            options: oldState.flat
          })
        });
      });
    }
  }, []);

  var onSearch = function onSearch(_ref2) {
    var target = _ref2.target;
    var inputVal = target.value;
    var newState = {
      search: inputVal
    };
    var searchableOption = flatDefaultOptions;

    if (getOptions && inputVal.length) {
      newState.searching = true;
      searchableOption = getOptions(inputVal);
    }

    setState(function (oldState) {
      return _objectSpread(_objectSpread({}, oldState), newState);
    });
    Promise.resolve(searchableOption).then(function (foundOptions) {
      var newOptions = foundOptions;

      if (inputVal.length) {
        newOptions = (0, _search["default"])(inputVal, foundOptions, fuse);
      }

      setState(function (oldState) {
        return _objectSpread(_objectSpread({}, oldState), {}, {
          flat: newOptions === false ? foundOptions : newOptions,
          searching: false
        });
      });
    })["catch"](function () {
      return setState(function (oldState) {
        return _objectSpread(_objectSpread({}, oldState), {}, {
          flat: flatDefaultOptions,
          searching: false
        });
      });
    });
  };

  var onKeyPress = (0, _react.useCallback)(function (e) {
    var key = e.key,
        currentTarget = e.currentTarget;

    if (key === "Enter") {
      // onSelect(e.currentTarget.value, e.currentTarget);
      setState(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, {
          e: currentTarget,
          selecting: true,
          focus: true
        });
      }); // onClick();
      // if (!multiple && closeOnSelect) {
      //   onBlur();
      // }
    }
  }, [onSelect, multiple, closeOnSelect]);
  var onKeyUp = (0, _react.useCallback)(function (_ref3) {
    var key = _ref3.key;

    if (key === "Escape") {
      onBlur();
    }
  }, [onBlur]);
  var valueProps = {
    tabIndex: "0",
    readOnly: !canSearch,
    onChange: canSearch ? onSearch : null,
    disabled: disabled,
    onMouseDown: onClick,
    onBlur: onBlur,
    onFocus: onFocus,
    onKeyPress: onKeyPress,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    ref: ref
  };
  var optionProps = (0, _react.useMemo)(function () {
    return {
      tabIndex: "-1",
      onMouseDown: onMouseDown,
      onKeyDown: onKeyDown,
      onKeyPress: onKeyPress,
      onBlur: onBlur,
      name: name
    };
  }, [onMouseDown, onKeyDown, onKeyPress, onBlur]);
  (0, _react.useEffect)(function () {
    setState(function (oldState) {
      return _objectSpread(_objectSpread({}, oldState), {}, {
        value: defaultValue
      });
    });
  }, [defaultValue]);
  (0, _react.useEffect)(function () {
    if (state.changed !== false) {
      setState(function (oldState) {
        return _objectSpread(_objectSpread({}, oldState), {}, {
          changed: false
        });
      });
      onChange.apply(void 0, state.changed);
    }
  }, [state.changed, onChange, onMouseDown]);
  return [{
    value: option,
    highlighted: highlighted,
    options: options,
    display: display,
    disabled: disabled,
    displayValue: displayValue,
    focus: focus,
    search: search,
    searching: searching
  }, valueProps, optionProps, function (newValue) {
    return setState(function (oldState) {
      return _objectSpread(_objectSpread({}, oldState), {}, {
        value: newValue
      });
    });
  }];
}