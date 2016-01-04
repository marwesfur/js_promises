To Run
======

- npm install
- grunt default
- node (basics|tree_path).js

Basics
======

notable examples:

- waitingDemo: simulates a waiting spinning indicator while an async computation is going on
- bundlingAndCachingDemo: note, that the first two calls only trigger a single `addOne` but both need to wait for the async answer, while the third call is directly answered from the cache without any delay.


Tree Algorithm
==============

Problem Description
-------------------

- Given a tree where nodes have a name and and id
- Given we're able to load a single node by id and loading a node also returns its children (the root can be loaded with id=null)
- The task is to resolve a path of names to the corresponding node object

Example
-------

Tree: 

- (name=root, id=null)
   - (name=B, id=1)
      - (name=C, id=2)
   - (name=D, id=3)
      - (name=E, id=4)

Path: [B, C]
Expected result: (name=C, id=2)

Solutions
---------

- Sync, recursive
    - Start with root node
    - look for next name among current node's children
    - recurse until remaining path is empty

- Sync, iterative
    - the recursive solution is a tail recursive and can therefore easily be turned into an iterative solution.

- Async
    - when compared to the sync, recursive solution, it's basically swapping `f(x)` for `x.then(f)`
    - the switch from recursive to iterative is often motivated by stack limitation. This is not a problem in the async solution, since each call to `recurse` returns before the next one starts ("trampoline")