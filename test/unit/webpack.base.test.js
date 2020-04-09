const assert = require('assert');

describe('webpack.base.js test case', () => {
    const baseConfig = require('../../lib/webpack.base');

    it('entry', () => {
        assert.equal(baseConfig.entry.search, 'D:/CRRCDT/Study/webpack-demo/build-webpack/test/smoke/template/src/search/index.jsx');
    })
})