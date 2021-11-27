var assert = require('assert');

describe("parse html:", function () {
    it('<a></a>', function () {
        let tree = parseHTML('<a></a>');
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0);
    });
})