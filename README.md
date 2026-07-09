# Image Editor

Browser image editor that can crop and apply filter to your image (test task for LiveArt)

Technologies used: 
- Vue 3
- Vuetify 3
- Pinia 
- Cropper.js

## Key Decisions

- Non-destructive edits, it works by storing your image data alongside applied filters, so you can get to any point in history of your decisions using **RESET**, **UNDO** and **REDO** actions
- You can preview filters in a real-time before applying it. Or you can reset them if you don't like the result, choice is yours.
- Filters are applied immediately, so you can "stack" filters on your image.
- **useCropper** composable contains all library-related code, in case library gets deprecated.
- AI was used to create some functions, but was always double-checked.

## Trade-offs

- Applying filters is a choice to make. So if you liked how you stylized your image with filters, make sure to apply them, before jumping between your decisions, otherwise you will lose them.
- Bonus hasn't been attempted.
