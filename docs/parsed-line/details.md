## Parsed Line Details

<!-- toc -->

- [Parsed Line Details](#parsed-line-details)
  - [At a glance](#at-a-glance)
  - [original](#original)
  - [data](#data)
  - [data.ip](#dataip)
  - [data.hostnamesWithSpace](#datahostnameswithspace)
  - [data.comment](#datacomment)
  - [data.space.beforeIp](#dataspacebeforeip)
  - [data.space.afterIp](#dataspaceafterip)
  - [data.space.beforeComment](#dataspacebeforecomment)

<!-- tocstop -->

### At a glance

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

### original

- parse() output
  - this property will always exist and hold the line
- write() input
  - only required if you want to write a line that doesn't use [data](#data).
    Typically this will be for lines containing only comments

### data

- parse() output
  - if no host entry was parsed, it will be an empty object, otherwise it will
    be the full structure.
- write() input
  - this is only required if you want to write a structured parsed line.
  - When present, the [ip](#dataip) and [hostnamesWithSpace](#datahostnameswithspace)
    are required.
  - When omitted, [original](#original) will be written instead.

### data.ip

- parse() output
  - will always have an ip address
- write() input
  - a required property matching the regex `/^[^#\s]+$/`

### data.hostnamesWithSpace

- parse() output
  - will always have at least one hostname
- write() input
  - a required property with at least one element
  - elements must match either `/^[^#\s]+$/` or `/^[ \t]+$/`

### data.comment

- parse() output
  - defaults to an empty string
  - when a comment was parsed, it contains the hash prefix
- write() input
  - an optional string
  - the hash prefix is optional

### data.space.beforeIp

- parse() output
  - will always be a string
- write() input
  - optional. By default, no space will prepend the IP
  - must match `/^[ \t]*$/`

### data.space.afterIp

- parse() output
  - will always be non-empty
- write() input
  - optional. By default, [formatOptions.separatorParts](../format-options/details.md#separatorparts)
    will append the IP
  - must match `/^[ \t]+$/`

### data.space.beforeComment

- parse() output
  - will always be a string
  - when a comment is pased, this will always be non-empty
- write() input
  - optional. By default, [formatOptions.separatorParts](../format-options/details.md#separatorparts)
    will prepend the comment
  - must match `/^[ \t]*$/`
