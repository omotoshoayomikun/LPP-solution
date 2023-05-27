const supplyInput = document.getElementById('supply');
const demandInput = document.getElementById('demand');
const calculate = document.getElementById('calculate');
const table = document.getElementById('table');
const container = document.getElementById('container');
const container2 = document.getElementById('container2');
const cont_table = document.getElementById('cont_table');
const total_dis = document.getElementById('total_dis');

calculate.addEventListener('click', cal)

const costs = [];
let westSupply = [];
let westDemand = [];
let staySupply = [];
let stayDemand = [];
let westCosts = [];
let allocation;

function cal() {
    table.innerHTML = '';
    container.innerHTML = '';

    const supply = parseInt(supplyInput.value, 10);
    const demand = parseInt(demandInput.value, 10);

    const numRow = supply + 2;
    const numCol = supply + 2;

    // Initialize costs and allocations arrays
    for (let i = 0; i < numRow; i++) {
        costs.push([])
        for (let j = 0; j < numCol; j++) {
            costs[i][j] = 0

        }

    }

    // Creating a table
    for (let i = 0; i < numRow; i++) {
        const row = table.insertRow()

        for (let j = 0; j < numCol; j++) {
            const cell = row.insertCell()

            if (i === 0 && j > 0 && j < numCol - 1) {
                cell.innerHTML = 'D' + j
            }

            if (i > 0 && i < numRow - 1 && j === 0) {
                cell.innerHTML = 'S' + i
            }

            if (i === 0 && j === numCol - 1) {
                cell.innerHTML = 'Supply'
            }

            if (i === numRow - 1 && j === 0) {
                cell.innerHTML = 'Demand'
            }

            if (i === numRow - 1 && j === numCol - 1) {
                // Total
                cell.innerHTML = ''
            }

            if (i > 0 && j === numCol - 1 && i < numRow - 1) {
                // SUPPLY
                const input = document.createElement('input')
                input.size = 5;
                input.type = 'number';
                cell.appendChild(input)

                input.addEventListener('input', function () {
                    costs[i][j] = parseInt(input.value, 10) || 0;
                })
            }

            if (i === numRow - 1 && j > 0 && j < numCol - 1) {
                // DEMAND
                const input = document.createElement('input')
                input.size = 5;
                input.type = 'number';
                cell.appendChild(input)

                input.addEventListener('input', function () {
                    costs[i][j] = parseInt(input.value, 10) || 0;
                })
            }

            if (i > 0 && j > 0 && i < numRow - 1 && j < numCol - 1) {
                const input = document.createElement('input');
                input.type = 'number';
                input.size = 5;
                cell.appendChild(input)

                input.addEventListener('input', function () {
                    costs[i][j] = parseInt(input.value, 10) || 0;
                })
            }

            // NOW CREATE A BUTTON FOR SOLVE

            container.innerHTML = `<button id='button'>Solve</button>`
            const button = document.getElementById('button');
            button.addEventListener('click', Solve)

        }

    }
}


function leastWestTable(supply, demand, cost, allocation) {
    const table = document.createElement('table');
    table.innerHTML = '';

    const numRow = supply.length + 2;
    const numCol = demand.length + 2;
    const potArray = [];


    for (let i = 0; i < cost.length; i++) {
        potArray.push([])
        for (let j = 0; j < allocation.length; j++) {
            potArray[i][j] = cost[i][j] + ',' + allocation[i][j]
        }

    }


    for (let i = 0; i < numRow; i++) {
        const row = table.insertRow()

        for (let j = 0; j < numCol; j++) {
            const cell = row.insertCell()

            if (i === 0 && j > 0 && j < numCol - 1) {
                cell.innerHTML = 'D' + j
            }

            if (i > 0 && i < numRow - 1 && j === 0) {
                cell.innerHTML = 'S' + i
            }

            if (j === numCol - 1 && i === 0) {
                cell.innerHTML = 'Supply'
            }
            if (j === 0 && i === numRow - 1) {
                cell.innerHTML = 'Demand'
            }
            if (i === numRow - 1 && j === numCol - 1) {
                cell.innerHTML = 'Total'
            }

            if (i === numRow - 1 && j > 0 && j < numCol - 1) {
                cell.innerHTML = demand[j - 1]
            }

            if (j === numCol - 1 && i > 0 && i < numRow - 1) {
                cell.innerHTML = supply[i - 1]
            }

            if (i > 0 && j > 0 && i < numRow - 1 && j < numCol - 1) {
                cell.innerHTML = potArray[i - 1][j - 1].split(',').map(x => (
                    `<span class='forge'>${x}</span>`
                ))
            }
        }

    }


    cont_table.innerHTML = `<table>${table.innerHTML}</table>`

}

