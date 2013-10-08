//
// scratch.js
// ==========
//
// a handful of utility functions built from "scratch"
// ---------------------------------------------------
//
// This is just an educational little library to show how features build on top
// of one another. Most of us know this already, of course; but it can be easy
// to forget, or not to realize just how far this principle extends.
//
// For example, [this post](http://ariya.ofilabs.com/2013/10/searching-using-array-prototype-reduce.html)
// discusses how it's possible to implement a search using `Array.prototype.reduce`.
// And [this article](http://www.elijahmanor.com/2013/08/reducing-filter-and-map-down-to-reduce.html#comment-1004076112)
// from a while back describes how to implement `map` and `filter` in terms of
// `reduce`.
//
// Below we imagine what it would be like if JavaScript did not have the
// keywords `while` or `for` and we wanted to implement a relatively high-level
// function like `map`. How would we do it?
//
// READ ON TO FIND OUT.
//
var scratch = {
  //
  // If ECMAScript had the `goto` statement, we could use that to implement the
  // `while` keyword:
  //
  //     'while': function(condition, fn) {
  //       start:
  //       if (!condition()) {
  //         return;
  //       }
  //
  //       fn();
  //       goto start;
  //     }
  //
  // [TRAGICALLY](http://stackoverflow.com/questions/9751207/how-can-i-use-goto-in-javascript),
  // that is not the case. So, we'll implement it with recursion instead!
  //
  'while': function(condition, fn) {
    /*
     * A friendly reminder, since it's easy to forget we need a function here --
     * i.e., if you called `while(flag, doSomething)`, the *current* value of
     * `flag` would be passed in, where the value of the local `condition` would
     * never change.
     */
    if (typeof condition !== 'function') {
      throw 'Remember, you need to pass a FUNCTION to scratch.while!';
    }

    (function loop() {
      if (!condition()) { return; }
      fn();
      loop();
    }());
  },

  // Now that we have a while loop, we can easily implement the `for` keyword.
  'for': function(init, condition, update, fn) {
    init();
    scratch.while(condition, function() {
      fn();
      update();
    });
  },

  // And with `for`, of course, it's quite easy to implement a `forEach` method.
  'forEach': function(array, fn) {
    var i;
    scratch.for(
      /* for::init */
      function() { i = 0; },

      /* for::condition */
      function() { return i < array.length; },

      /* for::update */
      function() { ++i; },

      /* for::fn */
      function() { fn(array[i]); }
    );
  },

  // What is `reduce` but a glorified `forEach`, really?
  'reduce': function(array, aggregator, memo) {
    scratch.forEach(array, function(element) {
      memo = aggregator(memo, element);
    });
    return memo;
  },

  // Typically we think of `reduce` as operating on *values* (like numbers) and
  // aggregating a result. Well, there's no law that says these values have to
  // be numeric. We can treat an array as a "value" and define an "aggregator"
  // that just pushes elements onto the array. So at the end of the day `map` is
  // just a special case of `reduce`.
  'map': function(array, selector) {
    return scratch.reduce(
      /* reduce::array (duh) */
      array,

      /* reduce::aggregator */
      function(result, element) {
        result.push(selector(element));
        return result;
      },

      /* reduce::memo */
      []
    );
  },

  // We can implement `filter` using `reduce` just as easily as we implemented
  // `map`. This time around our "aggregator" is a function that pushes elements
  // onto the array *if* they satisfy our predicate.
  'filter': function(array, predicate) {
    return scratch.reduce(
      /* reduce::array */
      array,

      /* reduce::aggregator */
      function(result, element) {
        if (predicate(element)) {
          result.push(element);
        }
        return result;
      },

      /* reduce::memo */
      []
    );
  },

  //
  // We could keep going here
  // ------------------------
  //
  // The `pluck` method is itself a special case of the `map` method, where the
  // "selector" is a function that returns the property identified by the given
  // string.
  'pluck': function(array, property) {
    return scratch.map(array, function(element) { return element[property]; });
  },

  // The `compact` method is a special case of the `filter` method, where the
  // "predicate" just checks if the value is null or undefined.
  'compact': function(array) {
    return scratch.filter(array, function(element) { return element != null; });
  }

  // ...and so on and so forth.
};

// *fin*
