import styled from "styled-components";

export const HeaderNav = styled.header`
  nav.navbar {
    font-size: 16px;
    align-items: center;
    padding: 0;

    .container-fluid {
      padding-top: 1rem;

      h5 {
        margin-left: 1rem;
      }

      .navbar-toggler {
        border: 0;
        margin-right: 0.5rem;
      }

      .navbar-collapse {
        margin: 0.5rem -15px 0;
        padding: 1.5rem 0;
        box-shadow: 0 15px 11px rgba(20, 23, 31, 0.05),
          inset 0 0 46px rgba(20, 23, 31, 0.06),
          0 24px 38px rgba(20, 23, 31, 0.19);

        ul.navbar-nav {
          align-items: center;

          li.nav-item {
            margin: 0.4rem 0;

            a {
              padding: calc(0.625rem - 1px) calc(1rem - 1px);
              color: #66758d;

              &:hover {
                color: #121923;
              }

              &.btn {
                font-size: 15px;
                color: #fff;
                border-radius: 3px;
                border-width: 1px;

                &:hover {
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }

  @media only screen and (min-width: 992px) {
    nav.navbar {
      padding: 0.8rem 2rem 2.3rem;
      align-items: center;
      display: flex;
      flex-direction: column;

      .container-fluid {
        padding-right: 3rem;

        h5 {
          margin-right: 3rem;
          margin-left: 0;
        }

        .navbar-collapse {
          box-shadow: none;
          margin: 0;
          padding: 0;

          ul.navbar-nav {
            align-items: center;

            a {
              &.btn {
                font-size: 16px;
                margin-left: 1.25rem;
              }
            }
          }
        }
      }
    }
  }
`;
