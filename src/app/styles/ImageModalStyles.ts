import styled from '@emotion/styled';

export const ImageModalStyles = styled.article`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;

    background: rgba(0, 0, 0, .8);

    dialog {
        display: block;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 70vw;

        background: transparent;
        border: 0;

        button {
            color: #FFF;
            font-size: 60px;
            cursor: pointer;
        }

        picture {
            margin-top: 30px;
            display: block;

            img {
                width: 100%;
                height: 100%;
                max-height: 72vh;
                object-fit: contain;
            }
        }
    }
   
`;
