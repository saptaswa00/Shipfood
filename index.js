let isOrderAccepted = false;
let isValetAssigned = false;
let hasRestaurantSeen = false;
let restaurantTimer = null;
let valetTimer = null;
let isOrderDelivered = false;
let valetDeliveryTimer = null;

// Application start or refresh
window.addEventListener('load', function(){
    document.getElementById('acceptOrder').addEventListener('click', function(){
        askRestaurantToAcceptOrReject();
    });

    document.getElementById('findValet').addEventListener('click', function(){
        searchForValet();
    });

    this.document.getElementById('deliverOrder').addEventListener('click', function(){
        setTimeout(()=>{
            isOrderDelivered = true;
        }, 2000);
    })


    checkIfRestaurantAcceptedOrRejected()
    .then(isOrderAccepted=>{
        console.log('Update from restaurant - ',isOrderAccepted);
        // Step 2.1 :
        if(isOrderAccepted) startPreparingOrder();
        // step 2.2 :
        else alert("Sorry ! Restaurant couldn't accept your order , your money will be return sortly.");
    })
    .catch(err=>{
        console.log(err);
        alert('Something went wrong ! Please, try again later.');
    })
    
})

// Step 1 : Check wheather Restaurant accept the order or not
function askRestaurantToAcceptOrReject(){ 
    //callback
    setTimeout(()=>{   
        isOrderAccepted = confirm('Restaurant - Accept the Order ?')
        hasRestaurantSeen = true;
    }, 1000);
}

// Step 2 : Check if Restaurant accepted the order
function checkIfRestaurantAcceptedOrRejected(){
    // promise
    return new Promise((resolve,reject)=>{                   
        restaurantTimer = setInterval(()=>{                                       
            console.log('Check Order Accepted or not ....');     
            if(!hasRestaurantSeen) return;         
                          
            if(isOrderAccepted) resolve(true);                  
            else resolve(false);                   
            
            clearInterval(restaurantTimer);
        },5000);                                                
    });
}

// Step 3 : Start Preparing....
function startPreparingOrder(){         // startPreparingOrder
    Promise.allSettled([
        updateOrderStatus(),
        updateMapView(),
        valetAssignedCheck(),
        checkForDelivery()
    ])
    .then(result=>{
        console.log(result);
        setTimeout(()=>{
            alert('How was your food ? Rate your food and delivery partner')
        },4000);
    })
    .catch(err=>{
        console.log(err);
    })
}

// Helper function or Pure function
function updateOrderStatus(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            document.getElementById('currentStatus').innerText = isOrderDelivered ? 'Order Delivered Successfully' : 'Preparing your order ......';
            resolve(' Order status updated')
       },2000);
    })
}   

function updateMapView(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            document.getElementById('mapview').style.opacity = '1';
            resolve('Map Initilized')
        },1500);
    })
}

function searchForValet(){
    //getValets
    const valets = [];
    for(let i=0; i<5; i++){
        valets.push(getRandomDriver()); // Push : Append new element to the end of the array
    }
    console.log(valets);

    //Select one valet (which take less time)
    Promise.any(valets)
    .then(selectedValet =>{
        console.log('Your Selected Valet :', selectedValet);
        isValetAssigned = true;
    })
    .catch(err=>{
        console.error(err);
    })

}

function getRandomDriver(){
    // Fake delay to get location data from riders
    return new Promise((resolve, reject)=>{
        const Timeout = Math.random()*1000;
        setTimeout(()=>{
            resolve('Valet Time -  ' + Timeout)
        }, Timeout);
    });
}

function valetAssignedCheck(){
    return new Promise((resolve, reject)=>{
        valetTimer = setInterval(()=>{
            console.log('Searching for Valet');
            if(isValetAssigned){
                updateValetStatus();
                resolve('Update Valet Details');
                clearTimeout(valetTimer);          //
            }
        }, 2000);
    })
}

function checkForDelivery(){                                // This controll will be handled by Valet delivery boy
    return new Promise((resolve, reject)=>{
        valetDeliveryTimer = setInterval(()=>{
            console.log('Order Reaching the Destination');
            if(isOrderDelivered){
                updateOrderStatus();
                resolve('Order Delivery Details');
                clearTimeout(valetDeliveryTimer);
            }
        }, 2000);
    })
}

function updateValetStatus(){
    if(isValetAssigned){
        setTimeout(()=>{        
        document.getElementById('finding-driver').classList.add('none');
        document.getElementById('found-driver').classList.remove('none');
        document.getElementById('call').classList.remove('none');
    }, 2000)
    }
}



/* 
function updateValetStatus(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            document.getElementById('driver-into').innerHTML = 'Hurrah!! We found your valet , will be there in x minutes';
            resolve('Valet status updated')
        }, 2000);
    }) 
}
*/

/*
    //callback
    setTimeout(()=>{
        if(isOrderAccepted) alert('Order Accepted');
        else alert('Order Rejected');
    }, 5000); // 5 sec callback
*/

