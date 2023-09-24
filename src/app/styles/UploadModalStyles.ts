import styled from '@emotion/styled';

export const UploadModalStyles = styled.article`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;

    background: rgba(0, 0, 0, .8);

    dialog {
        display: block;
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 70vw;
        max-width: 600px;

        background: #FFF;
        border: 0;
        border-radius: 4px;

        h2 {
            margin-top: 20px;

            font-size: 24px;
            text-align: center;
        }

        .loader-wrapper {
            position: absolute;
            top: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            
            background: rgba(0, 0, 0, .9);
            border-radius: 4px;

            button {
                padding: 10px 20px;

                border: 1px solid #FFF;
                border-radius: 4px;
                color: #FFF;
                font-size: 18px;
                cursor: pointer;
            }
        }

        p {
            margin-top: 20px;

            font-size: 20px;

            &.error {
                color: red;
                text-align: center;
            }

            &.success {
                padding: 10px;

                color: #35ec35;
                text-align: center;
            }
        }

        form {
            margin: 20px;
            display: flex;
            flex-direction: column;

            picture {
                margin-top: 10px;
                display: block;

                img {
                    max-width: 100%;
                    max-height: 300px;
                    object-fit: contain;
                }
            }

            button {
                margin: 20px auto 0;
                padding: 10px 20px;

                border: 1px solid #000;
                border-radius: 4px;
                color: #000;
                font-size: 18px;
                cursor: pointer;

                &:disabled {
                    opacity: .3;
                }
            }
        }
    }
   
`;
