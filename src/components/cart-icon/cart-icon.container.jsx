import React from "react";
import { Mutation, Query } from "react-apollo";
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

const CartIconContainer = () => (
  <Query query={GET_ITEM_COUNT}>
    {({ data: { itemCount } }) => (
      <Mutation mutation={TOGGLE_CART_HIDDEN}>
        {(toggleCartHidden) => (
          <CartIcon toggleCartHidden={toggleCartHidden} itemCount={itemCount} />
        )}
      </Mutation>
    )}
  </Query>
);

export default CartIconContainer;
