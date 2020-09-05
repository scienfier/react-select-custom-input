import React, { useState } from "react";
import SelectSearch from "../src";
import "../style.css";
import { countries, fontStacks } from "./data";

export default {
  title: "Async",
};

export const Fetch = () => (
  <SelectSearch
    options={[]}
    getOptions={() => [
      { value: "hamburger", name: "Hamburger" },
      { value: "fries", name: "Fries" },
      { value: "milkshake", name: "Milkshake" },
    ]}
    search
    placeholder="Your favorite drink"
  />
);
