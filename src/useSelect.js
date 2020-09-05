import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import highlightReducer from "./highlightReducer";
import getDisplayValue from "./lib/getDisplayValue";
import flattenOptions from "./lib/flattenOptions";
import GroupOptions from "./lib/groupOptions";
import getNewValue from "./lib/getNewValue";
import getOption from "./lib/getOption";
import doSearch from "./search";
import { array } from "prop-types";
function multiInput(multiple, input, options, originOptions, onSelect) {
  if (multiple) {
    const multiValue = Array.isArray(input)
      ? input
      : input.replace(/\，/g, ",").split(",");
    // console.log("inside multi input and to call onselect");
    for (let m of multiValue) {
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
      for (let a of originOptions) {
        // console.log(`value in original options value ` + JSON.stringify(a));
        if (a.type === "group") {
          // console.log("is a group,quiting...");
          return originOptions;
        } else if (a.value === m) {
          // console.log("value exsisted,quitting...");
          return originOptions;
        }
      }
      originOptions.push({ name: m, value: m });
      if (onSelect) onSelect(m);
    }

    return originOptions;
  } else {
    if (onSelect) onSelect(input);
    return options;
  }
}

export default function useSelectSearch({
  value: defaultValue = null,
  disabled = false,
  multiple = false,
  manualAdd = false,
  onRenderUpdate = false,
  search: canSearch = false,
  fuse = false,
  options: defaultOptions,
  arrayOptions = [],
  name,
  onChange = () => {},
  getOptions = null,
  allowEmpty = true,
  closeOnSelect = true,
}) {
  const ref = useRef(null);
  // console.log(arrayOptions);
  const [state, setState] = useState({
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
    changed: false,
  });
  const {
    newOptions,
    selecting,
    addedOptions,
    value,
    display,
    search,
    focus,
    searching,
    highlighted,
    e,
    flat,
  } = state;
  // console.log(`newoptions is ${JSON.stringify(newOptions)}`);

  const flatDefaultOptions = useMemo(() => flattenOptions(newOptions), [
    focus,
    newOptions,
    addedOptions,
    arrayOptions,
  ]);
  // console.log(`flat default options ${JSON.stringify(flatDefaultOptions)}`);
  useEffect(() => {
    if (onRenderUpdate)
      setState({
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
        changed: false,
      });
  }, [defaultOptions]);

  useEffect(() => {
    if (arrayOptions && arrayOptions.length > 0) {
      var updatedOptions = multiInput(
        "multiple",
        arrayOptions,
        [],
        [],
        onSelect
      );
      // console.log(updatedOptions);
      // console.log(flattenOptions(updatedOptions));
      setState({
        addedOptions: [],
        value: defaultValue,
        search: "",

        selecting: false,
        focus: false,
        flat: flatDefaultOptions,
        newOptions: flattenOptions(updatedOptions),
        searching: false,
        e: null,
        highlighted: -1,
        changed: false,
      });
    }
  }, [arrayOptions]);
  useEffect(() => {
    setState((oldState) => ({ ...oldState, flat: flatDefaultOptions }));
  }, [flatDefaultOptions]);
  useMemo(() => {
    if (focus || selecting || !manualAdd) {
      var show = "block";
    } else if (!focus && !selecting) {
      var show = "none";
    }
    setState((prev) => ({ ...prev, display: show }));
  }, [focus, selecting]);

  // console.log(`display value is ${display}`);
  const option = useMemo(() => {
    // console.log("get option on line 111");
    // console.log(value);
    // console.log(flatDefaultOptions);
    // console.log(addedOptions);
    var addedOption = addedOptions ? addedOptions : [];
    let newOption = getOption(value, [...flatDefaultOptions]);

    if (!newOption && !allowEmpty && !multiple) {
      [newOption] = flatDefaultOptions;
    }

    return newOption;
  }, [value, flatDefaultOptions, addedOptions, allowEmpty, multiple]);

  const options = useMemo(() => GroupOptions(flat), [flat, focus, newOptions]);
  const displayValue = useMemo(() => getDisplayValue(option), [option]);

  const onBlur = useCallback(() => {
    setState((oldState) => ({
      ...oldState,
      focus: false,
      selecting: false,
      search: "",
      // flat: flattenOptions(oldState.options),
      highlighted: -1,
    }));
    if (ref.current) {
      ref.current.blur();
    }
  }, [flatDefaultOptions, ref]);
  useEffect(() => {
    // console.log(e);
    if (!search || !manualAdd) return;
    if (newOptions) {
      // console.log(`options before adding new ${JSON.stringify(options)}`);
      var Options = [...newOptions];
      for (let a of Options) {
        if (a.value === search) {
          return;
        }
      }
      Options.push({ name: search, value: search });
    } else {
      Options = [{ name: search, value: search }];
    }
    var updatedOptions = multiInput(
      multiple,
      search,
      Options,
      [...newOptions],
      onSelect
    );
    // console.log("updated options is " + JSON.stringify(updatedOptions));
    // console.log(`options after adding new ${JSON.stringify(Options)}`);
    setState((oldState) => ({
      ...oldState,
      flat: flatDefaultOptions,
      newOptions: flattenOptions(updatedOptions),
    }));
    // console.log(
    //   `options after adding new and flattened ${JSON.stringify(newOptions)}`
    // );
  }, [focus, e]);

  const setFocus = (newFocus) =>
    setState((oldState) => ({ ...oldState, focus: newFocus }));
  const onClick = () => setFocus(!focus);
  const onFocus = () => setFocus(true);
  const onSelect = useCallback(
    (val, e) => {
      // console.log(state);
      // console.log(val);
      // console.log(e);
      setState((oldState) => {
        const defaultItem = oldState.flat[oldState.highlighted];
        const oldStateValue = defaultItem && defaultItem.value;
        const item = val || oldStateValue;

        if (!item) {
          return oldState;
        }
        // console.log(item);

        const values = getNewValue(item, oldState.value, multiple);
        // console.log(values);
        // console.log(oldState);
        const newOptions = getOption(values, state.newOptions);
        // console.log(newOptions);

        return {
          ...oldState,
          addedOptions: multiple ? newOptions : [newOptions],
          value: values,
          changed: [values, newOptions, e],
          selecting: true,
        };
      });
    },
    [multiple]
  );

  const onMouseDown = useCallback(
    (e) => {
      if (!closeOnSelect || multiple) {
        e.preventDefault();

        if (multiple) {
          e.target.focus();
        }
      }
      const { currentTarget } = e;
      setState((prev) => ({ ...prev, e: currentTarget }));

      onSelect(currentTarget.value, currentTarget);
    },
    [onSelect, closeOnSelect, multiple]
  );

  const onKeyDown = useCallback((e) => {
    const { key } = e;

    if (key === "ArrowDown" || key === "ArrowUp") {
      e.preventDefault();

      setState((oldState) => ({
        ...oldState,
        highlighted: highlightReducer(oldState.highlighted, {
          key,
          options: oldState.flat,
        }),
      }));
    }
  }, []);
  const onSearch = ({ target }) => {
    const { value: inputVal } = target;
    const newState = { search: inputVal };

    let searchableOption = flatDefaultOptions;

    if (getOptions && inputVal.length) {
      newState.searching = true;

      searchableOption = getOptions(inputVal);
    }

    setState((oldState) => ({ ...oldState, ...newState }));

    Promise.resolve(searchableOption)
      .then((foundOptions) => {
        let newOptions = foundOptions;

        if (inputVal.length) {
          newOptions = doSearch(inputVal, foundOptions, fuse);
        }

        setState((oldState) => ({
          ...oldState,
          flat: newOptions === false ? foundOptions : newOptions,
          searching: false,
        }));
      })
      .catch(() =>
        setState((oldState) => ({
          ...oldState,
          flat: flatDefaultOptions,
          searching: false,
        }))
      );
  };
  const onKeyPress = useCallback(
    (e) => {
      const { key, currentTarget } = e;

      if (key === "Enter") {
        // onSelect(e.currentTarget.value, e.currentTarget);
        setState((prev) => ({
          ...prev,
          e: currentTarget,
          selecting: true,
          focus: true,
        }));
        // onClick();
        // if (!multiple && closeOnSelect) {
        //   onBlur();
        // }
      }
    },
    [onSelect, multiple, closeOnSelect]
  );

  const onKeyUp = useCallback(
    ({ key }) => {
      if (key === "Escape") {
        onBlur();
      }
    },
    [onBlur]
  );

  const valueProps = {
    tabIndex: "0",
    readOnly: !canSearch,
    onChange: canSearch ? onSearch : null,
    disabled,
    onMouseDown: onClick,
    onBlur,
    onFocus,
    onKeyPress,
    onKeyDown,
    onKeyUp,
    ref,
  };

  const optionProps = useMemo(
    () => ({
      tabIndex: "-1",
      onMouseDown,
      onKeyDown,
      onKeyPress,
      onBlur,
      name,
    }),
    [onMouseDown, onKeyDown, onKeyPress, onBlur]
  );

  useEffect(() => {
    setState((oldState) => ({ ...oldState, value: defaultValue }));
  }, [defaultValue]);

  useEffect(() => {
    if (state.changed !== false) {
      setState((oldState) => ({ ...oldState, changed: false }));
      onChange(...state.changed);
    }
  }, [state.changed, onChange, onMouseDown]);

  return [
    {
      value: option,
      highlighted,

      options,
      display,
      disabled,
      displayValue,
      focus,
      search,
      searching,
    },
    valueProps,
    optionProps,
    (newValue) => setState((oldState) => ({ ...oldState, value: newValue })),
  ];
}
