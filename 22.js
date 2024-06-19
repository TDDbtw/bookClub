let a = [793, 739, 1993, 1973, 272, 9283, 2622, 625, 2819]
let b = a.map((item, index) => {
  return String(item).split("").reverse().join("")
})
b = b.map((item) => {
  return Number(item)
})
console.log(b)
