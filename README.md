# Select component for design system

It's a simple draft about how to do a simple and multi select using Lit Elements and made in web components.  

I'd like to highlight, this is a draft which was made for apollion design system, and so you can try and see more on [@apollion-ds/web-components](https://www.npmjs.com/package/@apollion-ds/web-components)

### Some specifications.
- The style of this component was made thinking in [Element-UI#Select](https://element.eleme.io/#/en-US/component/select#select)
- It has a sort method to list all items selected in the top.
- It has a filter method to find the desired item.
- It can select one or more items.
- You can assign a message for items that are not found.
- You can clear only first item selected or all items.

#### Pieces of Select:
- Menu
- Select
- Select Item
- Tag

#### Techs

- Unocss to style.
- Lit Elements to build web-components
- Vite as builder of project.
- Typescript

#### Extra

Looking at Apollion Design System until 2.0.0v the components above has suffered the following changes:
- Select Item become Menu Item
- Menu was refactored and abstracted to work better with other components like dropdowns and nav items
- The Library [floating-ui/dom](https://floating-ui.com/) was implemented to control the menu's behavior.
- the style of all components are different because they were made with design tokens.
- Clickoutside of menu was improved.
- Referece of select element using DOM was improved to access internal methods from events was refactored.
- It was added new imperative methods (setValue, Clear, etc...) which can be access by reference of element using DOM, all these methods to facilitate and integrate with other libraries such as react-hook-forms


**PS:** This Draft was improved and refactored by me in [@apollion-ds/web-components](https://www.npmjs.com/package/@apollion-ds/web-components) and besides you can take a look it working in react
[@apollion-ds/react](https://www.npmjs.com/package/@apollion-ds/react)


---
#### Additional Ideas
- Improve perfomance of items that are being rendered using virtual dom while scrolling to render less item than necessary and load page faster.
- Add new callbacks to control filter method and sort method.
- Add a new feature to make async searches like request google api of your desired location.
