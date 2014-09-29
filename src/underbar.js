/*jshint eqnull:true, expr:true*/

var _ = {};

(function() {

  // Returns whatever value is passed as the argument. This function doesn't
  // seem very useful, but remember it--if a function needs to provide an
  // iterator when the user does not pass one in, this will be handy.
  _.identity = function(val) {
    return val;
  };

  /**
   * COLLECTIONS
   * ===========
   *
   * In this section, we'll have a look at functions that operate on collections
   * of values; in JavaScript, a 'collection' is something that can contain a
   * number of values--either an array or an object.
   *
   *
   * IMPORTANT NOTE!
   * ===========
   *
   * The .first function is implemented for you, to help guide you toward success
   * in your work on the following functions. Whenever you see a portion of the
   * assignment pre-completed, be sure to read and understand it fully before
   * you proceed. Skipping this step will lead to considerably more difficulty
   * implementing the sections you are responsible for.
   */

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // Like first, but for the last elements. If n is undefined, return just the
  // last element.
  _.last = function(array, n) {
    if ( n === undefined ) {
      return array[array.length-1];
    }
    else if ( n === 0 ) {
      return array.slice(0,0);
    }
    else {
      return array.slice(-n);
    }
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  //
  // Note: _.each does not have a return value, but rather simply runs the
  // iterator function over each item in the input collection.
  _.each = function(collection, iterator) {
    if ( Array.isArray(collection) ) {
      for (var i = 0; i < collection.length; i++) {
        iterator(collection[i],i,collection);
      }
    } 

    else if ( typeof collection === "object" ) {
      for (var key in collection) {
        iterator(collection[key],key,collection);
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    // TIP: Here's an example of a function that needs to iterate, which we've
    // implemented for you. Instead of using a standard `for` loop, though,
    // it uses the iteration helper `each`, which you will need to write.
    var result = -1;

    _.each(array, function(item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    var result = [];
    _.each(collection, function(e){
      if (test(e)) {
        result.push(e);
      }
    });
    return result;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    // TIP: see if you can re-use _.filter() here, without simply
    // copying code in and modifying it
    function negate (func) {
      return function () {
        return !func.apply(this,arguments);
      };
    }
    var falseTest = negate(test);
    return _.filter(collection, falseTest);
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array, isSorted) { 
    //mlom - added the 'isSorted' argument to use solution v.2, below:
    //mlom - solution v.1 - works for both sorted (isSorted = true) and unsorted array
    /* 
    var result = [];
    var obj = {};
    _.each(array,function(e){
      if ( !obj[e]) {
        obj[e] = "exists";
        result.push(e);
      }
    });

    return result
    */

    //mlom - solution v.2 - distinguishes between sorted (isSorted = true) and unsorted array
    var result = [];
    var placeholder = 0 ;
    for (var i = 0; i < array.length; i++) {
      var elem = array[i];
      if (isSorted) {
        if (!i || elem !== placeholder) {
          result.push(elem);
          placeholder = elem;
        }
      }
      else if (_.indexOf(result,elem) < 0) {
        result.push(elem);
      }
    }
      return result;
  };

    // Return the results of applying an iterator to each element.
  _.map = function(collection, iterator) {
    // map() is a useful primitive iteration function that works a lot
    // like each(), but in addition to running the operation on all
    // the members, it also maintains an array of results.
    var result = [];
    var map = function () {result.push(iterator.apply(this,arguments));}
    _.each(collection, map); 
    return result;
  };

  /*
   * TIP: map is really handy when you want to transform an array of
   * values into a new array of values. _.pluck() is solved for you
   * as an example of this.
   */

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(collection, key) {
    // TIP: map is really handy when you want to transform an array of
    // values into a new array of values. _.pluck() is solved for you
    // as an example of this.
    return _.map(collection, function(item){
      return item[key];
    });
  };

  // Calls the method named by functionOrKey on each value in the list.
  // Note: you will nead to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {
    return _.map(collection, function(elem){
      if (typeof functionOrKey === "function") {
        return functionOrKey.apply(elem);
      }
      else {
        return elem[functionOrKey].apply(elem);
      }
    });
  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(previousValue, item) for each item. previousValue should be
  // the return value of the previous iterator call.
  //
  // You can pass in an initialValue that is passed to the first iterator
  // call. If initialValue is not explicitly passed in, it should default to the
  // first element in the collection.
  //
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(total, number){
  //     return total + number;
  //   }, 0); // should be 6
  _.reduce = function(collection, iterator, accumulator) {
    var carryValue = accumulator;
    var result;
    _.each(collection, function(e,i,l) {
      if (carryValue) {
        carryValue = iterator(carryValue,e,i,l);
        result = carryValue;
      }
      else {
        carryValue = e;
      }
    });
    return result;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    // TIP: Many iteration problems can be most easily expressed in
    // terms of reduce(). Here's a freebie to demonstrate!
    /*
    return _.reduce(collection,function(wasFound, item) {
      if (wasFound) {return true;}
      return item === target;
      }, false);
    */
    //mlom: freebie contains() included above does not pass with 
    //my implementation of reduce() above. As such, re-solved below:

    var wasFound = _.indexOf(collection, target);
    if (wasFound === -1) {return false;}
    else {return true;};

  };


  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    // TIP: Try re-using reduce() here.
    //mlom: unable to solve using reduce(), so solved independent of reduce().
    if (!iterator) {
      var iterator = _.identity;
    }
    
    var result = true;

    _.each(collection, function(e,i,l){
      var failTest = iterator.apply(this,arguments) ? true : false;
        if (failTest === false) {
          result = false;
        }
    });
    
    return result;
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    // TIP: There's a very clever way to re-use every() here.
    if (!iterator) {
      var iterator = _.identity;
    }
    
    var result = false;

    _.each(collection, function(e,i,l){
      var failTest = iterator.apply(this,arguments) ? true : false;
        if (failTest === true) {
          result = true;
        }
    });
    
    return result;
  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  _.extend = function(obj) {
    for (var i = 1; i < arguments.length; i++){
      var source = arguments[i];
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    }
    return obj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    for (var i = 1; i < arguments.length; i++){
      var source = arguments[i];
      for (var prop in source) {
        if ( !obj.hasOwnProperty(prop) ){

        obj[prop] = source[prop];
        }
      }
    }
    return obj;

  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // infromation from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memoize an expensive function by storing its results. You may assume
  // that the function takes only one argument and that it is a primitive.
  //
  // _.memoize should return a function that when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) {
    var passedArg = {};
    return function(arg) {
      var cache = passedArg;
      if ( !hasOwnProperty.call(cache,arg) ) {
        cache[arg] = func.apply(this,arguments);
      }
      return cache[arg];
    }
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    var args = Array.prototype.slice.call(arguments, 2);
    var callback = function() {
      return func.apply(this, args)
    };
    return setTimeout(callback, wait);
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function(array) {
    var list = Array.prototype.slice.call(array,0);
    var len = list.length;
    var getRandomNum = function (min,max) {
      return Math.floor(Math.random()*(max-min+1)) + min; 
    }
    for (var i = len-1; i > 0; i--) {
      var roll = getRandomNum(0, i);
      var valueOfRolledIndex = list[roll];
      var valueOfRangeEnd = list[i];
      list[i] = valueOfRolledIndex;
      list[roll] = valueOfRangeEnd;
    }
    return list;

  };


  /**
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */


  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
      var items = _.map(collection, function(e,i,l) {
        return {
          index: i, 
          value: e, 
          sortValue: iterator === 'length' ? e.length : iterator.call(this,e,i,l)
          };
      });
      
      var compare = function(a,b){
        var A = a.sortValue;
        var B = b.sortValue;
       if (A !== B) {
          if (A > B || A === undefined) {return 1;}
          if (A < B || B === undefined) {return -1;}
       }
        return a.index - b.index; 
      };
      
      items.sort(compare);
    
    return _.pluck(items, 'value');
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
    var args = Array.prototype.slice.call(arguments,0);

    var lengths = _.map(args, function(arg) {return arg.length;});
    var maxLength =  Math.max.apply(null,lengths);
    var result = [];
    
    for (var j = 0; j < maxLength; j++) {
      result[j] = _.pluck(args, j);
    }
    return result;
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
    var flatArray = [];
    for (var i = 0; i < nestedArray.length; i++){
      if ( Array.isArray(nestedArray[i]) ) {
        flatArray = flatArray.concat( _.flatten(nestedArray[i]) );
      }
      else {
        flatArray = flatArray.concat(nestedArray[i]);
      }
    }
    return flatArray;
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
    var args = Array.prototype.slice.call(arguments,0);
    var array = args[0];
    var result = [];
    for (var i = 0; i < array.length; i++){
      var element = array[i];
      if ( _.contains(result, element) ) {continue;}
      for (var j = 1; j < args.length; j++) {
        if ( !_.contains(args[j], element) ) {break;}
      }
      if ( j === args.length) {result.push(element);}
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    /*var args = Array.prototype.slice.call(arguments,0);
    var result = [];
    for (var i = 0; i < array.length; i++){
      var element = array[i];
      if ( _.contains(result, element) ) {continue;}
      for (var j = 1; j < args.length; j++) {
        if ( _.contains(args[j], element) ) {break;}
      }
      if ( j === args.length) {result.push(element);}
    }
    return result;*/
    var remainingArrays = Array.prototype.slice.call(arguments,1);
    var remainingElements = _.flatten(remainingArrays);
    return _.filter(array, function(e){
      return !_.contains(remainingElements,e);
    });
  };


  /**
   * MEGA EXTRA CREDIT
   * =================
   */

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  //
  // See the Underbar readme for details.
  _.throttle = function(func, wait) {
    var result;
    var timeoutID = null;
    var last = 0;
    return function(){
      var now = new Date();
      var timeRemaining = wait - (now - last);
      if ( timeRemaining <= 0 ) {
        last = now;
        result =  func.apply(this,arguments);
      }
      else {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
          last = now;
          result = func.apply(this,arguments);
        }, wait);

      }
      return result;
    }
  };

}).call(this);
