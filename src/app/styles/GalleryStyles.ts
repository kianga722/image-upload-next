import styled from '@emotion/styled';

export const GalleryStyles = styled.section`
    margin: 0 auto;
    max-width: 1000px;

    h2 {
        text-align: center;
    }

    ul {
        margin-top: 30px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 3px;
    }

    .button-wrapper {
        margin: 50px 0;
        display: flex;
        justify-content: center;

        .load-more {
            padding: 5px 10px;

            border: 1px solid #000;
            border-radius: 4px;
            cursor: pointer;
        }
    }
  
`;
