import React, { useState } from "react";
import SelectSearch from "../src";
import "../style.css";
import classes from "../style.module.css";
import { countries, fontStacks, friends } from "./data";

export default {
  title: "Custom",
};

function renderFontValue(valueProps, snapshot, className) {
  const { value } = snapshot;
  const style = {
    fontFamily: value && "stack" in value ? value.stack : null,
  };

  return (
    <input
      {...valueProps}
      className={className}
      id="test"
      style={style}
      onChange={(e) => console.log(e)}
    />
  );
}

function renderFontOption(props, { stack, name }, snapshot, className) {
  return (
    <button {...props} className={className} type="button">
      <span style={{ fontFamily: stack }}>{name}</span>
    </button>
  );
}

function renderFriend(props, option, snapshot, className) {
  const imgStyle = {
    borderRadius: "50%",
    verticalAlign: "middle",
    marginRight: 10,
  };

  return (
    <button {...props} className={className} type="button">
      <span>
        <img
          alt=""
          style={imgStyle}
          width="32"
          height="32"
          src={option.photo}
        />
        <span>{option.name}</span>
      </span>
    </button>
  );
}

export const FontExample = () => (
  <SelectSearch
    id="fontExample"
    options={fontStacks}
    renderValue={renderFontValue}
    renderOption={renderFontOption}
    value="Monoton"
    multiple
    search
    manualAdd
  />
);

export const AvatarExample = () => (
  <SelectSearch
    className="select-search select-search--multiple"
    options={friends}
    renderOption={renderFriend}
    multiple
    search
    placeholder="Search friends"
  />
);

export const CSSModules = () => {
  console.log("reloading");
  const [array, setArray] = useState(["a", "b", "c", "I am very long"]);
  return (
    <div>
      <SelectSearch
        className={(key) => classes[key]}
        options={[]}
        arrayOptions={array}
        multiple
        search
        printOptions="always"
      />
      <button
        type="button"
        onClick={() => {
          console.log(array);
          const preArray = [...array];
          preArray.push("new");
          setArray(preArray);
        }}
      >
        new option
      </button>
    </div>
  );
};
