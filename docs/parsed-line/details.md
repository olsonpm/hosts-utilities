# Parsed Line Details

## Table of Contents

<!-- toc -->

- [Notes](#notes)
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

## Notes

> [!note]
> This structure has different semantics depending on whether you're parsing or
> writing, and the value of [preserveFormatting][preserve-formatting]. I explain
> how each property works in all scenarios, but let me know if anything is
> confusing. If the current API trips people up, then I should refactor it to
> something easier to reason about.

## At a glance

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

## original

- parse() output
  - this property will always exist and hold the line
- write() input
  - only required if you want to write a line that doesn't use [data](#data).
    Typically this will be for lines containing only comments

## data

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
  - spaces in this array are only used when [preserveFormatting][preserve-formatting] is true.
    When false, [separatorHostname][separator-hostname] will separate each hostname.

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
  - this will only be used when [preserveFormatting][preserve-formatting] is true.
    When false, no space will prepend the IP.

### data.space.afterIp

- parse() output
  - will always be non-empty
- write() input
  - optional. By default, [formatOptions.separatorParts](../format-options/details.md#separatorparts)
    will append the IP
  - must match `/^[ \t]+$/`
  - this will only be used when [preserveFormatting][preserve-formatting] is true.
    When false, [separatorParts][separator-parts] will be used.

### data.space.beforeComment

- parse() output
  - will always be a string
  - when a comment is pased, this will always be non-empty
- write() input
  - optional. By default, [formatOptions.separatorParts](../format-options/details.md#separatorparts)
    will prepend the comment
  - must match `/^[ \t]*$/`
  - this will only be used when [preserveFormatting][preserve-formatting] is true.
    When false, [separatorParts][separator-parts] will be used.

[preserve-formatting]: ../format-options/details.md#preserveformatting
[separator-hostname]: ../format-options/details.md#separatorhostname
[separator-parts]: ../format-options/details.md#separatorparts
