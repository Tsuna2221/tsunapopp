import styled from "styled-components"

export const Main = styled.main`
  padding: 0 50px;
`

export const Grid = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
`

export const Container = styled.div`
  width: 100%;
`

export const Count = styled.p`
  font-size: 24px;
  color: #fff;
  text-align: center;
`

export const Title = styled.p`
  font-size: 18px;
  color: #fff;
  text-align: center;
`

export const Description = styled.p`
  font-size: 16px;
  color: #fff;
  text-align: center;
`

export const InputRange = styled.input`
  width: 200px;
  position: fixed;
  transform: rotate(-90deg);
  right: -70px;
  bottom: 150px;
  color: rgb(90, 5, 149);
`