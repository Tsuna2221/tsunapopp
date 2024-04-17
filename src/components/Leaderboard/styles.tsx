import styled from "styled-components"

export const Leaderboard = styled.div<{active: boolean}>`
  overflow: hidden;
  transition: 0.3s ease;
  min-width: ${({ active }) => active ? "224px" : "0px"}; ;
  width: ${({ active }) => active ? "224px" : "0px"}; ;
`

export const LeaderboardWrapper = styled.div`
  width: 224px;
  padding-right: 24px;

`

export const List = styled.ul`
  list-style: none; 
  margin: 0px;
  padding: 0px;
  color: #fff;
`

export const User = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

export const Name = styled.span`
  color: #fff;
  font-size: 14px;
`

export const Points = styled.span`
  display: block;
  color: #fff;
  font-size: 12px;
`
