const express = require('express');
const app = express();
const expressHandlebars = require('express-handlebars');
const handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');

function templateEngine(app) {
    app.engine('.hbs', expressHandlebars.engine({
        extname: '.hbs',
        handlebars: allowInsecurePrototypeAccess(handlebars),
        helpers: {
            sum: (a, b) => a + b,
            salePercent: (a, b) => Math.round(100 - (a / b * 100)),
            priceFormat: (a) => a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            json: function (context) {
                return JSON.stringify(context);
            },
            limit: function (object, max, options) {
                if(!object || object.length == 0)
                return options.inverse(this);
        
                var result = [ ];
                for(var i = 0; i < max && i < object.length; ++i)
                    result.push(options.fn(object[i]));
                return result.join('');
            }
        },
    }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '..', 'resources', 'views'));
}

module.exports = templateEngine;