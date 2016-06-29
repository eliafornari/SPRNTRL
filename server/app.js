"use strict"

let express = require("express");
let bodyParser = require('body-parser');
let routes  = require('./routes');
let path = require('path');
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

    app.get('/getProducts', function(req, res){
      getProduct(req, res);
    });

    app.get('/getCart', function(req, res){
      getCart(req, res);
    });

    app.post('/cartToOrder', function(req, res){
      var gateway = req.body.gateway;
      cartToOrder(req, res);

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
            // Something went wrong...
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




    function cartToOrder(req, res){

        console.log("wait for the order");

        moltin.Cart.Complete({
          gateway: 'stripe',
          customer: {
            first_name: 'Elia',
            last_name:  'Fornari',
            email:      'fornari.elia@gmail.com'
          },
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
          ship_to: 'bill_to',
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
      moltin.Checkout.Payment('purchase', order.id, {
        data: {
          number:       order.number,
          expiry_month: order.expiry_month,
          expiry_year:  order.year,
          cvv:          order.cvv
        }
      }, function(payment) {
          console.log(payment);
      }, function(error, response, c) {
        console.log(response);
        res.json(error);
        // Something went wrong...
      })
    }












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


    app.listen(9000, () => console.log("listening on 9000"));
