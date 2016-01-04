///<reference path="./q.d.ts"/>

import Q = require("q")

var timeout = 2000;

var log = console.log;

function addOne(val: number): Q.Promise<number> {
    log('started adding one');
    return Q.delay(val + 1, timeout);
}

function multiplyByTwo(val: number): Q.Promise<number> {
    log('started multiplying by two');
    return Q.delay(val * 2, timeout);
}

function divide(a, b): Q.Promise<number> {
    log('started dividing');
    return (b == 0)
        ? Q.delay(timeout).then(() => Q.reject<number>('division by zero'))
        : Q.delay(a / b, timeout);
}

// --------------------------------------

function chainingDemo() {
    addOne(1).then(multiplyByTwo).then(log);
}

//chainingDemo();

// --------------------------------------

function catchDemo() {
    divide(1, 0)
        .then(log)
        .catch(log)
        .then(() => log('here i am'));
}

//catchDemo();

// --------------------------------------

function parallelDemo() {
    Q.all([addOne(1), multiplyByTwo(2)])
        .then(([a, b]) => divide(a,b))
        //.spread(divide)
        .then(log);
}

//parallelDemo();

// --------------------------------------

function waitingDemo() {
    function waitWhile(action:() => Q.Promise<any>) {
        log('start');
        action().finally(() => log('stop'));
    }

    waitWhile(() => addOne(1).then(log));
}

//waitingDemo();

// --------------------------------------

function keepingScopeDemo() {
    addOne(1)
        .then(res1 => multiplyByTwo(res1)
            .then(res2 => log(res1, res2)))
}

//keepingScopeDemo();

// --------------------------------------

function bundlingAndCachingDemo() {
    function createRepo() {
        var cache = null;
        return {
            getTwoByAddingOneToOne: () => cache || (cache = addOne(1))
        };
    }

    var repo = createRepo();

    // two requests in parallel, then another one
    repo.getTwoByAddingOneToOne().then(log);
    repo.getTwoByAddingOneToOne().then(log)
        .then(() => repo.getTwoByAddingOneToOne().then(log));
}

bundlingAndCachingDemo();