// Function to find the least cost path considering supply and demand constraints
function findLeastCostPath(westCosts, supply, demand) {
    const numRows = supply.length;
    const numCols = demand.length;

    // Initialize an empty allocation matrix
    const allocation = [];
    for (let i = 0; i < numRows; i++) {
        allocation[i] = new Array(numCols).fill(0);
    }

    // Allocate the available supply based on the least cost rule
    while (true) {
        let minCost = Infinity;
        let minRow = -1;
        let minCol = -1;

        // Find the cell with the least cost
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                if (supply[i] > 0 && demand[j] > 0 && westCosts[i][j] < minCost) {
                    minCost = westCosts[i][j];
                    minRow = i;
                    minCol = j;
                }
            }
        }

        // If no cell with supply and demand is found, exit the loop
        if (minRow === -1 || minCol === -1) {
            break;
        }

        // Allocate supply to the cell with the least cost
        const allocationQuantity = Math.min(supply[minRow], demand[minCol]);
        allocation[minRow][minCol] = allocationQuantity;

        // Update the remaining supply and demand
        supply[minRow] -= allocationQuantity;
        demand[minCol] -= allocationQuantity;
    }

    // Calculate the total cost


    leastWestTable(staySupply, stayDemand, westCosts, allocation)


    let totalCost = 0;
    let vvv = ''
    total_dis.innerHTML = ''

    total_dis.innerHTML += 'Total: '

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (westCosts[i][j] != 0) {
                vvv += ('( ' + westCosts[i][j] + ' * ' + allocation[i][j] + ' )' + '+');
            }
            totalCost += westCosts[i][j] * allocation[i][j];
        }
    }

    total_dis.innerHTML += vvv.slice(0, -1)


    container2.innerHTML = `<div class="span-text">Least Cost Rule Ans:  ${totalCost}</div>`


    return {
        allocation,
        totalCost
    };


}

function Solve() {

    westCosts = [];
    westSupply = [];
    westDemand = [];
    stayDemand = [];
    staySupply = []

    let counter = 0;

    for (i = 0; i < costs.length; i++) {

        if (i > 0 && i < costs.length - 1) {
            westCosts.push([])
            counter++
        }

        for (let j = 0; j < costs[i].length; j++) {

            // TO FIND THE SUPPLY OUT OF THE ARRAY
            if (i > 0 && i < costs.length - 1 && j === costs[i].length - 1) {
                westSupply.push(costs[i][j])
                staySupply.push(costs[i][j])
            }

            // TO FIND THE DEMAND OUT OF THE ARRAY
            if (i > 0 && i === costs.length - 1 && j > 0 && j < costs[i].length - 1) {
                westDemand.push(costs[i][j])
                stayDemand.push(costs[i][j])
            }

            // TO FIND THE REAL COST OUT OF THE ARRAY

            if (i > 0 && i < costs.length - 1 && j > 0 && j < costs[i].length - 1) {
                westCosts[counter - 1].push(costs[i][j])
            }

        }

    }

    findLeastCostPath(westCosts, westSupply, westDemand);


    // console.log({ 'allocation': allocation });
    console.log({ 'westcost': westCosts });
    console.log({ 'demand': westDemand });
    console.log({ 'westSupply': westSupply });

    // northWestCornerMethod(westSupply, westDemand, westCosts)

}
