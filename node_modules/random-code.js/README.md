# Random-code.js

Random-code.js is a library for generate random codes

## Installation

```bash
npm install random-code.js
```

## Usage

> Generate Random Code With Default Options (length = 8)

```javascript
const randomCode = require("random-code.js");

console.log(randomCode.generateOne()); // sITp9uJw
```

> Generate Random Code With Custom Length

```javascript
const randomCode = require("random-code.js");

console.log(randomCode.generateOne({
  length: 12
})); // uImr9EqYCN4P
```

> Generate Random Code With Prefix

```javascript
const randomCode = require("random-code.js");

console.log(randomCode.generateOne({
  prefix: "hello-"
})); // hello-ZVy2eVzw
```

> Generate Random Code With Postfix

```javascript
const randomCode = require("random-code.js");

console.log(randomCode.generateOne({
  postfix: "-world"
})); // FiutVAaq-world
```

> Generate Random Code With Custom Length & Prefix & Postfix

```javascript
const randomCode = require("random-code.js");

console.log(randomCode.generateOne({
  length: 12,
  prefix: "hello-",
  postfix: "-world"
})); // hello-q38AL3eAA7GA-world
```