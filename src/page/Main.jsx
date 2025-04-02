import React from "react";
import styled from "styled-components";
import Main1 from "./Main/Main1";
import Main2 from "./Main/Main2";
import Main4 from "./Main/Main4";

const MainContainer = styled.div`
  flex-direction: column;
  align-items: center; /* 세로 가운데 정렬을 위해 추가 */
`;

function Main() {
  return (
    <MainContainer>
      <Main1 />

      <Main2 />
    </MainContainer>
  );
}

export default Main;
