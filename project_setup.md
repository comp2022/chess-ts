## Instructions on setting up a project with this configuration
Based on [this article](https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c) by Carl-Johan Kihl.

If you want to clone *this* specific project, clone the repo and `npm install`.

Using: 
- TypeScript
- Jest
- NPM publishing (todo)

## Init project
`npm init` and follow steps.

If using git; make sure the following is in `.gitignore`:
```
/lib
node_modules
```

Create a `src` folder under root. This is where all code goes.

## Install Typescript

`npm install typescript --save-dev`

Optional: install `rimraf`, `npm install rimraf --save-dev` - cross-platform `rm -rf` to clear build before re-compiling.

## Install Jest

`npm install  --save-dev jest ts-jest @types/jest`

## Configure TS

We use two tsconfig files - one for building, and one for development/testing.

Create `tsconfig.json` in the root folder like so:

```json
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "noEmit": true,
        "strict": true
    },
    "include": ["src"],
    "exclude": ["node_modules"]
}
```

Importantly, we have `noEmit` set to `true` here. This config is for jesting only.

Create `tsconfig.build.json`, a tsconfig just for building:

```json
{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "declaration": true,
        "outDir": "./lib",
        "noEmit": false

    },
    "exclude": ["node_modules", "**/__tests__/*"]
}
```
We use `extends` to inherit all properties from the base tsconfig.

- `declaration: true` builds .d.ts files so that types can be used in other projects.
- `outDir` defines where we build our project to, in this case the folder `lib`.
- We override `noEmit` here to false so that we build the files and output them.

We also excluse the tests folders/files from building. They are included in the base tsconfig so we get type checking when writing unit tests. Note that this setup expects *all* tests to be done in a `__tests__` folder.

Finally, add the build script to package.json:
```json
"scripts": {
    "build": "rimraf ./lib && tsc -p tsconfig.build.json"
},
```
- `rimraf ./lib`: delete all files in `./lib`
- `tsc -p tsconfig.build.json`: compile the TS using the config at `tsconfig.build.json` (which builds to `./lib`).

To compile, run `npm run build` (this will fail if you have no files in `src`, or if the folder doesn't exist). It will transpile what's in `src` to JavaScript & generate .d.ts files all to `lib`.

Final file structure:
```
- /lib
- /node_modules
- /src
- .gitignore (if using git)
- package-lock.json
- package.json
- tsconfig.json
- tsconfig.build.json
```

## Configure Jest

Create a `jestconfig.json` in root:
```json
{
    "transform": {
      "^.+\\.(t|j)sx?$": "ts-jest"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleFileExtensions": ["ts", "json", "tsx", "js", "jsx", "node"]
}
```
Note that this setup expects *all* tests to be done in a `__tests__` folder.

Add a test script to `package.json`:
```json
"scripts": {
    "build": "rimraf ./lib && tsc -p tsconfig.build.json",
    "test": "jest --config jestconfig.json"
},
```

To run all tests: `npm run test`.