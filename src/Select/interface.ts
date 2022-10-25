export type OptionsType = {
  id?: string | number
  value: string | number
  label: string | number
}

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
}