import  styled from "styled-components";

export const Container = styled.div`
  position: sticky;
  top:0;
  left:0;
  right:0;
  z-index: 50;

  .header-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 5rem;
    width:auto;
    background-color: #365bc7;
    position: relative;
    padding: 16px;

    img{
        width: 120px;
    }
}

`;
