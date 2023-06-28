import styled from "@emotion/styled";

type Props = {
  height: `${number}px` | `${number}rem`;
};

/**
 * @param height
 */
export const Empty = styled.div<Props>((props) => ({
  height: props.height,
}));
