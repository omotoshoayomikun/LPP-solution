const supplyInput = document.getElementById('supply');
const demandInput = document.getElementById('demand');
const calculate = document.getElementById('calculate');
const table = document.getElementById('table');
const container = document.getElementById('container');
const container2 = document.getElementById('container2');
const cont_table = document.getElementById('cont_table');
const total_dis = document.getElementById('total_dis');


calculate.addEventListener('click', Cal)
const costs = [];
// const allocations = [];
let westSupply = [];
let westDemand = [];
let staySupply = [];
let stayDemand = [];
let westCosts = [];
let allocation;
let dummyD = false;
let dummyS = false;

function Cal() {

    table.innerHTML = ''
    container.innerHTML = ''
    // cont_table.children = ''

    const supply = parseInt(supplyInput.value, 10);
    const demand = parseInt(demandInput.value, 10);

    if (supplyInput.value == '' || demandInput.value == '') {
        alert('Please Input Rows and Columns')
    } else {

        const numRow = supply + 2;
        const numCol = demand + 2;


        // Initialize costs and allocations arrays
        for (let i = 0; i < numRow; i++) {
            costs.push([]);
            // allocations.push([]);
            for (let j = 0; j < numCol; j++) {
                costs[i][j] = 0;
                // allocations[i][j] = 0;
            }
        }

        // Create the table

        for (let i = 0; i < numRow; i++) {
            const row = table.insertRow()

            for (let j = 0; j < numCol; j++) {

                const cell = row.insertCell()

                if (i === 0 && j > 0 && j < numCol - 1) {
                    cell.innerHTML = 'D' + j;
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
                    // Total
                    cell.innerHTML = ''
                }


                if (i === numRow - 1 && j > 0 && j < numCol - 1) {
                    const input = document.createElement('input');
                    console.dir(input)
                    input.type = 'number';
                    input.size = 5;
                    cell.appendChild(input)

                    input.addEventListener('input', function () {
                        costs[i][j] = parseInt(input.value, 10) || 0;
                    })
                }

                if (j === numCol - 1 && i > 0 && i < numRow - 1) {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.size = 5;
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

            }
        }

        // button.innerHTML = 'Solve';

        container.innerHTML = `<button id='button'>Solve</button>`
        const button = document.getElementById('button');
        button.addEventListener('click', Solve)

    }
}


// FUNCTION USE TO GET THE STEPPING STONE
// Function to find the least cost path considering supply and demand constraints

function findLeastCostPath(costMatrix, supply, demand) {

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
                if (supply[i] > 0 && demand[j] > 0 && costMatrix[i][j] < minCost) {
                    minCost = costMatrix[i][j];
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



    let totalCost = 0;
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {

            totalCost += costMatrix[i][j] * allocation[i][j];
        }
    }



    const cont2_div = document.createElement('div');

    container2.innerHTML += `<div class="span-text">Stepping Stone Ans:  ${totalCost}</div>`

    return {
        allocation,
        totalCost
    };

    let sum = 0;


}


function northWestCornerMethod(supply, demand, cost) {
    const supplyLength = supply.length;
    const demandLength = demand.length;
    allocation = Array.from({ length: supplyLength }, () => Array(demandLength).fill(0));

    let i = 0;
    let j = 0;

    while (i < supplyLength && j < demandLength) {
        if (supply[i] < demand[j]) {
            allocation[i][j] = supply[i];
            demand[j] -= supply[i];
            supply[i] = 0;
            i++;
        } else if (supply[i] > demand[j]) {
            allocation[i][j] = demand[j]
            supply[i] -= demand[j];
            demand[j] = 0;
            j++
        } else {
            allocation[i][j] = supply[i];
            supply[i] = 0;
            demand[j] = 0;
            i++;
            j++;
        }
    }


    northWestTable(staySupply, stayDemand, westCosts, allocation)

    let sum = 0;
    let vvv = '';
    total_dis.innerHTML = ''

    total_dis.innerHTML += 'Total: '

    for (let i = 0; i < westCosts.length; i++) {
        for (let j = 0; j < westCosts[i].length; j++) {
            if (westCosts[i][j] !== 0) {
                vvv += ('( ' + westCosts[i][j] + ' * ' + allocation[i][j] + ' )' + '+');

                sum += westCosts[i][j] * allocation[i][j]
            }


        }

    }

    total_dis.innerHTML += vvv.slice(0, -1)

    container2.innerHTML = `<div class="span-text">North West Ans:  ${sum}</div>`



    findLeastCostPath(westCosts, staySupply, stayDemand);



    console.log({ 'allocation': allocation });
    console.log({ 'westcost': westCosts });
    console.log({ 'demand': demand });
    console.log({ 'westSupply': westSupply });

    return allocation

}

function northWestTable(supply, demand, cost, allocation) {
    const table = document.createElement('table');
    table.innerHTML = ''

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
                // if (dummyD === true && j == numCol - 2) {
                //     cell.innerHTML = 'Dummy'

                // }
                cell.innerHTML = 'D' + j
            }

            if (i > 0 && i < numRow - 1 && j === 0) {
                // if (dummyS === true && i == numRow - 2) {
                //     cell.innerHTML = 'Dummy'

                // }
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
                // for (i = 0; i < potArray.length; i++) {
                //     for (i = 0; i < potArray.length; i++) {
                //       cell.innerHTML = potArray[i][j].split(',').map(x => `<span class='forge'>${x}</span>`)
                //         // return
                //     }
                // }
            }
        }

    }


    cont_table.innerHTML = `<table>${table.innerHTML}</table>`

}


function Solve() {

    westCosts = [];
    westSupply = [];
    westDemand = [];
    staySupply = [];
    stayDemand = []

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




    let totalDemand = 0
    let totalSupply = 0

    for (demand of stayDemand) {
        totalDemand += demand
    }

    for (supply of staySupply) {
        totalSupply += supply
    }

    if (totalDemand !== totalSupply) {
        if (totalSupply > totalDemand) {
            for (let i = 0; i < costs.length; i++) {

                if (i < costs.length - 1) {
                    costs[i].splice(costs[i].length - 1, 0, 0)
                } else {
                    costs[i].splice(costs[i].length - 1, 0, totalSupply - totalDemand)
                }

            }

            dummyD = true;

        }

        if (totalDemand > totalSupply) {

            let ddd = []
            for (let i = 0; i < costs.length; i++) {
                ddd = new Array(costs[i].length).fill(0)
            }

            costs.splice(costs.length - 1, 0, ddd)

            for (let i = 0; i < costs.length; i++) {
                if (i == costs.length - 2) {
                    costs[i][costs[i].length - 1] = totalDemand - totalSupply
                }

            }

            dummyS = true

            westCosts = [];
            westSupply = [];
            westDemand = [];
            staySupply = [];
            stayDemand = [];
    
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

        }




        // northWestCornerMethod(westSupply, westDemand, westCosts)
    }
    //  else {
    // console.log('it the same')
    northWestCornerMethod(westSupply, westDemand, westCosts)

    // }

    console.log(costs)
    // northWestCornerMethod(westSupply, westDemand, westCosts)

}



