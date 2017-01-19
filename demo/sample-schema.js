export default {
  id: "cart",
  $schema: "http://json-schema.org/draft-04/schema#",
  title: "Cart",
  description: "Items in a user's cart",
  type: "object",
  required: ["ID", 'price'],
  properties: {
    ID: {
      type: "string",
      description: "the uid of the item",
      example: "1"
    },
    choices: {
      "type": "array",
      description: 'an array of simple choices',
      "items": {
        "type": "string"
      },
      "example": [
        "a"
      ]
    },
    complexChoices: {
      type: 'array',
      description: 'an array of complex choices',
      items: {
        type: 'object',
        description: 'the complex type',
        properties: {
          apple: {
            type: 'string'
          }
        }
      }
    },
    price: {
      description: 'the price of the thing',
      "type": "number",
      "minimum": 0,
      "exclusiveMinimum": true
    },
    "dimensions": {
      "type": "object",
      description: 'how big is the object',
      "properties": {
        "length": {
          description: 'this must be a length',
          "type": "number"
        },
        "width": {
          "type": "number"
        },
        "height": {
          "type": "number"
        }
      }
    }
  }
};
