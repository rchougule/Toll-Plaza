$(document).ready(function(){
    $(".button-collapse").sideNav();
    $('.tooltipped').tooltip({delay: 50});
    calculateFees('yes');
});


function gotoLoginScreen(){
    $('#firstFrame').css('display','none');
    $('#secondFrame').css('display','block'); 
}

function gotoSignUpScreenLogin(){
    $('#secondFrame').css('display','none'); 
    $('#signUpFrame').css('display','block');
}

function gotoLoginSignUpScreen(){
    $('#signUpFrame').css('display','none');
    $('#secondFrame').css('display','block'); 
}


function gotoSignUpScreen(){
    $('#firstFrame').css('display','none');
    $('#signUpFrame').css('display','block');
}

// var serverIP="192.168.43.148:3000/";
var serverIP="192.168.43.104:3000/";

var serverURL = "http://"+serverIP;

var withHostel= [127000.00,17195.00,1300.00,120.00,35000.00,29500.00,2640.00,396.00];
var withoutHostel= [127000.00,17195.00,120.00];

function calculateFees(hostelSelected){

    var sum=0;

    if(hostelSelected=='yes'){
        sum = withHostel.reduce((a, b) => a + b, 0);
    }else{
        sum = withoutHostel.reduce((a, b) => a + b, 0);
    }

    $('.displayFees')[0].innerHTML=sum;

}

function doSignUp(){

    loaderShow();

    var userCredentialObject  = {
        emailID:$('#input_emailID').val().toLowerCase(),
        password:$('#input_passwordSigUp').val(),
        name:$('#input_nameSigUp').val(),
        vehicle:$('#input_VehicleNo').val()
    };

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": serverURL+"registerUser",
        "method": "POST",
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
        },
        "data":userCredentialObject
      }
      
      $.ajax(settings).done(function (response) {
        loaderHide();
            if(response.statusCode === 200){
                Materialize.toast(response.output, 2000);

                setTimeout(function(){
                    $('#signUpFrame').css('display','none');
                    $('#secondFrame').css('display','block');
                },2000);

            }else{
                Materialize.toast(response.output, 2000);
            }
      });
}

function loaderShow(){
    $('#loaderDiv').css('display','block');
}

function loaderHide(){
    $('#loaderDiv').css('display','none');
}


function fetchAmountAndPayButton() {
    loaderShow();
    setTimeout(() => {
        $('#inputAmount').val('Rs 150');
        $('#inputAmount').css('color', 'black');
        $('#payButton').css('color','#01E65F');
        loaderHide();
    }, 2000);
}

function payTollAmount() {
    loaderShow();

    let tollData = {
        emailID: localStorage.getItem('userName'),
        source: $('#inputSource').val(),
        destination: $('#inputDestination').val(),
        amount: 150,
        vehicle: localStorage.getItem('vehicle')
    }

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": serverURL+"travelToll",
        "method": "POST",
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
        },
        "data": tollData
    }
      
    $.ajax(settings).done(function (response) {

        if(response.statusCode === 200){
            setTimeout(() => {
                loaderHide();
                $('#alreadyPaidScreen').css('display','none');
                $('#paymentSuccess').css('display','block');
            },2000);
        }else{
            Materialize.toast(response.output, 2000);
        }
    });
}

function goBackToAddTravelData() {
    $('#paymentSuccess').css('display','none');
    $('#alreadyPaidScreen').css('display','block');

    $('#inputAmount').val('Rs ');
    $('#inputAmount').css('color','grey');
    $('#payButton').css('color','#A9ACAA');
    $('#inputSource').val('');
    $('#inputDestination').val('');
}

