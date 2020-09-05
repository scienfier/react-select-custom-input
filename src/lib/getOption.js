export default function getOption(value, defaultOptions) {
  // console.log(
  //   "get option in searching:" +
  //     JSON.stringify(value) +
  //     "default options is :" +
  //     JSON.stringify(defaultOptions)
  // );

  if (value && defaultOptions.length > 0) {
    if (Array.isArray(value)) {
      return value.map((singleValue) =>
        defaultOptions.find((option) => option.value === singleValue)
      );
    }

    return defaultOptions.find((option) => option.value === value) || null;
  }

  return null;
}
