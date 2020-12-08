import styled from "styled-components";

export const Wrapper = styled.div`
  .login-card {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    background-color: #f1f4f5;
    background-position: center;
    padding: 30px 0;

    .logo {
      display: block;
      margin-bottom: 30px;
      text-align: center;
    }

    .login-main {
      width: 450px;
      padding: 40px;
      border-radius: 4px;
      box-shadow: 0 1px 1px 0 rgba(32, 33, 35, 0.05),
        0 2px 1px -1px rgba(32, 33, 35, 0.08),
        0 1px 3px 0 rgba(32, 33, 35, 0.19);

      margin: 0 auto;
      background-color: #ffffff;

      .theme-form {
        h4 {
          margin-bottom: 5px;
        }

        label {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .nav-link {
          font-size: 0.875rem;
          padding: 0;
        }

        p,
        input {
          font-size: 0.875rem;
        }

        .or {
          position: relative;

          &:before {
            content: "";
            position: absolute;
            width: 65%;
            height: 2px;
            background-color: #f3f3ff;
            top: 9px;
            z-index: 0;
            right: 0;
          }
        }

        .form-group {
          margin-bottom: 10px;
          position: relative;
        }

        .btn.btn-primary {
          font-size: 0.875rem;
        }
      }
    }
  }

  @media only screen and (max-width: 991.98px) {
    .login-card {
      .login-main {
        &.login-tab {
          margin-top: 90px;
          .nav-tabs {
            flex-direction: unset !important;
            left: 0;
            top: -43px;
            .nav-item {
              .nav-link {
                span {
                  padding: 8px;
                  right: -16px;
                  top: -30px;
                  font-size: 13px;
                }
                &:after {
                  top: -1px;
                  left: 0;
                  right: 0;
                  margin: 0 auto;
                }
                &:hover {
                  span {
                    right: 0;
                    top: -33px;
                  }
                  &:after {
                    top: -1px;
                    transform: scale(1) rotate(90deg);
                  }
                }
              }
            }
          }
          .border-tab {
            &.nav-tabs {
              .nav-item {
                .nav-link {
                  border-bottom: 2px solid transparent;
                  border-right: none;
                  border-top-right-radius: 0;
                  &.active,
                  &.show,
                  &:focus {
                    border-right: none;
                    border-bottom: 2px solid var(--theme-deafult);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
