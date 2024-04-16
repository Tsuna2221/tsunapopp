import styled, { keyframes } from "styled-components"

const spin = keyframes`
   0% {
      transform: rotate(0deg) translateY(-200%);
   }

   60%, 100% {
      transform: rotate(360deg) translateY(-200%);
   }
`;

export const SpinnerElement = styled.div`
  position: absolute;
  top: 50%;
  width: 15.7px;
  height: 15.7px;

  div{
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 50%;
    animation: ${spin} 1.25s infinite backwards;

    &:nth-child(1) {
      animation-delay: 0.15s;
      background-color: rgba(255, 255, 255, 0.9);
    }

    &:nth-child(2) {
      animation-delay: 0.3s;
      background-color: rgba(255, 255, 255,0.8);
    }

    &:nth-child(3) {
      animation-delay: 0.45s;
      background-color: rgba(255, 255, 255,0.7);
    }

    &:nth-child(4) {
      animation-delay: 0.6s;
      background-color: rgba(255, 255, 255,0.6);
    }

    &:nth-child(5) {
      animation-delay: 0.75s;
      background-color: rgba(255, 255, 255,0.5);
    }
  }
`