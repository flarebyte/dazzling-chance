#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

> Number generator based on a text input with vague random properties

In short, the generator produces random values that are predictable and can be repeated.


## Install

```sh
$ npm install --save dazzling-chance
```


## Create your chance

This will create a chance object with:
* text:  an input text used for generating the numbers in a predictable way.
* characters: a list of characters with their mapping to a number.
* weighting (optional): a list of weights to bend the luck a little bit. 


```js
var dazzlingChance = require('dazzling-chance');

       var chance = dazzlingChance({
            text: "qwertyuopasdfghjklzxcvbnm",
            characters: [{
                chars: "0-9a-z",
                integer: 0
            }],
            weighting: [{
                name: "fibonacci",
                weights: [1, 2, 3, 5, 8, 13, 21, 2]
            }]

        });

```

## Create a float number between min and max

```
chance.nextFloat(0, 3))
```

Or using a weight:

```
chance.nextWeightedFloat('fibonacci', 0, 3)
```

## Create an int number between min and max

```
chance.nextInt(0, 3))
```

Or using a weight:

```
chance.nextWeightedInt('fibonacci', 0, 3))
```

## Create a boolean

```
chance.nextBool()
```

Or using a weight:

```
chance.nextWeightedBool('fibonacci')
```


## Create a string from a given list

```
chance.nextString(['a', 'b', 'c', 'd', 'e'])
```
Or using a weight:

```
chance.nextWeightedString('fibonacci', ['a', 'b', 'c', 'd', 'e'])
```

## Create a number from a given list

```
chance.nextNumber([36, 47, 3, 68, 34])
```
Or using a weight:

```
chance.nextWeightedNumber('fibonacci', [36, 47, 3, 68, 34]), 'A')
```

## Create the next random value

type can be: 'int', 'float', 'number', 'bool', 'string'

```
chance.next({
            type: 'float',
            weight: 'fibonacci',
            min: 0,
            max: 3
        });
```

## Create an array of random values

```
chance.nextX(4, {
            type: 'float',
            min: 0,
            max: 10
        })

```

## Create a high resolution random value

```
chance.nextHighRes({
            type: 'float',
            minResolution: 1000,
            min: 0,
            max: 1000
        })
```

## Create an array of high resolution random values

Ex: 10 values

```
chance.nextHighResX(10, {
            type: 'int',
            minResolution: 1000,
            min: 0,
            max: 1000
        })
```


## License

MIT © [Olivier Huin]()


[npm-url]: https://npmjs.org/package/dazzling-chance
[npm-image]: https://badge.fury.io/js/dazzling-chance.svg
[travis-url]: https://travis-ci.org/flarebyte/dazzling-chance
[travis-image]: https://travis-ci.org/flarebyte/dazzling-chance.svg?branch=master
[daviddm-url]: https://david-dm.org/flarebyte/dazzling-chance.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/flarebyte/dazzling-chance
