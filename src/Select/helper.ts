import { OptionsType } from "./interface";

export const isItemChecked = (option: OptionsType, item: OptionsType) => item.id ? item.id === option.id : item.value  ===  option.value