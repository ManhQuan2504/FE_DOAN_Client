import styled from "styled-components";

export const LoadingOverlay = styled.div`
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .loading svg {
    font-size: 5px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    animation: text 1s ease-in-out infinite;
  }
  @keyframes text {
    50% {
      opacity: 0.1;
    }
  }
  .loading polygon {
    stroke-dasharray: 22;
    stroke-dashoffset: 1;
    animation: dash 4s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite
      alternate-reverse;
  }
  @keyframes dash {
    to {
      stroke-dashoffset: 234;
    }
  }
`;
