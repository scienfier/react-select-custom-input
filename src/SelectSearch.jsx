import React, {
  forwardRef,
  memo,
  createRef,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import useSelect from "./useSelect";
import { optionType } from "./types";
import Option from "./Components/Option";
import isSelected from "./lib/isSelected";
// import getOption from "./lib/getOption";

const SelectSearch = forwardRef(
  (
    {
      value: defaultValue,
      disabled,
      placeholder,
      multiple,
      search,
      autoFocus,
      autoComplete,
      options: defaultOptions,
      onChange,
      arrayOptions = [],
      id,
      name = id,
      onBlur,
      printOptions,
      closeOnSelect,
      className,
      manualAdd,
      onRenderUpdate,
      renderValue,
      renderOption,
      renderGroupHeader,
      getOptions,
      fuse,
    },
    ref
  ) => {
    const selectRef = createRef();
    const [snapshot, valueProps, optionProps] = useSelect({
      options: defaultOptions,
      value: defaultValue,
      multiple,
      disabled,
      fuse,
      manualAdd,
      onRenderUpdate,
      search,
      name,
      onBlur,
      onChange,
      arrayOptions,
      getOptions,
      closeOnSelect,
      allowEmpty: !!placeholder,
    });

    const {
      focus,
      highlighted,
      value,
      display,
      options,

      searching,
      displayValue,
      search: searchValue,
    } = snapshot;

    const cls = useCallback(
      (key) => {
        if (typeof className === "function") {
          console.log(key);
          console.log(className(key));
          return className(key);
        }

        if (key.indexOf("container") === 0) {
          return key.replace("container", className);
        }

        if (key.indexOf("is-") === 0 || key.indexOf("has-") === 0) {
          return key;
        }

        return `${className.split(" ")[0]}__${key}`;
      },
      [className]
    );

    const wrapperClass = [
      cls("container"),
      disabled ? cls("is-disabled") : false,
      searching ? cls("is-loading") : false,
      focus ? cls("has-focus") : false,
    ]
      .filter((single) => !!single)
      .join(" ");

    const inputValue = focus && search ? searchValue : displayValue;

    useEffect(() => {
      const { current } = selectRef;

      if (!current) {
        return;
      }

      let query = null;

      if (highlighted > -1) {
        query = `[data-index="${highlighted}"]`;
      } else if (value && !multiple) {
        query = `[data-value="${escape(value.value)}"]`;
      }

      const selected = current.querySelector(query);

      if (selected) {
        const rect = current.getBoundingClientRect();
        const selectedRect = selected.getBoundingClientRect();

        current.scrollTop =
          selected.offsetTop - rect.height / 2 + selectedRect.height / 2;
      }
    }, [focus, value, highlighted, selectRef, multiple, display, arrayOptions]);

    let shouldRenderOptions;

    switch (printOptions) {
      case "never":
        shouldRenderOptions = false;
        break;
      case "always":
        shouldRenderOptions = true;
        break;
      case "on-focus":
        shouldRenderOptions = focus;
        break;
      default:
        shouldRenderOptions = !disabled && (focus || multiple);
        break;
    }

    return (
      <div ref={ref} className={wrapperClass}>
        {(!multiple || placeholder || search) && (
          <div className={cls("value")}>
            {renderValue(
              {
                ...valueProps,
                placeholder,
                id,
                name,
                autoFocus,
                autoComplete,
                value: inputValue,
              },
              snapshot,
              cls("input")
            )}
          </div>
        )}
        {shouldRenderOptions && (
          <div className={cls("select")} ref={selectRef}>
            <ul className={cls("options")} style={{ display: display }}>
              {options.map((option) => {
                const isGroup = option.type === "group";
                const items = isGroup ? option.items : [option];
                const base = { cls, optionProps, renderOption };
                const rendered = items.map((o) => (
                  <Option
                    key={o.value}
                    selected={isSelected(o, value)}
                    highlighted={highlighted === o.index}
                    {...base}
                    {...o}
                  />
                ));

                if (isGroup) {
                  return (
                    <li role="none" className={cls("row")} key={option.groupId}>
                      <div className={cls("group")}>
                        <div className={cls("group-header")}>
                          {renderGroupHeader(option.name)}
                        </div>
                        <ul className={cls("options")}>{rendered}</ul>
                      </div>
                    </li>
                  );
                }

                return rendered;
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

SelectSearch.defaultProps = {
  className: "select-search",
  disabled: false,
  search: false,
  multiple: false,
  manualAdd: false,
  onRenderUpdate: false,
  placeholder: null,
  display: "none",
  autoFocus: false,
  autoComplete: "off",
  value: "",
  onChange: () => {},
  printOptions: "auto",
  closeOnSelect: true,
  renderOption: (domProps, option, snapshot, className) => (
    // eslint-disable-next-line react/button-has-type

    <button type="button" className={className} {...domProps}>
      {option.name}
    </button>
  ),

  renderGroupHeader: (name) => name,
  renderValue: (valueProps, snapshot, className) => (
    <input {...valueProps} className={className} />
  ),
  fuse: {
    keys: ["name", "groupName"],
    threshold: 0.3,
  },
  getOptions: null,
  arrayOptions: null,
};

SelectSearch.propTypes = {
  options: PropTypes.arrayOf(optionType).isRequired,
  getOptions: PropTypes.func,
  arrayOptions: PropTypes.array,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  multiple: PropTypes.bool,
  manualAdd: PropTypes.bool,
  onRenderUpdate: PropTypes.bool,
  search: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  display: PropTypes.string,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  printOptions: PropTypes.oneOf(["auto", "always", "never", "on-focus"]),
  closeOnSelect: PropTypes.bool,
  renderOption: PropTypes.func,
  renderGroupHeader: PropTypes.func,
  renderValue: PropTypes.func,
  fuse: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      keys: PropTypes.arrayOf(PropTypes.string),
      threshold: PropTypes.number,
    }),
  ]),
};

export default memo(SelectSearch);
