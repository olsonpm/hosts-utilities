# Hosts Utilities - Beta

## Table of Contents

<!-- toc -->

- [What is it?](#what-is-it)
- [Why did I make this library?](#why-did-i-make-this-library)
- [Why is it in beta?](#why-is-it-in-beta)
- [Install](#install)
- [Use](#use)
- [API](#api)
  - [hostsPath](#hostspath)
  - [parse](#parse)
  - [removeHostnames](#removehostnames)
  - [assignHostnames](#assignhostnames)
  - [write](#write)
- [Schemas](#schemas)
  - [Parse Options](#parse-options)
  - [Remove Hostnames Options](#remove-hostnames-options)
  - [Assign Hostnames Options](#assign-hostnames-options)
  - [Write Options](#write-options)
  - [Format Options](#format-options)
  - [Parsed Line](#parsed-line)

<!-- tocstop -->

## What is it?

A few node utilities for working with your hosts file, inspired by [Hostile][hostile]

> [!note]
> If you're looking for a CLI frontend, [raise an issue][raise-an-issue]
> and I'll write one.

## Why did I make this library?

I wanted to programatically work with my hosts file while maintaining
formatting. Hostile doesn't seem to be maintained anymore and lacks features
I was looking for.

## Why is it in beta?

Because I haven't worked much with hosts files and can't be confident in the
code until it's used in the real world.

The hosts file seems simple, but in my experience, real-world implementations of
anything are quirky.

## Install

```sh
npm install hosts-utilities
```

## Use

Assume a hosts file `/etc/hosts`

```txt
1.2.3.4 hostname1
```

We can add `hostname2` using `assignHostnames`

```js
import * as hosts from 'hosts-utilities'

await hosts.assignHostnames('1.2.3.4', ['hostname2'])

// updates /etc/hosts to
// 1.2.3.4 hostname1 hostname2
```

## API

> [!note]
> Both named and sub-path exports are available. Paths are kebab-cased.<br />
> Example:
>
> ```js
> import { hostsPath } from 'hosts-utilities'
> // or
> import hostsPath from 'hosts-utilities/hosts-path'
> ```

### hostsPath

A string

- On windows: `C:\Windows\System32\drivers\etc\hosts`
- On not windows: `/etc/hosts`

### parse

**What is it\?**

- A function which parses the hosts file

**Why use it\?**

- This let's you perform your own logic on the hosts file. For example, you
  could parse it, modify the parsed lines, then call `write(updatedParsedLines)`

**Signature**

- async (options: [ParseOptions](#parse-options) = {}) => [ParsedLine](#parsed-line)[]

**Examples**

- [here's an example](docs/parsed-line/examples.md#parse) of a parsed file

```js
const parsedLines1 = await parse()
const parsedLines2 = await parse({ filePath: '/path/to/custom/hosts' })
```

### removeHostnames

**What is it\?**

- A function removing the hostnames from a hosts file

**Why use it\?**

- Self explanatory

**Signature**

- async (hostnames: string[], options: [RemoveOptions](#remove-hostnames-options) = {}) => `undefined`
  - hostnames must match `/^[^#\s]+$/`

**Examples**

Let's assume a file /etc/hosts with

```txt
1.2.3.4 hostname1
5.6.7.8 hostname2 hostname3
```

```js
await removeHostnames(['hostname1', 'hostname2'])
// updates /etc/hosts to
// 5.6.7.8 hostname3
```

### assignHostnames

**What is it?**

- A function to add or update host entries

**Why use it?**

- To add hostnames to an existing entry, or add a new entry

**Signature**

- async (ip: string, hostnames: string[], options: [AssignOptions](#assign-hostnames-options) = {}) => `undefined`
  - ip and hostnames must match `/^[^#\s]+$/`

**Examples**

Assume a file /etc/hosts with

```txt
1.2.3.4 hostname1 hostname2
```

```js
await assignHostnames('1.2.3.4', ['hostname1', 'hostname3'])
// updates /etc/hosts to
// 1.2.3.4 hostname1 hostname2 hostname3

await assignHostnames('5.6.7.8', ['hostname4'])
// adds the line
// 5.6.7.8 hostname4
```

### write

**What is it\?**

- A function to write `parsedLines` to the host file

**Why use it\?**

- Like [parse](#parse), this lets you perform your own logic on the hosts file.
  For example, you could parse it, modify the parsedLines, then write them.

**Signature**

- async (parsedLines: [ParsedLine](#parsed-line)[], options: [WriteOptions](#write-options) = {}) => `undefined`

**Examples**

- [here are some examples](docs/parsed-line/examples.md#write) of writing your
  own parsedLines

```js
const parsedLines = await parse()
const updatedLines = doSomethingTo(parsedLines)
await write(updatedLines)
```

## Schemas

### Parse Options

```ts
{
  // default: hostsPath
  // validation: minimum of one character
  filePath?: string
}
```

### Remove Hostnames Options

> [!warning]
> The option `withIp` is provided because [Hostile supports it][hostile-supports-remove-by-ip],
> meaning I assume someone found it helpful. Keep in mind hosts shouldn't be
> mapped to more than one IP address, so `withIp` should be unnecessary.

Includes [FormatOptions](#format-options)

```ts
FormatOptions & {
  // default: hostsPath
  // validation: minimum of one character
  filePath?: string

  // default: undefined (removes hostnames for all ips)
  // validation: matches /^[^#\s]+$/
  withIp?: string
}
```

### Assign Hostnames Options

Includes [FormatOptions](#format-options)

```ts
FormatOptions & {
  // default: hostsPath
  // validation: minimum of one character
  filePath?: string
}
```

### Write Options

Includes [FormatOptions](#format-options)

```ts
FormatOptions & {
  // default: hostsPath
  // validation: minimum of one character
  filePath?: string
}
```

### Format Options

> [!note]
> Due to complexity, these options may not behave as you expect.
>
> - [See details here](docs/format-options/details.md)
> - [and examples here](docs/format-options/examples.md)

At a glance

```ts
{
  preserveFormatting?: boolean = true
  separatorParts?: string = '\t'
  separatorHostname?: string = ' '
}
```

### Parsed Line

> [!note]
> Due to complexity, this structure may not work how you expect.
>
> - [See details here](docs/parsed-line/details.md)
> - [and examples here](docs/parsed-line/examples.md)

At a glance

```ts
{
  original: string
  data: {
    ip: string
    hostnamesWithSpace: string[]
    comment: string
    space: {
      beforeIp: string
      afterIp: string
      beforeComment: string
    }
  }
}
```

[hostile]: https://github.com/feross/hostile
[hostile-supports-remove-by-ip]: https://github.com/feross/hostile?tab=readme-ov-file#remove-a-rule-from-etchosts
[raise-an-issue]: https://github.com/olsonpm/hosts-utilities/issues/new
