import { OptionsType } from "./interface";

export const isItemChecked = (option: OptionsType, item: OptionsType) => item.id ? item.id === option.id : item.value  ===  option.value

export const sortByItemsChecked = (options: OptionsType[], optionsChecked: OptionsType[]) => {
  if (!optionsChecked.length) return options;

  const clonedOptions = options.slice();

  return clonedOptions.sort((firstOption, secondOption) => {
    let firstIsChecked = !!optionsChecked.find((option) => isItemChecked(option, firstOption))
    let secondIsChecked = !!optionsChecked.find((option) => isItemChecked(option, secondOption))
  
    if (firstIsChecked && secondIsChecked ) return 0; // don't worry about sort order
    if (firstIsChecked && !secondIsChecked) return -1; // sort first before second
  
      return 1 // sort second after first
  })
} 

export const filterByLabel = (label: string, options: OptionsType[]) => {
  const regex = new RegExp(`${label.toLocaleLowerCase()}`)
  const filterFn = (option: OptionsType) => option.label.toString().toLocaleLowerCase().match(regex)

  return options.filter(filterFn);
}