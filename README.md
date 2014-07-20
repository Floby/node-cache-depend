[![Build Status](https://travis-ci.org/Floby/node-cache-depend.png?branch=master)](https://travis-ci.org/Floby/node-cache-depend)

node-cache-depend
==================

> A utility function to detect when you should invalidate your cached data

Installation
------------

    npm install --save cache-depend

Usage
-----

CacheDepend can help you formalize on what sources you depend for you cached data
and notify you when your data needs to be updated

```javascript
var depends = require('cache-depend')
               .etag('http://example.com/resource/with/ETag')

depends.on('change', function (changeinfo) {
  changeinfo.changeId
  changeinfo.oldETag
  changeinfo.newETag
  // I should probably invalidate my cached data
})

var depends = require('cache-depend')
               .time('2015-06-23 12:36:00')

depends.on('change', function (changeinfo) {
  changeinfo.changeId
  changeinfo.startedAt
  changeinfo.endedAt
  // Same here
})
```

Test
----

You can run the tests with `npm test`. You will need to know [mocha](https://github.com/visionmedia/mocha)

Contributing
------------

Anyone is welcome to submit issues and pull requests

thanks to [vanthome](https://github.com/vanthome)


License
-------

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Florent Jaby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
