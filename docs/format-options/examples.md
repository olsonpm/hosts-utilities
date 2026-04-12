# Format Options Examples

## Table of Contents

<!-- toc -->

- [Preserve Formatting](#preserve-formatting)
  - [separatorParts](#separatorparts)
  - [separatorHostname](#separatorhostname)
- [Don't Preserve Formatting](#dont-preserve-formatting)
  - [separatorParts](#separatorparts-1)
  - [separatorHostname](#separatorhostname-1)

<!-- tocstop -->

## Preserve Formatting

`preserveFormatting` is true by default. The following examples show how
separatorParts and separatorHostname work while preserving formatting.

<a name="preserve-separatorparts"></a>

### separatorParts

Given an empty hosts file

```js
await assignHostnames('1.2.3.4', ['hostname1'])
// updates it to
// 1.2.3.4{tab}hostname1
```

to insert a space instead of a tab for new host entries:

````js
await assignHostnames('5.6.7.8', ['hostname2'], { separatorParts: ' ' })
// adds the line
// 5.6.7.8{space}hostname2


<a name="preserve-separatorhostname"></a>

### separatorHostname

Given a hosts file

```txt
1.2.3.4 hostname1{tab}hostname2
````

```js
await assignHostnames('1.2.3.4', ['hostname3'])
// updates /etc/hosts to
// 1.2.3.4 hostname1{tab}hostname2{space}hostname3
```

to insert a tab instead of a space for new hostnames:

```js
await assignHostnames('1.2.3.4', ['hostname4'], { separatorHostname: '\t' })
// updates /etc/hosts to
// 1.2.3.4 hostname1{tab}hostname2{space}hostname3{tab}hostname4
```

## Don't Preserve Formatting

Given a hosts file

```txt
1.2.3.4{space}hostname1{space}#some comment
5.6.7.8{space}hostname2
```

Assigning any hostname will normalize all whitespace

```js
await assignHostnames('5.6.7.8', ['hostname3'], { preserveWhitespace: false })
// updates it to
// 1.2.3.4{tab}hostname1{tab}#some comment
// 5.6.7.8{tab}hostname2{space}hostname3
```

If we assign an existing hostname then the file isn't touched regardless
of whitespace.

Let's reset the host file to show what I mean:

```txt
1.2.3.4{space}hostname1{space}#some comment
5.6.7.8{space}hostname2
```

and assign an existing hostname

```js
await assignHostnames('5.6.7.8', ['hostname2'], { preserveWhitespace: false })
// doesn't modify the hosts file
```

<a name="dont-preserve-separatorparts"></a>

### separatorParts

Let's separate the parts via two spaces instead of a tab.

Given a hosts file

```txt
1.2.3.4{tab}hostname1{tab}#some comment
5.6.7.8{tab}hostname2{tab}hostname3
```

_Note the default separatorHostname is used to separate the hostnames_

```js
await assignHostnames('5.6.7.8', ['hostname4'], {
  preserveWhitespace: false,
  separatorParts: spaces[2],
})
// updates it to: (hyphen represents a space)
// 1.2.3.4--hostname1--#some comment
// 5.6.7.8--hostname2-hostname3-hostname4
```

<a name="dont-preserve-separatorhostname"></a>

### separatorHostname

Let's separate the hostnames by two spaces instead of one

Given a hosts file

```txt
1.2.3.4{space}hostname1{tab}hostname2
```

```js
await assignHostnames('1.2.3.4', ['hostname3'], { separateHostname: spaces[2] })
// updates it to: (hyphen represents a space)
// 1.2.3.4{tab}hostname1--hostname2--hostname3
```
