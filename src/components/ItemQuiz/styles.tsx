import styled from "styled-components"

export const ItemWrapper = styled.a`
  display: flex;
  height: 200px;
  border-radius: 6px;
  overflow: hidden;
  text-decoration: none;
`
export const CoverImage = styled.img`
  min-width: 140px;
  width: 140px;
  object-fit: cover;
  object-position: center;
`

export const Container = styled.div`
  padding: 16px;
  background-color: #d2d9df;
  width: 240px;
`

export const Title = styled.h2`
  font-size: 20px;
  color: #212121;
  font-weight: 500;
  margin: 0px 0px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg{
    width: 28px;
    height: 28px;
    margin-left: 12px;

    path{
      fill: #a50e4f;
    }
  }
`

export const Author = styled.p`
  margin: 0px;
  font-size: 16px;
  color: #212121;
`

export const Link = styled.a<{ href: string }>`
  margin: 0px;
  font-size: 18px;
  color: ${({ href }) => href ? "#657bcc" : '#212121'};
`

export const Description = styled.p`
  margin: 8px 0;
  font-size: 16px;
  color: #212121;
`