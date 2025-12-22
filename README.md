# gupta-typescript-converter

This converter can transform a Gupta code based repository to not-exucatable TypeScript code.

The purpose is to make the Gupta code more readable and navigatable.

The assumed Gupta repository structure is as follows:

- `LCL` (optional; containing library *.apl files)
- `ShareableFiles` (optional; containing library *.apl files)
- Application main file (e.g. `./Sources/SOME_APP.apt`)

## Usage

**Prerequisites:** Install `bun` and `pnpm`.

- Clone the repo
- Run `pnpm install`
- Add executable to your `PATH`
- Run via `gupta-typescript-converter convert ./Sources/SOME_APP.apt`
