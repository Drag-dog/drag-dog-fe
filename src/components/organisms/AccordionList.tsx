import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ModeIcon from "@mui/icons-material/Mode";
import Button from "@mui/material/Button";
import ReplyIcon from "@mui/icons-material/Reply";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": { borderBottom: 0 },
  "&:before": { display: "none" },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionTextField = styled(TextField)(({ theme }) => ({ width: "100%" }));
const AccordionTypography = styled(Typography)(({ theme }) => ({ width: "100%", margin: "1rem" }));

export const AccordionList = ({ contentList, setContents }: PropsAccordionList) => {
  const [expanded, setExpanded] = React.useState<number>(-1);
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false);

  const handleChange =
    (panelIdx: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panelIdx : -1);
      setIsEditMode(false);
    };

  return (
    <>
      {Object.entries(contentList).map((section, idx) => {
        const [title, content] = section;
        return (
          <Accordion expanded={expanded === idx} onChange={handleChange(idx)}>
            <AccordionSummary>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>{`${idx + 1}. ${title}`}</Typography>
                {expanded === idx && (
                  <Button
                    color={isEditMode ? "primary" : "inherit"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditMode((prev) => !prev);
                    }}
                  >
                    {isEditMode ? (
                      <>
                        <Typography variant="caption">취소하기</Typography>
                        <ReplyIcon />
                      </>
                    ) : (
                      <>
                        <Typography variant="caption">수정하기</Typography>
                        <ModeIcon />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </AccordionSummary>
            {isEditMode
              ? content.map((c, i) => (
                  <AccordionTextField
                    key={i}
                    defaultValue={c}
                    // [Todo] onChange가 아니라 다른 클릭으로 바꾸기
                    onChange={(e) => {
                      setContents?.((prev) => ({
                        ...prev,
                        // [Todo] 잘 작동하는 지 확인하기
                        [title]: [...prev[title], e.target.value],
                      }));
                    }}
                  />
                ))
              : content.map((c, i) => <AccordionTypography>{`- ${c}`}</AccordionTypography>)}
          </Accordion>
        );
      })}
    </>
  );
};

type PropsAccordionList = {
  contentList: Content;
  setContents?: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
};

export type Content = { [key: string]: string[] };
