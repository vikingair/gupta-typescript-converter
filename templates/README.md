# Gupta Typescript Converter Guide

The code was transpiled automatically and the commit history of the generator can be found
[here in its repo](https://github.com/vikingair/gupta-typescript-converter).

This file contains the used generator version in its name, i.e. `README.<version>.md`.

## Gupta Tips

- **GT1**: *Late Bound* - The method is likely to be reimplemented by an inheriting class and the last used implemented method will be used. You can right click on the usage and let the IDE show you all implementations. In Gupta code this usually looks like `Call ..method()` where `..` indicates the late bound.
- **GT2**: *Late Bound* - Same as GT1, but invoked on objects that don't allow early bind invocations known to the compiler. Looks in Gupta like `obj..method()` where `..` indicates the late bound and `.` would be an early bound.
