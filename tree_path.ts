///<reference path="./q.d.ts"/>

import Q = require("q")

module util {
    export function findByName(nodes: Node[], name: string) {
        var matchingNodes = (nodes || []).filter(_ => _.name == name);
        return matchingNodes.length ? matchingNodes[0] : null;
    }

    export function headAndTail<T>(arr: T[]): any {
        var head = arr[0],
            tail = arr.slice(1);

        return [head, tail];
    }
}

interface Node {
    id: number;
    name: string;
    children?: Node[]
}

var repo = (function() {
    var nodes = {
        1: {id: 1, name: 'root', children: [{id: 2, name: 'a'}]},
        2: {id: 2, name: 'a', children: [{id: 3, name: 'b'}]},
        3: {id: 3, name: 'b', children: []}
    };

    return {
        getNode: (id: number) => nodes[id || 1],
        getNodeAsync: (id: number) => Q.delay(nodes[id || 1], 500)
    };
})();

/**
 * tail recursive -> can easily be transformed to iterative implementation
 */
function resolve(path: string[]): Node {
    return recurse(repo.getNode(null), path);

    function recurse(node: Node, path: string[]) {
        if (path.length == 0)
            return node;

        var [nextName, tailPath] = util.headAndTail(path);
        var nextNodeId = util.findByName(node.children, nextName).id,
            nextNode = repo.getNode(nextNodeId);

        return recurse(nextNode, tailPath);
    }
}

function resolveWhile(path: string[]): Node {
    var node = repo.getNode(null);

    while (path.length) {
        var [nextName, tailPath] = util.headAndTail(path);
        var nextNodeId = util.findByName(node.children, nextName).id;

        path = tailPath;
        node = repo.getNode(nextNodeId);
    }

    return node;
}

function resolveAsync(path: string[]): Q.Promise<Node> {
    return repo.getNodeAsync(null).then(_ => recurse(_, path));

    /**
     * Return type is any because we return either a Node or a Q.Promise<Node>.
     * While Q can deal with that (by wrapping on demand), TypeScript can't.
     */
    function recurse(node: Node, path: string[]): any {
        if (path.length == 0)
            return node;

        var [nextName, tailPath] = util.headAndTail(path);
        var nextNodeId = util.findByName(node.children, nextName).id,
            nextNode = repo.getNodeAsync(nextNodeId);

        return nextNode.then(_ => recurse(_, tailPath));
    }
}

console.log(resolve(['a', 'b']));
console.log(resolveWhile(['a', 'b']));
resolveAsync(['a', 'b']).then(console.log);

