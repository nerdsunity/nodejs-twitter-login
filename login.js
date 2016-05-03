/*
 * This function wraps WebPage.evaluate, and offers the possibility to pass
 * parameters into the webpage function. The PhantomJS issue is here:
 *
 *   http://code.google.com/p/phantomjs/issues/detail?id=132
 *
 * This is from comment #43.
 */
function evaluate(page, func) {
    var args = [].slice.call(arguments, 2);
    var fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");}";
    return page.evaluate(fn);
}

var args = require('system').args;
var page = require('webpage').create();

var data = {
    email : args[1],
    password:args[2],
};

page.open("http://www.twitter.com/login", function(status) {
    if (status === "success") {
        page.onConsoleMessage = function(msg, lineNum, sourceId) {
            console.log('CONSOLE: ' + msg);
        };

        evaluate(page, function(data) {
            document.getElementsByClassName("js-username-field")[0].value = data.email;
            document.getElementsByClassName("js-password-field")[0].value = data.password;
            document.getElementsByClassName("js-signin")[0].submit();
            console.log('Just entered Twitter info');
        }, data);
    }
});
