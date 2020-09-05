import React from "react";
import SelectSearch from "../src";
import "../style.css";
import { countries } from "./data";

export default {
  title: "Multiple select",
};

export const Default = () => (
  <SelectSearch
    className="select-search select-search--multiple"
    options={[
      { value: "hamburger", name: "Hamburger" },
      { value: "fries", name: "Fries" },
      { value: "milkshake", name: "Milkshake" },
    ]}
    multiple
  />
);

export const WithPlaceholder = () => (
  <SelectSearch
    className="select-search select-search--multiple"
    options={[]}
    multiple
    id="hello"
    autoComplete="off"
    search
    placeholder="Select your items manuual add"
    manualAdd
    onChange={(e, a, b) => {
      try {
        console.log(b.parentNode);
      } catch (e) {
        console.log(e);
      }
    }}
  />
);

export const Search = () => (
  <SelectSearch
    options={countries}
    multiple
    search
    manualAdd
    placeholder="Select your country"
  />
);

export const Group = () => (
  <SelectSearch
    options={[
      {
        name: "Food",
        type: "group",
        items: [
          {
            value: "hamburger",
            name: "Hamburger",
          },
          {
            value: "pizza",
            name: "Pizza",
          },
        ],
      },
      {
        name: "Drinks",
        type: "group",
        items: [
          {
            value: "soft",
            name: "Soft drink",
          },
          {
            value: "beer",
            name: "Beer",
          },
        ],
      },
    ]}
    multiple
    manualAdd
    search
  />
);

export const OnFocus = () => (
  <SelectSearch
    options={[
      { value: "hamburger", name: "Hamburger" },
      { value: "fries", name: "Fries" },
      { value: "milkshake", name: "Milkshake" },
    ]}
    multiple
    printOptions="on-focus"
    placeholder="Select your items"
  />
);
