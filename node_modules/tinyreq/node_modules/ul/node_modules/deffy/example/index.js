// Dependencies
var Deffy = require("../lib");

console.log(Deffy(undefined, "Hello World"));
// => "Hello World"

console.log(Deffy("Hello World", 42));
// => 42

console.log(Deffy("Hello", "World"));
// => "World"

console.log(Deffy("", "World", true));
// => "World"

console.log(Deffy("", "World"));
// => ""

console.log(Deffy("foo", function (input) {
    return input === "foo" ? "bar" : "foo";
}));
// => "bar"
