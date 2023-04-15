##### REFACTOR REQS
Node v16.14.2
React Minimum version: v17.0.0
TypeScript Minimum version: v3.5

##### Updated the ff to latest:
"react-scripts": "^5.0.1",
"@types/react": "^18.0.9",
"@types/react-dom": "^18.0.4",
"@fortawesome/fontawesome-svg-core": "^6.1.1",
"@fortawesome/free-regular-svg-icons": "^6.1.1",
"@fortawesome/free-solid-svg-icons": "^6.1.1",
"@fortawesome/react-fontawesome": "^0.1.18",

#### REMOVE THE FF PACKAGES 02/20/2023 ####
"@material-ui/core": "^4.11.3",
"@material-ui/pickers": "^3.3.10",
"@material-ui/styles": "^4.11.4",

### MUI MIGRATION NOTES
Guide: https://mui.com/material-ui/guides/migration-v4/
TODO: Migrate & Clean up
1. Remove old imports from @material-ui/*. Imports must come from @mui/* from now on
2. We need to remove JSS, since we will be using Emotion style library (@see https://mui.com/material-ui/guides/migration-v4/#style-library).
    codemods might help migrating codes from JSS: Run `npx @mui/codemod v5.0.0/jss-to-styled src/components/<path or folder name here>`

3. Migrate @material-ui/pickers, to use @mui/lab You can follow https://mui.com/material-ui/guides/migration-v4/#material-ui-pickers
https://mui.com/material-ui/guides/pickers-migration/

Note: while we are doing each component migration, please clean up the code whenever necessary


##### Fixes done on errors after upgrading @types/react
1. File: src/components/common/DrawerComp.tsx
Error: Error in toggleDrawer
Solution applied: https://stackoverflow.com/questions/42261783/how-to-assign-the-correct-typing-to-react-cloneelement-when-giving-properties-to
Suggestion: Revisit this component, check if component functions ok after the fix

2. File: src/components/common/elements/Label.tsx
Error: Label style issues due to theme
Solution: Comment out the use of theme, and replace the 'children' type from 'React.FC' to 'any'
Suggestion: Revisit this component, then apply an appriate fix


3. File: src/components/common/elements/IButton.d.ts
Error: Type 'string | xxx...' is not assignable to type 'ReactNode'..
Solution: Added 'any' to type to ignore errors
Suggestion: Revisit this component, then apply an appriate fix


4. File: src/components/common/navigation/Topnav.tsx
Error: SX.Element' is not assignable to type 'ReactNode'
Tmp Solution: Commented out the code producing the error
Suggestion: Revisit this component, then apply an appriate fix







