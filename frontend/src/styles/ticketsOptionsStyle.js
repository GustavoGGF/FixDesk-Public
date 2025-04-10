import styled from "styled-components";

export const Select = styled.select`
  width: 20em;
  ${(props) => props.required}
  -webkit-width: 20em; /* Adicionado para compatibilidade com navegadores baseados em WebKit */
`;

export const DivMachine = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 1em;
  background-color: lightsalmon;
  cursor: pointer;
  border-radius: 1em;
  transition: ease-in 0.4s;
  margin: 1em;
  &:hover {
    transform: scale(1.13);
  }
`;

export const ImgMachines = styled.img`
  width: 14em;
  margin: 0 auto;
`;
