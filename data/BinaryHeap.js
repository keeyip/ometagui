function data_BinaryHeap(){
// @see http://eloquentjavascript.net/appendix2.html
  function BinaryHeap1(scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction ||
    function(a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };
  }

  BinaryHeap1.prototype = {
    push: function(element) {
      // Add the new element to the end of the array.
      this.content.push(element);
      // Allow it to bubble up.
      this.bubbleUp(this.content.length - 1);
    },

    pop: function() {
      // Store the first element so we can return it later.
      var result = this.content[0];
      // Get the element at the end of the array.
      var end = this.content.pop();
      // If there are any elements left, put the end element at the
      // start, and let it sink down.
      if (this.content.length > 0) {
        this.content[0] = end;
        this.sinkDown(0);
      }
      return result;
    },

    remove: function(node) {
      var length = this.content.length;
      // To remove a value, we must search through the array to find
      // it.
      for (var i = 0; i < length; i++) {
        if (this.content[i] != node) continue;
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();
        // If the element we popped was the one we needed to remove,
        // we're done.
        if (i == length - 1) break;
        // Otherwise, we replace the removed element with the popped
        // one, and allow it to float up or sink down as appropriate.
        this.content[i] = end;
        this.bubbleUp(i);
        this.sinkDown(i);
        break;
      }
    },

    size: function() {
      return this.content.length;
    },

    bubbleUp: function(n) {
      // Fetch the element that has to be moved.
      var element = this.content[n],
          score = this.scoreFunction(element);
      // When at 0, an element can not go up any further.
      while (n > 0) {
        // Compute the parent element's index, and fetch it.
        var parentN = Math.floor((n + 1) / 2) - 1,
            parent = this.content[parentN];
        // If the parent has a lesser score, things are in order and we
        // are done.
        if (score >= this.scoreFunction(parent)) break;

        // Otherwise, swap the parent with the current element and
        // continue.
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      }
    },

    sinkDown: function(n) {
      // Look up the target element and its score.
      var length = this.content.length,
          element = this.content[n],
          elemScore = this.scoreFunction(element);

      while (true) {
        // Compute the indices of the child elements.
        var child2N = (n + 1) * 2,
            child1N = child2N - 1;
        // This is used to store the new position of the element,
        // if any.
        var swap = null;
        // If the first child exists (is inside the array)...
        if (child1N < length) {
          // Look it up and compute its score.
          var child1 = this.content[child1N],
              child1Score = this.scoreFunction(child1);
          // If the score is less than our element's, we need to swap.
          if (child1Score < elemScore) swap = child1N;
        }
        // Do the same checks for the other child.
        if (child2N < length) {
          var child2 = this.content[child2N],
              child2Score = this.scoreFunction(child2);
          if (child2Score < (swap == null ? elemScore : child1Score)) swap = child2N;
        }

        // No need to swap further, we are done.
        if (swap == null) break;

        // Otherwise, swap and continue.
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
    }
  };








  /**
   * can optionally provide a comparison function, a function for a max
   * heap is the default if no comparison function is provided
   *
   * @example
   * var bh = new BinaryHeap();
   * bh.push(5);
   * bh.push(34);
   * bh.push(16);
   * var max = bh.pop(); // 34
   * console.log("Size of heap: %n", bh.size()) // 2
   * 
   * @see https://github.com/yckart/BinaryHeap
   */
  function BinaryHeap2(scoreFunction, populate) {
    this.content = populate ? populate.slice(0) : [];

    // default to max heap if comparator is not provided
    this.scoreFunction = scoreFunction ||
    function(a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };

    if (this.content.length) this.build();
  }



  /**
   * Create a heap from a random arrangement of data.
   * Building a heap this way is O(n).
   */
  BinaryHeap2.prototype.build = function() {
    var i = Math.floor(this.content.length / 2) - 1;
    while (i--) this.sinkDown(i);
  };


  /**
   * Adds an element to the heap. 
   * Building a heap this way is O(n log n).
   *
   * @param {Mixed} element
   */
  BinaryHeap2.prototype.push = function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);

    // Allow it to bubble up.
    this.bubbleUp(this.content.length - 1);
  };


  /**
   * Pops the root off the heap. The root is the element for which
   * the score function returns the minimum score. This is delete-min
   * with O(log n).
   */
  BinaryHeap2.prototype.pop = function() {
    // Store the first element so we can return it later.
    var result = this.content[0];

    // Get the element at the end of the array.
    var end = this.content.pop();

    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }

    return result;
  };



  /**
   * Inspects the root of the heap. This is find-min, O(1).
   */
  BinaryHeap2.prototype.peek = function() {
    return this.content && this.content.length ? this.content[0] : null;
  };



  /**
   * Removes the given element from this heap.
   *
   * @param {Mixed} element
   */
  BinaryHeap2.prototype.remove = function(element) {
    var len = this.content.length;

    // To remove a value, we must search
    // through the array to find it.
    for (var i = 0; i < len; i++) {
      if (this.content[i] === element) {

        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();

        if (i !== len - 1) {
          this.content[i] = end;
          if (this.scoreFunction(end) < this.scoreFunction(node)) {
            this.bubbleUp(i);
          } else {
            this.sinkDown(i);
          }
        }
        return;
      }
    }
    throw new Error("Node not found.");
  };



  /**
   * Gets the heap size. I assume JavaScript allows O(n) for this.
   */
  BinaryHeap2.prototype.size = function() {
    return this.content.length;
  };



  /**
   * Bubbles up an element at a given index. This operation is O(log n).
   *
   * @param {Number} n - The number to bubble up
   */
  BinaryHeap2.prototype.bubbleUp = function(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n];

    // When at 0, an element can not go up any further.
    while (n > 0) {

      // Compute the parent element's index, and fetch it.
      var parentN = Math.floor((n + 1) / 2) - 1,
          parent = this.content[parentN];

      if (this.scoreFunction(element) < this.scoreFunction(parent)) {

        // Swap the elements if the parent is greater.
        this.content[parentN] = element;
        this.content[n] = parent;

        // Update 'n' to continue at the new position.
        n = parentN;

      } else {
        // Found a parent that is less, no need to move it further.
        break;
      }
    }
  };



  /**
   * Sinks down an element at a given index. This operation is O(log n).
   *
   * @param {Number} n - The number to sink down
   */
  BinaryHeap2.prototype.sinkDown = function(n) {

    // Look up the target element and its score.
    var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);

    do {
      // Compute the indices of the child elements.
      var child2N = (n + 1) * 2,
          child1N = child2N - 1;

      // This is used to store the new position of the element,
      // if any.
      var swap = null;

      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
            child1Score = this.scoreFunction(child1);

        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore) swap = child1N;
      }

      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
            child2Score = this.scoreFunction(child2);

        if (child2Score < (swap == null ? elemScore : child1Score)) swap = child2N;
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
    } while (swap !== null);
  };






