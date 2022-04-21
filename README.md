# egg-plugin-server-timing

A Egg Plugin for [Server Timing](https://w3c.github.io/server-timing/)

## Usage

### Install

```bash
$ npm install egg-plugin-server-timing
# or
$ yarn add egg-plugin-server-timing
```

### Config

```typescript
// config/plugin.ts

export default {
  serverTiming: {
    enable: true,
    package: "egg-plugin-server-timing",
  },
};
```

```typescript
// config/config.default.ts
config.serverTiming = {
  name: "Total", // The name of the total metric to be set.
  description: "Total Response Time", // The description of the total metric to be set.
  total: true, // Whether to set the total metric automatically.
  enabled: true, // Whether to enable the plugin.
  autoEnd: true, // Whether to set the metric automatically when the request ends.
  precision: +Infinity, // Number of digits after the decimal point of the statistical time
};
```

### Timing

```typescript
ctx.serverTimer.startTime("all");
await new Promise((resolve) => setTimeout(resolve, 100));
ctx.serverTimer.endTime("all");
```
