//Calculate the payment for the loan
function calcPayment(amount, rate, term) {
    return (amount * rate) / (1 - Math.pow(1 + rate, -term));
}

//calculate the interst for the current balance of the loan
function calcInterest(balance, rate) {
    return balance * rate;
}

function buildSchedule() {
    const loanAmount = Number(document.getElementById("lamount").value);
    let rate = parseFloat(document.getElementById("lrate").value);

    //convert rate to a monthly interest rate
    rate = rate / 1200;

    //Assume monthly input
    const term = parseInt(document.getElementById("lterm").value);
    const payment = calcPayment(loanAmount, rate, term);
    let paymentDS = getPayments(loanAmount, rate, term, payment);

    //pass the array to the display function
    displayData(paymentDS);
}

//Build the amoritization schedule
function getPayments(amount, rate, term, payment) {
    //setup an array to hold payments;
    //payments will hold an array of monhtly payment objects
    //summary will hold summary data object
    let paymentDS = {
        payments: [],
        summary: {}
    };

    //setup some variables to hold the value in the schedule
    let balance = amount;
    let totalInterest = 0;
    let monthlyPrincipal = 0;
    let monthlyInterest = 0;
    let monthlyTotalInterest = 0;

    //create a loop for each month of the loan term
    for (month = 1; month <= term; month++) {
        //Calculate the payment and interest
        monthlyInterest = calcInterest(balance, rate);
        totalInterest += monthlyInterest;
        monthlyPrincipal = payment - monthlyInterest;
        balance = balance - monthlyPrincipal;

        //add the details to an object
        let curPayment = {
            month: month,
            payment: payment,
            principal: monthlyPrincipal,
            interest: monthlyInterest,
            totalInterest: totalInterest,
            balance: balance
        };
        //push the curPayment to the payments array
        paymentDS.payments.push(curPayment);
    }

    let summary = {
        payment: payment,
        totalPrincipal: amount,
        totalInterest: totalInterest,
        totalCost: (amount + totalInterest)
    };

    paymentDS.summary = summary;

    return paymentDS;

}

//display the data to the user
function displayData(paymentDS) {
    //get the table we are going to add to.
    let tableBody = document.getElementById("scheduleBody");
    let template = document.getElementById("scheduleTemplate");

    //clear the table for previous calculations
    tableBody.innerHTML = "";

    for (let i = 0; i < paymentDS.payments.length; i++) {
        //get a clone row template
        payRow = template.content.cloneNode(true);
        //grab only the columns in the template
        paycols = payRow.querySelectorAll("td");

        //build the row
        //we know that there are six columns in our template
        paycols[0].textContent = paymentDS.payments[i].month;
        paycols[1].textContent = paymentDS.payments[i].payment.toFixed(2);
        paycols[2].textContent = paymentDS.payments[i].principal.toFixed(2);
        paycols[3].textContent = paymentDS.payments[i].interest.toFixed(2);
        paycols[4].textContent = paymentDS.payments[i].totalInterest.toFixed(2);
        paycols[5].textContent = Math.abs(paymentDS.payments[i].balance).toFixed(2);

        //append to the table
        tableBody.appendChild(payRow);
    }

    //total interest is in the last row of the payments array.
    let totalInterest = paymentDS.summary.totalInterest;
    let payment = paymentDS.summary.payment;
    let loanAmount = paymentDS.summary.totalPrincipal;
    let totalCost = paymentDS.summary.totalCost;

    //Build out the summary area
    let labelPrincipal = document.getElementById("totalPrincipal");
    labelPrincipal.innerHTML = Number(loanAmount).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

    let labelInterest = document.getElementById("totalInterest");
    labelInterest.innerHTML = Number(totalInterest).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

    let paymentdiv = document.getElementById("payment");
    paymentdiv.innerHTML = Number(payment).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

    let totalCostDiv = document.getElementById("totalCost");
    totalCostDiv.innerHTML = Number(totalCost).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

}