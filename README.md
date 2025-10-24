# Battlefield 6 Portal — Game Mode Template

A flexible, Portal-Editor friendly template for building **any** multiplayer game mode in Battlefield 6.
This repository is _not_ a single gamemode — it's a reusable foundation and utility set you can drop into the Portal Editor and extend to create Capture, King of the Hill, Gun Game, Last Man Standing, Objective Rush, or whatever competitive/coop mode you want.

> [!IMPORTANT]
> If you use these helper utilities or code, please credit **TastySyntax** in your mod description.

---

## Prerequisites

Nodejs needs to be installed on your Computer. It can be downloded [here](https://nodejs.org/en/download). Its needed to execute the provided build scripts in this template. 

---

## How to use this template (quick start)

1. Clone or download this repository
2. (Optional) Execute `npm run init` in the console to download our helper library
    - any additional librarys can be included by creating a `libs` folder - all typescript files will be included in the final build
3. Create your Portal Experience via TypeScript Code inside the `src/` folder 
    - all folders and typescript files inside this folder will be included in the final build
4. Run `npm run build` to create a single file containing the code (will be output to `dist/mod.ts`) 
5. Copy/Upload the created `mod.ts` into the Portal Edtior

---

## Files and Folders

- `.portal/`          - contains all typescript definitions provided in PortalSDK
- `libs/`             - External lib files can be put here, they will be bundled into the final script
- `maps/`             - Put your .tscn and .spacial.json files from godot for save keeping
- `src/`              - Contains all the source code for your mod 
    - `classes/`      - Will be put before the main code, so all classes are defined before usage
    - `types.ts`      - For your typescript types -> will be put below all variables
    - `variables.ts`  - All global variables -> will be put on top of the final build
    - `main.ts`       - Should contain all Eventhandlers and main logic -> will be put at the bottom of the bundle
- `workspaces`        - Here you can put exports of your Portal editor workspace so others can import it
 
## License & credits

- Template & helper utilities by **TastySyntax** — please include attribution when publishing or sharing.
- This repo is intended as a community starting point. Respect any Portal Editor / EA platform rules when you publish.
