import styled from "styled-components"

export const Item = styled.div<{ correct: boolean }>`
  width: 160px;
  /* height: 250px; */
  background-color: ${({ correct }) => correct ? "#559b54" : "#5a0595" };
`

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
`

export const Title = styled.p`
  margin: 0px;
  padding: 6px 12px;
  font-size: 14px;
  color: #fff;
`

export const ImageWrapper = styled.div`
  display: flex;
  position: relative;
  cursor: pointer;
`

export const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`

export const InputWrapper = styled.div`
  padding: 6px;
`

export const Input = styled.input`
  width: 100%;
  padding: 6px;
  border-radius: 2px;
  border: none;
  outline: none;
`

export const ProgressBar = styled.div`
  height: 2px;
  background-color: red;
  position: absolute;
  left: 0px;
  bottom: 0px;
`

export const Reveal = styled.button`
  padding: 0px;
  margin: 0px;
  margin-right: 8px;
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
`