# Parsed Line Examples

## Table of Contents

<!-- toc -->

- [Notes](#notes)
- [Parse](#parse)
- [Write](#write)
  - [An empty file](#an-empty-file)
  - [A minimal entry](#a-minimal-entry)
  - [With specific spacing](#with-specific-spacing)
  - [The comment can optionally include a hash](#the-comment-can-optionally-include-a-hash)
  - [With an empty line](#with-an-empty-line)
  - [With lines that don't have host entries](#with-lines-that-dont-have-host-entries)

<!-- tocstop -->

## Notes

> [!important]
> It's important to understand that while `parse()` returns a mostly full
> structure, `write()` only requires a minimal set of properties.
>
> These examples give you an idea for how it works.

## Parse

For a hosts file

\*_dash represents a space_

```txt
1.2.3.4 hostname1

-#some comment
-5.6.7.8$--hostname2---hostname3----#other comment
```

<!-- prettier-ignore-start -->

<details>
<summary>Here are the parsed lines</summary>

```js
const parsedLines = await parse()
console.log(parsedLines)
// shows
[
  {
    original: '1.2.3.4 hostname1',
    data: {
      ip: '1.2.3.4',
      hostnamesWithSpace: ['hostname1'],
      comment: '',
      space: {
        beforeIp: '',
        afterIp: spaces[1],
        beforeComment: '',
      },
    },
  },
  {
    original: '',
    data: {},
  },
  {
    original: `${spaces[1]}#some comment`,
    data: {},
  },
  {
    original: `${spaces[1]}5.6.7.8${spaces[2]}hostname2${spaces[3]}hostname3${spaces[4]}#other comment`,
    data: {
      ip: '5.6.7.8',
      hostnamesWithSpace: ['hostname2', spaces[3], 'hostname3'],
      comment: '#other comment',
      space: {
        beforeIp: spaces[1],
        afterIp: spaces[2],
        beforeComment: spaces[4],
      },
    },
  },
  {
    original: '',
    data: {},
  },
]
```

</details>

<!-- prettier-ignore-end -->

## Write

### An empty file

```js
await write([])
```

### A minimal entry

```js
await write([
  {
    data: {
      ip: '1.2.3.4',
      hostnamesWithSpace: ['hostname1'],
    },
  },
])
```

```txt
1.2.3.4{tab}hostname1
```

### With specific spacing

```js
await write([
  {
    data: {
      ip: '1.2.3.4',
      hostnamesWithSpace: ['hostname1', spaces[3], 'hostname2'],
      comment: 'some comment',
      space: {
        beforeIp: spaces[1],
        afterIp: spaces[2],
        beforeComment: spaces[4],
      },
    },
  },
])
```

### The comment can optionally include a hash

```js
await write([
  {
    data: {
      ip: '1.2.3.4',
      hostnamesWithSpace: ['hostname1'],
      comment: 'some comment',
      // is the same as
      // comment: '#some comment',
    },
  },
])
```

```txt
1.2.3.4{tab}hostname1{tab}#some comment
```

### With an empty line

```js
await write([
  {
    data: {
      ip: '1.2.3.4',
      hostnamesWithSpace: ['hostname1'],
    },
  },
  {}, // this results in an empty line
  {
    data: {
      ip: '5.6.7.8',
      hostnamesWithSpace: ['hostname2'],
    },
  },
])
```

```txt
1.2.3.4{tab}hostname1

5.6.7.8{tab}hostname2
```

### With lines that don't have host entries

```js
await write([
  { original: '# some comment' }, // no data means there's no host entry
  {
    data: {
      ip: '1.2.3.4',
      hostnamesWithSpace: ['hostname1'],
    },
  },
])
```

```txt
# some comment
1.2.3.4{tab}hostname1
```
