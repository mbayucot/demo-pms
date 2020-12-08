import styled from "styled-components";

export const Styles = styled.div`
  .hero {
    padding-top: 2rem;
    margin: 0 auto;
    text-align: center;
    color: #121923;

    h1 {
      font-size: 2.4rem;
      letter-spacing: -1px;
      min-height: 0;
      line-height: 1.25;
      margin-bottom: 0;
      margin-block-start: 0.5em;
      margin-block-end: 0.5em;
    }

    &__body {
      margin: 2.35rem auto;
      max-width: 640px;

      p {
        font-size: calc(16px + 0.75vw);
        color: #66758d;
        font-weight: 400;
        line-height: 1.35;
        margin: 0 auto;
      }
    }

    &__cta {
      margin-top: 3em;
    }

    &__collection {
      color: #515e72;

      a {
        margin: 0 0.5em 0.5em 0;
        padding: calc(0.625rem - 1px) calc(0.9375rem - 1px);
        border-radius: 3px;
        font-size: 15px;
      }

      span {
        display: inline-block;
        vertical-align: middle;
        margin: 0 0.5em 0.5em 0;
        color: #515e72;
        font-size: 16px;
      }
    }
  }

  @media only screen and (min-width: 992px) {
    .hero {
      max-width: 768px;

      h1 {
        font-size: 92px;
      }

      &__body {
        max-width: 640px;

        p {
          font-size: 28px;
        }
      }

      &__cta {
        a {
          font-size: 16px;
        }
      }
    }
  }
`;
