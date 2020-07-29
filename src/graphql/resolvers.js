// pass an obj to client, let client know what values to resolve
// depending on what mutations or what queries get called from the local client side

import { gql } from "apollo-boost";
// then define the type, aka schema that this local side is going to use and get access to

// extend: extend to the existing type of mutation
// that might exist in the backend
// !: signify it, it must be there
// type definition should be capitalized
// [Item]!: Item might be there, but that [] must come back

import { addItemToCart } from "./cart.utils";
import { getCartItemCount } from "../redux/cart/cart.utils";

export const typeDefs = gql`
  extend type Item {
    quantity: Int
  }

  extend type Mutation {
    ToggleCartHidden: Boolean!
    AddItemToCart(item: Item!): [Item]!
  }
`;

const GET_CART_HIDDEN = gql`
  {
    cartHidden @client
  }
`;

const GET_CART_ITEMS = gql`
  {
    cartItems @client
  }
`;

const GET_ITEM_COUNT = gql`
  {
    itemCount @client
  }
`;

// mutation definition: it can be the regular camelcase
// _: these are meant to not be modified
// _root: top level object that holds the actual type
//   toggleCartHidden: (_root, _args, _context, _info)=>
// _info: never got used
// _args, cache -- what we need
export const resolvers = {
  Mutation: {
    toggleCartHidden: (_root, _args, { cache }) => {
      const { cartHidden } = cache.readQuery({
        query: GET_CART_HIDDEN,
      });

      cache.writeQuery({
        query: GET_CART_HIDDEN,
        data: { cartHidden: !cartHidden },
      });

      return !cartHidden;
    },

    //get items out from cached data
    addItemToCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_ITEMS,
      });

      const newCartItems = addItemToCart(cartItems, item);

      cache.writeQuery({
        query: GET_ITEM_COUNT,
        data: { itemCount: getCartItemCount(newCartItems) },
      });

      cache.writeQuery({
        query: GET_CART_ITEMS,
        data: { cartItems: newCartItems },
      });

      return newCartItems;
    },
  },
};
