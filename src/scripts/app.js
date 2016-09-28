var sproutsExchange = angular.module('sproutsExchange', []);

sproutsExchange.directive('appComponent', function( $http,$interval) {
  var linkfunction = function($scope,element,attrs){
      $scope.dataLoading = true;

      var intervalTime = 3000;

       $scope.getData = function(){
             $http.get('data/sprountsData.json')
               .success(function(data, status, headers, config) {

                 $scope.appHeader = data.appHeader;
                 $scope.holdings = data.yourHoldings;
                 $scope.history = data.history;
               });
       };

       $scope.getSproutsPrice = function(){
           $interval(function(){
               $http.get("data/sproutsPrice.json")
               .success(function(data){
                  // for initial data loaidng
                  $scope.dataLoading = false;
                  // Random value to create the dummy price
                  data.price.currentPrice = (Math.random()*100).toFixed(2);
                  $scope.price = data.price;
                  $scope.price.currentTime = new Date().toTimeString().split(" ")[0];
               })
           },intervalTime);
       }
       $scope.getSproutsPrice();
       $scope.getData();
  }

  return{
    template: '<div ng-if="dataLoading">Loading</div>'+
               '<div ng-if="!dataLoading"><h1>{{appHeader}}</h1>'+
               '<your-holdings holdings="holdings"></your-holdings>'+
               '<place-order price="price" holdings="holdings" history="history"></place-order>'+
               '<your-history history="history"></your-history></div>',
    scope:{},
    link: linkfunction,
    restrict: 'E'
  }
});

sproutsExchange.directive("yourHoldings",function(){
    var linkfunction = function($scope,element,attrs){
      try{
            console.log($scope.holdings);
      }catch(e){
         console.log(e);
      }
    }
    return{
       template: '<h2>{{holdings.label}}</h2>'+
                 '<p>Available Cash: ${{holdings.availableCash}}</p>'+
                 '<p>Available Sprouts: {{holdings.availableSprouts}}</p>',
       scope : { holdings: '=' },
       link: linkfunction,
       restrict: 'E'
    }
});

sproutsExchange.directive("placeOrder",function(){
    var linkfunction = function($scope,element,attrs){
      try{
            $scope.userAction = "Buy";

            $scope.sproutsQuantity  = 0;

            $scope.userActionEvent = function(){
                var totalPrice = ($scope.sproutsQuantity * $scope.price.currentPrice).toFixed(2);
                if($scope.userAction === "Buy"){
                   console.log($scope.holdings.availableCash >= totalPrice);
                   if(parseInt($scope.holdings.availableCash) >= parseInt(totalPrice)){
                      $scope.holdings.availableCash = ($scope.holdings.availableCash - totalPrice).toFixed(2);
                      $scope.holdings.availableSprouts = $scope.holdings.availableSprouts + $scope.sproutsQuantity;
                      var historyObj = {
                            "date": new Date().toTimeString().split(" ")[0],
                            "action": "Buy",
                            "unitprice":$scope.price.currentPrice,
                            "count":$scope.sproutsQuantity,
                            "total":totalPrice
                      }
                      $scope.history.push(historyObj);
                   }
                   else{
                      alert("You does not enough Cash");
                   }

                }else if($scope.userAction === "Sell"){
                      console.log($scope.holdings.availableCash+":::::"+ totalPrice);
                      if($scope.holdings.availableSprouts >= $scope.sproutsQuantity){
                          var availableCash = parseInt($scope.holdings.availableCash) + parseInt(totalPrice);
                          $scope.holdings.availableCash = availableCash.toFixed(2);
                          $scope.holdings.availableSprouts = $scope.holdings.availableSprouts - $scope.sproutsQuantity;
                          var historyObj = {
                                  "date": new Date().toTimeString().split(" ")[0],
                                  "action": "Sell",
                                  "unitprice":$scope.price.currentPrice,
                                  "count":$scope.sproutsQuantity,
                                  "total":totalPrice
                           }
                           $scope.history.push(historyObj);
                      }else{
                          alert("You deos not have enoigh Sprouts");
                      }
                }

                $scope.dataSubmitted = " Congralutaions..You ahve successfully complete the action"
            }

      }catch(e){
         console.log(e);
      }
    }
    return{
       template: '<h2>Place Order</h2>'+
                 '<div class="placeOrder">'+
                 '<div> Current price: {{price.currentPrice}}. As of {{price.currentTime}}'+
                 '<div><select ng-model="userAction"> <option value="Buy">Buy</option><option value="Sell">Sell</option></select></div>'+
                 '<div><span>Amount</span> <input type="number" ng-model="sproutsQuantity" /></div>'+
                 '<div><span>Total</span> <span >{{(sproutsQuantity * price.currentPrice).toFixed(2)}}</span></div>'+
                 '<div><input type="submit" text="Submit" ng-click="userActionEvent()" />'+
                  '</div>',
       scope : { price: '=' ,holdings:"=",history:"="},
       link: linkfunction,
       restrict: 'E'
    }
});

sproutsExchange.directive("yourHistory",function(){
    var linkfunction = function($scope,element,attrs){
      try{
            console.log($scope.history);
      }catch(e){
         console.log(e);
      }
    }
    return{
       template: '<table><thead><td>Date</td><td>Action</td><td>Unit Price</td><td>Count</td><td>Total</td></thead><tbody>'+
                 '<tr ng-repeat="row in history"><td>{{row.date}}</td><td>{{row.action}}</td><td>{{row.unitprice}}</td><td>{{row.count}}</td><td>{{row.total}}</td></tr>'+
                 '</tbody></table>',
       scope : { history: '=' },
       link: linkfunction,
       restrict: 'E'
    }
});
