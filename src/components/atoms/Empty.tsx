import styled from "@emotion/styled";

type Props = {
  height?: `${number}px` | `${number}rem`;
  width?: `${number}px` | `${number}rem`;
};

/**
 * @param height
 * @param width
 */
export const Empty = styled.div<Props>((props) => ({
  height: props.height,
  width: props.width,
}));
