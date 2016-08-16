
// collect data for add button
var addButton = document.querySelector('button[name=add]');
addButton.addEventListener(
    'click', function (event) {
        var priceIndex = document.querySelector('section.newArticles select[name=price]').selectedIndex;
        var price = document.querySelector('section.newArticles select[name=price]').options[priceIndex].value;
        var amountIndex = document.querySelector('section.newArticles select[name=amount]').selectedIndex;
        var amount = document.querySelector('section.newArticles select[name=amount]').options[amountIndex].value;
        var name = document.querySelector('section.newArticles input[name=name]').value;
        if(name=="") {
            name = "some stuff";
        }
        document.querySelector('section.articles').innerHTML += '<p><span class="amount">'+amount+'</span> x <span class="price">'+price+'</span>€ - <span class="name">' +name+"</span></p>";
        document.querySelector('section.newArticles button[name=pay]').style="display:inline-block";
    }
);

// inititiate payment request with pay button
var payButton = document.querySelector('button[name=pay]');
payButton.addEventListener(
    'click', function (event) {
        console.log("pay button clicked");
        if (!window.PaymentRequest) {
            console.log("no payment request available");
            alert("your browser does not support payment requests");
            return;
        }
        sendPaymentRequest();
    }
);

/**
 * Creates Payment Request and sends it
 * 
 * @returns {undefined}
 */
function sendPaymentRequest(){
    var details = collectCartDetails();
        console.log(details);
        console.log("no payment request available");
        var payment = new PaymentRequest(
            [
                {
                    supportedMethods: ['visa', 'mastercard']
                }
            ],
            details,
            {
                requestShipping: false,
                requestPayerPhone: true,
                requestPayerEmail: true
            }
        );

        payment.show()
            .then(
                function (response) {
                    console.log(JSON.stringify(response.details, null, 2));
                    response.complete("success");
                    return;

                }
            )
            .catch(
                function (error) {
                    response.complete("fail");
                    print('Could not charge user. ' + error);
                }
            );
}

/**
 * Collects all data shown in the details section of the payment request ui
 * 
 * @returns object details as shown here https://www.w3.org/TR/payment-request/#paymentrequest-constructor
 */
function collectCartDetails(){
    var cartItems = document.querySelectorAll('section.articles p');
    var displayItems = [];
    var total = 0;
    var totalAmount = 0;
    for (var i = 0; i < cartItems.length; i++) {
        console.log(cartItems[i]);
        var amount = parseInt(cartItems[i].querySelectorAll("span.amount")[0].innerHTML);
        var price = parseFloat(cartItems[i].querySelectorAll("span.price")[0].innerHTML);
        var name = cartItems[i].querySelectorAll("span.name")[0].innerHTML;
        console.log(amount,price,name);
        displayItems.push(
            {
                label: amount+"x "+name,
                amount: { currency: 'EUR', value: amount*price }
            }
        );
        total += amount*price;
        totalAmount += amount;
    }
    return {
        displayItems: displayItems,
        total: {
            label: 'Total Cart\nItems: '+totalAmount,
            amount: { currency: 'EUR', value : total }}
    };
};
        