"use strict"
let https = require("https");
let fs = require('fs');
let express = require("express");
let bodyParser = require('body-parser');
let routes  = require('./routes');
let path = require('path');
var util = require('util');
let ejs = require('ejs');
let app = express();

let moltin = require('moltin')({
  publicId: 'gSeDLjpiuZ6myThZIdAQDMqHKqRDJ1jIdJRN1wTQFh',
  secretKey: '4mu6CUANi0P8cAwG90cKyB2RLl1J5K5fgQQVOH21lz'
});



app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../client');
app.use( express.static(__dirname + "/../client") );
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies






app.get('/authenticate', function(req, res){

  moltin.Authenticate(function(data) {

    console.log(data);

    if(data){
      res.status(200);
      res.json(data);
    }else{
      res.status(500);
    }

  });
});



    app.post('/addProduct', function(req, res){

      var id = req.body.id;
      var token = req.body.access_token;
      console.log();
      res.setHeader("Authorization", "Bearer "+token);

      moltin.Cart.Insert(id, 1, null, function(items){
        res.json(items);
      });

    });


    app.post('/addVariation', function(req, res){

      var id = req.body.id;
      var modifier = req.body.modifier_id
      var variation = req.body.variation_id
      var token = req.body.access_token;

      var obj={};

      obj[modifier] = variation


      console.log(req.body);
      console.log(obj);

      // res.setHeader("Authorization", "Bearer "+token);

      moltin.Cart.Insert(id, 1, obj, function(cart) {
        console.log(cart);
        res.json(cart);

      }, function(error, response, c) {
        console.log(error);
        console.log(response);
        console.log(c);
        res.json(error);
          // Something went wrong...
      });

    });




    app.post('/removeProduct', function(req, res){
      var id = req.body.id;
      console.log(id);
      moltin.Cart.Remove(id, function() {
          // Everything is awesome...
          console.log("all good");
          res.status(200);
          res.json(items);
      }, function(error, response, c) {
          // Something went wrong...
          console.log(response);
      });
    })

    app.get('/getProducts', function(req, res){
      getProduct(req, res);
    });

    app.get('/getCart', function(req, res){
      getCart(req, res);
    });

    app.post('/cartToOrder', function(req, res){
      var data = req.body;

      cartToOrder(req, res, data);

    });


    app.post('/orderToPayment', function(req, res){
      var order = req.body;
      orderToPayment(req, res, order);
    });




    function getCart(req, res){

        moltin.Cart.Contents(function(items) {
          // res.writeHead(200, {'Content-Type': 'application/json'});
          res.json(items);
          // res.end(items);
            // Update the cart display
        }, function(error){
              console.log(error);
        });

    }



    function getProduct(req, res){
        moltin.Product.List(null, function(product) {
          console.log(product);
            res.json(product);

        }, function(error) {
            // Something went wrong...
            console.log("Something went wrong in getting the products..");
        });
    }




    function cartToOrder(req, res, data){
      console.log("wait for the order");

      console.log(data);
      // var customer = data.customer;
      console.log(data.shipment);
      console.log(data.shipment.first_name);
      var ship_to = data.shipment;
      var bill_to = data.billing;
      // console.log(ship_to);
      // console.log(bill_to);


        moltin.Cart.Complete({
          gateway: 'stripe',
          // customer: {
          //   first_name: customer.first_name,
          //   last_name:  customer.last_name,
          //   email: customer.email
          // },
          bill_to: {
            first_name: 'Elia',
            last_name:  'Fornari',
            address_1:  'via vasco de gama 90',
            address_2:  'via lauro rossi 12',
            city:       'Civitanova Marche',
            county:     'Marche',
            country:    'IT',
            postcode:   '62012',
            phone:      '3319567561'
          },
          ship_to: {
            first_name: ship_to.first_name,
            last_name:  ship_to.last_name,
            address_1:  ship_to.address_1,
            address_2:  ship_to.address_2,
            city:       ship_to.city,
            county:     ship_to.county,
            country:    ship_to.country,
            postcode:   ship_to.postcode,
            phone:      ship_to.phone,
          },
          shipping: 'USPS'
        }, function(order) {

          console.log("wait for the order");
          console.log(order);

          res.json(order);
            // Handle the order

        }, function(error, response, c) {
          console.log(response);
          res.json(error);
          // Something went wrong...
        });


    }




    function orderToPayment(req, res, order){
      console.log(order);
      var card_number = order.number.toString();
      console.log(card_number);
      var expiry_month = order.expiry_month;
      var expiry_year = order.expiry_year;
      var cvv = order.cvv;
      var obj={};
      obj = {
                data: {
                number: card_number,
                expiry_month: expiry_month,
                expiry_year: expiry_year,
                cvv: cvv
              }
            }
      moltin.Checkout.Payment('purchase', order.id, obj, function(payment, error, status) {

          console.log("payment successful");
          console.log(payment);
          res.status(200).json(payment);

      }, function(error, response, c) {
        console.log("payment failed!");
        console.log("response: "+response);
        console.log("c: "+c);
        console.log("error: "+error);

        res.status(c).json(response);
        // Something went wrong...
      })
    }








    const options = {
      key: fs.readFileSync('.//keys/key.pem', 'utf8'),
      cert: fs.readFileSync('.//keys/cert.pem', 'utf8')
    };




    // app.get('/partials/:name', routes.partials);
    //
    // // redirect all others to the index (HTML5 history)



    // function requestGateway(req, res){
    //   Moltin.Gateway.List(null, function(gateways) {
    //   console.log(gateways);
    //     }, function(error) {
    //       // Something went wrong...
    //     });
    // }

    app.get('*', routes.index);


    https.createServer(options, app).listen(443);
    // http.createServer(app).listen(9000);
