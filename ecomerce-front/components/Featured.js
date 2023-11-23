import styled from "styled-components";
import Center from "./Center";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const BackgroundFeatured = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const ColumnWraper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  img {
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
  font-weight: normal;
`;

const Description = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonWraper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

export default function Featured({ product }) {
  const { addProduct } = useContext(CartContext);
  function addFeaturedToCart() {
    addProduct(product._id);
  }

  return (
    <BackgroundFeatured>
      <Center>
        <ColumnWraper>
          <Column>
            <div>
              <Title>{product.title}</Title>
              <Description>{product.description}</Description>
              <ButtonWraper>
                <ButtonLink
                  href={"/products/" + product._id}
                  outline={1}
                  white={1}
                  size="l"
                >
                  Read more
                </ButtonLink>
                <Button onClick={addFeaturedToCart} white size="l">
                  <CartIcon />
                  Add to cart
                </Button>
              </ButtonWraper>
            </div>
          </Column>
          <Column>
            <img src="/MacbookPro14.png" alt="Macbook Pro 14 inch 2021"></img>
          </Column>
        </ColumnWraper>
      </Center>
    </BackgroundFeatured>
  );
}
