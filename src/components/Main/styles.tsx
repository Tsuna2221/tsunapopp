import styled from "styled-components"

export const Main = styled.main`
  padding: 0 50px;
  display: flex;
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

export const ChannelForm = styled.form`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
`

export const ChannelInput = styled.input`
  width: 200px;
  height: 38px;
  outline: none;
  border: 1px solid transparent;
  padding: 0px 16px;
  font-size: 16px;
  border-radius: 4px;
  transition: all 0.3s ease 0s;
`

export const ChannelSubmit = styled.button`
  width: 100px;
  height: 38px;
  border: none;
  border-radius: 4px;

`