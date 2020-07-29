import React from "react";
import { flowRight } from "lodash";
import { graphql } from "react-apollo";
import { gql } from "apollo-boost";

import CartIcon from "./cart-icon.component";

// call mutation that we defined in typeDefs
// then get back that mutation (in lowercase)
// it is the function that changes cartHidden property
const TOGGLE_CART_HIDDEN = gql`
  mutation ToggleCartHidden {
    toggleCartHidden @client
  }
`;

const GET_ITEM_COUNT = gql`
  {
    itemCount @client
  }
`;

const CartIconContainer = ({ toggleCartHidden, data: { itemCount } }) => {
  return <CartIcon toggleCartHidden={toggleCartHidden} itemCount={itemCount} />;
};

export default flowRight(
  graphql(GET_ITEM_COUNT),
  graphql(TOGGLE_CART_HIDDEN, { name: "toggleCartHidden" })
)(CartIconContainer);

// in the second graphql function, we pass the second parameter as configuration
// it will be a property with the key: name, value:'toggleCartHidden'
