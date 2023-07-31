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
import { UseMutateFunction } from "react-query";
import Checkbox from "@mui/material/Checkbox";

export const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": { borderBottom: 0 },
  "&:before": { display: "none" },
}));

export const AccordionSummary = styled((props: AccordionSummaryProps) => (
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

export const AccordionTextField = styled(TextField)(({ theme }) => ({ width: "100%" }));
export const AccordionTypography = styled(Typography)(({ theme }) => ({
  width: "100%",
  margin: "1rem",
}));

export const AccordionList = ({
  contentList,
  setContents,
  update,
  summaryId,
  selected,
  setSelected,
}: PropsAccordionList) => {
  const [expanded, setExpanded] = React.useState<number>(-1);
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
  const [_contents, _setContents] = React.useState<Content>(contentList);

  const handleChange =
    (panelIdx: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panelIdx : -1);
      setIsEditMode(false);
    };

  return (
    <>
      {Object.entries(_contents).map((section, idx) => {
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
                <div>
                  {setContents && expanded === idx && (
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
                  {setContents && expanded === idx && isEditMode && (
                    <Button
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setContents?.((prev) => ({ ...prev, [title]: _contents.title }));
                        setIsEditMode(false);
                        update?.({ summaryId: summaryId!, summaries: _contents });
                      }}
                    >
                      <Typography variant="caption">추가하기</Typography>
                      <ModeIcon />
                    </Button>
                  )}
                  {setSelected && selected && (
                    <Checkbox
                      checked={selected[idx]}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelected((prev) => {
                          const temp = [...prev];
                          temp[idx] = e.target.checked;
                          return temp;
                        });
                      }}
                    />
                  )}
                </div>
              </div>
            </AccordionSummary>
            {isEditMode ? (
              <AccordionTextField
                defaultValue={content.join("\n")}
                multiline
                rows={3}
                onChange={(e) => {
                  _setContents((prev) => ({ ...prev, [title]: e.target.value.split("\n") }));
                }}
              />
            ) : (
              content.map((c) => <AccordionTypography>{`- ${c}`}</AccordionTypography>)
            )}
          </Accordion>
        );
      })}
    </>
  );
};

type PropsAccordionList = {
  contentList: Content;
  setContents?: React.Dispatch<React.SetStateAction<Content>>;
  update?: UseMutateFunction<any, unknown, { summaryId: string; summaries: object }, unknown>;
  summaryId?: string;
  // checkbox용
  selected?: boolean[];
  setSelected?: React.Dispatch<React.SetStateAction<boolean[]>>;
};

export type Content = { [key: string]: string[] };
