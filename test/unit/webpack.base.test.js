const assert = require('assert');

describe('webpack.base.js test case', () => {
    const baseConfig = require('../../lib/webpack.base');

    it('entry', () => {
        assert.equal(baseConfig.entry.search.indexOf('build-webpack/test/smoke/template/src/search/index.jsx') > -1, true);
    })
})