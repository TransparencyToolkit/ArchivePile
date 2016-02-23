ArchivePile
=========

Archive Pile is a theme for [Mailpile](https://mailpile.is) that is meant as a read-only interface for browsing email archives. Due to Mailpile's design, you can run an instance locally on your laptop (like a normal desktop app) or host it on the web as both are rendered in your web browser.

## Use Cases

- Hosting an archive of an email mailing list on the public web
- Transform customer support emails into a public documentation
- Visualize your personal email archive while still using a different daily client for sending

## Getting Started

Currently, this theme is only suggested on Linux installs of Mailpile. The Windows & Mac installers are meant to use Mailpile as a fully fledged email client, not just an archive.

1. Clone [the source code](https://github.com/mailpile/Mailpile) for Mailpile
2. First [setup and configure](https://github.com/mailpile/Mailpile/wiki/Getting-started-on-linux) Mailpile
3. Clone the [ArchivePile](https://github.com/TransparencyToolkit/ArchivePile) repository into `Mailpile/shared-data/` path
4. Select theme via the Mailpile CLI `set sys.path.html_theme=/full/path/to/ArchivePile`

### Securing Your Instance

Mailpile is not really designed to be used by more than one person whom is not trusted, yet. We have some rudimentary security settings that lockdown and make things unwritable. In the Mailpile CLI type one of the following commands:

- For decent amount of lockdown, type `mailpile> set sys.lockdown = 1`
- Or for even more secure lockdown `mailpile> set sys.lockdown = 2`
- To disable the lockdown `mailpile> set --force sys.lockdown = False`

### Removing Login

If you want to make your read-only ArchivePile / Mailpile instance public without a login screen, do the following command:

`set sys.http_no_auth = true`

### Maintainence

Your Mailpile search index lives in the following locations:

- Debian `~/.local/share/Mailpile/default/`

### Watch Indexing Progress

If you want to see what is going on do `mailpile> set sys.debug = log` and then `mailpile> eventlog/watch`
if it doesn't say it's indexing mail, something is off.
If it is busy doing stuff, then it's busy doing stuff
 (to get out of eventlog/watch, hit CTRL-C)


### Developing Archive Pile

To help develop or extend this theme, please follow our [FrontEnd Development Guide](https://github.com/pagekite/Mailpile/wiki/FrontEnd-Development-Guide)

Eventually, we will flesh out the ability to create alternate skins / styles on top of this read-only theme

