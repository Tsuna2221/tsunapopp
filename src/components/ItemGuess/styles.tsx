import styled from "styled-components"

export const Item = styled.div<{ correct: boolean, color: boolean }>`
  width: 160px;
  /* height: 250px; */
  background-color: ${({ correct, color }) => color ? `${color}80` : correct ? "#559b54" : "#5a0595" };
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
  overflow: hidden;
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

export const UserOverlay = styled.div<{active: string | undefined}>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
  background: rgb(0,0,0);
  background: linear-gradient(0deg, rgba(0,0,0,1) 18%, rgba(255,255,255,0) 100%);
  bottom: ${({ active }) => active ? "0px" : "-60px"};
  color: #fff;
  transition: 0.3s ease;
`