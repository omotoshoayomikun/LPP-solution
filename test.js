// const array = [
//     [1, 2, 3],
//     [4, 5, 6],
// ]

// array.splice(1, 0, [7, 8, 9])
// // array.

// console.log(array)

const arr1 = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 400],
    [0, 0, 0, 0, 400],
    [0, 100, 100, 600, 0]
]


let ddd = []
for (let i = 0; i < arr1.length; i++) {
    ddd = new Array(arr1[i].length).fill(0)
    
}
// let ccc = Array.from({length: 1}, () => ddd.push(arr1.length + 1))

console.log(ddd)

arr1.splice(arr1.length - 1, 0, ddd)

console.log(arr1)