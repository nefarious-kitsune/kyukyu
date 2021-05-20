## Admin Commands

## Changing command prefix

- `?kyukyu prefix` (see current bot prefix)
- `?kyukyu prefix +` (change prefix to '+')

## Changing language

- `?kyukyu lang` (see current bot language)
- `?kyukyu lang zht` (change language to Chinese)

## Disabling commands
Disable certain bot commands.
`help`, `kyukyu`, and `greet` cannot be banned.

- `?kyukyu disable` (list all banned commands)
- `?kyukyu disable wof trophies` (add `wof` and `trophies` to list of banned commands)

## Enabling commands

- `?kyukyu enable wof` (remove `wof` from list of banned commands)
- `?kyukyu enable all` (reset list of banned commands)

## Setting bot channels

Set where people can run bot commands.
`kyukyu` command is not subject to channel restriction.

- `?kyukyu bot-channel` (list all bot channels)
- `?kyukyu bot-channel all` (allow bot commands in all channels)
- `?kyukyu bot-channel #general #help` (only allow bot commands in #general and #help channels)
