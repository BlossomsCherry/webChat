function myInstanceof(left, right) {
  if (typeof left !== 'object' || left === null) return false

  let proto = Object.getPrototypeOf(left)
  let prototype = right.prototype

  while (true) {
    if (!proto) return false
    if (proto === prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}

console.log(myInstanceof([], Array))

var obj = {
  a: 1,
  b: 2,
  c: 3
}
obj[Symbol.iterator] = function* () {
  var keys = Object.keys(obj)
  for (var k of keys) {
    yield [k, obj[k]]
  }
}

for (var [k, v] of obj) {
  console.log(k, v)
}
