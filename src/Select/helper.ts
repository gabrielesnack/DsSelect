import { OptionsType } from "./interface";

export const isChecked = (option: OptionsType, itemOfChecked: OptionsType) =>
  itemOfChecked.id
    ? itemOfChecked.id === option.id
    : itemOfChecked.value === option.value;

export const isOptionChecked = (
  option: OptionsType,
  listOfChecked: OptionsType[]
) => {
  return !!listOfChecked.find((item) => isChecked(option, item));
};

export const sliceLabel = (label: string | number) => `${label.toString().slice(0,10)}...` 

export const sortByItemsChecked = (
  options: OptionsType[],
  optionsChecked: OptionsType[]
) => {
  if (!optionsChecked.length) return options;

  const clonedOptions = options.slice();

  return clonedOptions.sort((firstOption, secondOption) => {
    let firstIsChecked = !!optionsChecked.find((option) =>
      isChecked(option, firstOption)
    );
    let secondIsChecked = !!optionsChecked.find((option) =>
      isChecked(option, secondOption)
    );

    if (firstIsChecked && secondIsChecked) return 0; // don't worry about sort order
    if (firstIsChecked && !secondIsChecked) return -1; // sort first before second

    return 1; // sort second after first
  });
};

export const filterByLabel = (label: string, options: OptionsType[]) => {
  const regex = new RegExp(`${label.toLocaleLowerCase()}`);
  const filterFn = (option: OptionsType) =>
    option.label.toString().toLocaleLowerCase().match(regex);

  return options.filter(filterFn);
};
