# Format Options Details

These options can be passed to any utility which writes to a hosts file.

## Table of Contents

<!-- toc -->

- [Notes](#notes)
- [At a glance](#at-a-glance)
- [preserveFormatting](#preserveformatting)
- [separatorParts](#separatorparts)
- [separatorHostname](#separatorhostname)

<!-- tocstop -->

<br />

## Notes

> [!note]
> Preserving whitespace complicates the API. It's on by default because the
> hosts file is shared; it feels like the polite thing to do.
>
> I noted potential gotchas, but please understand that the simple approach is
> to normalize whitespace rather than conform to it.

> [!important]
> When you choose not to preserve formatting, `separatorParts` and
> `separatorHostname` apply to the whole file rather than just the lines you
> modify. If this trips you up then [raise an issue][raise-an-issue] so we can
> figure out your use case.

<br />

## At a glance

```ts
{
  preserveFormatting?: boolean = true
  separatorParts?: string = '\t'
  separatorHostname?: string = ' '
}
```

<br />

## preserveFormatting

- Default: `true`
- Preserve the whitespace in the hosts file
  - Note this library doesn't detect spacing when adding entries. See [this example](./examples.md#preserve-separatorhostname) for reference
- If you pass `false` then each parsed line in the file will be formatted using `separatorParts` and `separatorHostname`
  - See [this example](./examples.md#dont-preserve-formatting) for reference.

<br />

## separatorParts

- Default: `\t`
- What are "parts"?<br/>
  The ip, the hostnames, and comment.<br/>
  e.g.

  ```txt
  separatorParts           separatorParts
       v                         v
  {ip}   {hostname1} {hostname2}   {comment}
  |--|   |---------------------|   |-------|
  ```

- When `preserveFormatting` is false, this space is used for **all** parsed lines.
- When `preserveFormatting` is true, this space is used for **added** parts.
  - See [this example](./examples.md#preserve-separatorparts) for reference
- Must match `/^[ \t]+$/`

<br />

## separatorHostname

- Default: `' '`
- When `preserveFormatting` is false, this space separates **all** hostnames.
- When `preserveFormatting` is true, this space is used for **added** hostnames.
  - See [this example](./examples.md#preserve-separatorhostname) for reference
- Must match `/^[ \t]+$/`

[raise-an-issue]: https://github.com/olsonpm/hosts-utilities/issues/new