/**
 * @author Derrick Burns
 */


binaryHeap = function (comparisonFunction) {
    this.cmp = comparisonFunction ||
    function(a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };;
};

binaryHeap.prototype = {
    content: [],

    toArray: function( ) {
        var r = "[";
        for( var i=0; i!= this.content.length; i++ )  {
            r = r + this.content[i].toString();
            r = r + ", ";
        }
        r = r + "]";
        return r;
    },
       
    push: function (element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    },

    pop: function () {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    },

    remove: function (node) {
        var len = this.content.length;
        // To remove a value, we must search through the array to find
        // it.
        for (var i = 0; i < len; i++) {
            if (this.content[i] === node) {
                // When it is found, the process seen in 'pop' is repeated
                // to fill up the hole.
                var end = this.content.pop();
                if (i !== this.content.length - 1) {
                    this.content[i] = end;
                    this.bubbleUp(i);
                }
                return;
            }
        }
        throw new Error("Node not found.");
    },

    size: function () {
        return this.content.length;
    },

    sinkDown: function (n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n];
        // When at 0, an element can not sink any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = Math.floor((n + 1) / 2) - 1,
            parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.cmp(element, parent) < 0) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    },

    bubbleUp: function (n) {
        // Look up the target element.
        var length = this.content.length,
        element = this.content[n];

        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) * 2,
            child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up 
                var child1 = this.content[child1N];
                // If it is less than our element's, we need to swap.
                if (this.cmp(child1, element) < 0) {
                    swap = child1N;
                }
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N];
                if (this.cmp(child2, (swap === null ? element: child1)) < 0) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    }
};

BinaryHeap3 = function(comparisonFunction) {
    var b = new binaryHeap(comparisonFunction);
    return {
        toArray: function() { return b.toArray(); },
        push:    function(elem) { return b.push(elem); },
        pop:     function() { return b.pop(); },
        remove:  function(elem) { return b.remove(elem); },
        size:    function() { return b.size(); }
    }
}();


BinaryHeap4 = function(scoreFunction){
    this.content = [];
    this.scoreFunction = scoreFunction ||
    function(a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };
};

BinaryHeap4.prototype = {
    push: function(element) {
        // Add the new element to the end of the array.
        this.content.push(element);

        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    },
    pop: function() {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
             this.content[0] = end;
             this.bubbleUp(0);
        }
        return result;
    },
    remove: function(node) {
        var i = this.content.indexOf(node);
    
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();

        if (i !== this.content.length - 1) {
            this.content[i] = end;
            
            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
            }
            else {
                this.bubbleUp(i);
            }
        }
    },
    size: function() {
        return this.content.length;
    },
    rescoreElement: function(node) {
        this.sinkDown(this.content.indexOf(node));
    },
    sinkDown: function(n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n];
        
        var parentN, parent;

        // When at 0, an element can not sink any further.
        while (n > 0) {

            // Compute the parent element's index, and fetch it.
            parentN = ((n + 1) >> 1) - 1;
            parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }

            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    },
    bubbleUp: function(n) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);
            var child2N, child1N, swap, child1, child2;
        
        do {
            // Compute the indices of the child elements.
            child2N = (n + 1) << 1, child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
            // Look it up and compute its score.
            child1 = this.content[child1N],
                child1Score = this.scoreFunction(child1);

            // If the score is less than our element's, we need to swap.
            if (child1Score < elemScore)
                swap = child1N;
            }

            // Do the same checks for the other child.
            if (child2N < length) {
                child2 = this.content[child2N],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
        } while (swap !== null);
    }
};

defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };

  /* 
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
  */


insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };

  /*
  Push item onto heap, maintaining the heap invariant.
  */


 heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };

  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
  */


heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };

  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be 
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
  */


 heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };

  /*
  Fast version of a heappush followed by a heappop.
  */


heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };

  /*
  Transform list into a heap, in-place, in O(array.length) time.
  */


heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };

  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
  */


updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };

  /*
  Find the n largest elements in a dataset.
  */


 nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };

  /*
  Find the n smallest elements in a dataset.
  */


 nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

_siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

 _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  var Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;
    return Heap;

  })();
var bh1 = new BinaryHeap1(),
    bh2 = new BinaryHeap2(),
    bh3 = BinaryHeap3,
    bh4 = new BinaryHeap4(),
    bh5 = new Heap();

var numbers = [];
for (var i = 0; i < 200; i++) {
    // May result in the same number being added multiple times:
    numbers.push( Math.floor(Math.random() * 1000) );
}
}