function doLogin(){
    
    loaderShow();

    var userCredentialObject  = {
        password:$('#input_passwordLogin').val(),
        emailID:$('#input_emailID_Login').val().toLowerCase()
    };

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": serverURL+"login",
        "method": "POST",
        "headers": {
          "content-type": "application/x-www-form-urlencoded",
        },
        "data":userCredentialObject
    }
      
    $.ajax(settings).done(function (response) {

        loaderHide();

        if(response.statusCode === 200){
            Materialize.toast("Login Successful", 2000);

            localStorage.setItem("userName",$('#input_emailID_Login').val());
            localStorage.setItem("vehicle", response.data.vehicle);

            setTimeout(function(){
                if(response.output == "Open pay screen"){
                    $('#secondFrame').css('display','none');
                    $('#payScreen').css('display','block');
                }else{
                    $('#secondFrame').css('display','none');
                    $('#alreadyPaidScreen').css('display','block');
                    // $('#pushDataHere').empty();

                    // var outputArray = response.data;
                    // for(var i=0;i<outputArray.length;i++){
                    //     var timeInFormat = moment(outputArray[i].dateOfTransaction).format("dddd, MMMM Do YYYY,h:mm:ss a");
                    //     var amountPaid = '₹ '+outputArray[i].amount;
                    //     var fullDataToPush = '<div class="card-panel cardStyle" style="padding-bottom:10px;" > <div class="row" style="margin:0px;"> <div class="col s12"> <center>' + timeInFormat +'</center> </div> <div class="col s12"> <hr> </div> <div class="col s12"> <div class="row flex-div flex-direction-row flex-justify-content-center flex-align-items-center"> <div> Amount Paid - &nbsp; </div> <div>'+ amountPaid+ '</div> </div> </div> </div> </div>';
                    //     $("#pushDataHere").append(fullDataToPush);
                    // }
                }
            },1000);
        }else{
            Materialize.toast(response.output, 2000);
        }
    });
}

function payFees(){

    loaderShow();

    var options = {
        "key": "rzp_test_GzSCAeWtX81Djf",
        "amount": Number($('.displayFees')[0].innerHTML),
        "name": "Cool Pay",
        "description": "College Fees Payment",
        "image": "https://preview.ibb.co/ktzAMV/logo-image.gif",
        "handler": function (response){

            var data = {
                paymentId:response.razorpay_payment_id,
                userName:localStorage.getItem("userName")
            }

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": serverURL+"payFees",
                "method": "POST",
                "headers": {
                  "content-type": "application/x-www-form-urlencoded",
                },
                "data":data
            }

            $.ajax(settings).done(function (response) {

                loaderHide();

                if(response.val){

                    setTimeout(function(){

                        loaderShow();

                        var data = {
                            userName:localStorage.getItem("userName")
                        }
            
                        var settings = {
                            "async": true,
                            "crossDomain": true,
                            "url": serverURL+"getPaidHistory",
                            "method": "POST",
                            "headers": {
                              "content-type": "application/x-www-form-urlencoded",
                            },
                            "data":data
                        }

                        $.ajax(settings).done(function (response) {
                            loaderHide();
                            $('#payScreen').css('display','none');
                            $('#alreadyPaidScreen').css('display','block');
                            $('#pushDataHere').empty();
                            var outputArray = response.data;
                            for(var i=0;i<outputArray.length;i++){
                                var timeInFormat = moment(outputArray[i].dateOfTransaction).format("dddd, MMMM Do YYYY,h:mm:ss a");
                                var amountPaid = outputArray[i].amount;
                                var fullDataToPush = '<div class="card-panel cardStyle" style="padding-bottom:10px;" > <div class="row" style="margin:0px;"> <div class="col s12"> <center>' + timeInFormat +'</center> </div> <div class="col s12"> <hr> </div> <div class="col s12"> <div class="row flex-div flex-direction-row flex-justify-content-center flex-align-items-center"> <div> Amount Paid - &nbsp; </div> <div>'+ amountPaid+ '</div> </div> </div> </div> </div>';
                                $("#pushDataHere").append(fullDataToPush);
                            }

                        });

                        
                    },1000);
                    Materialize.toast(response.output, 2000);
                }else{
                    Materialize.toast(response.output, 2000);
                }
            })

        },
        "theme": {
            "color": "#F37254"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
}


