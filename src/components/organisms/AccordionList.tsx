import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

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

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export const AccordionList = ({ contentList }: PropsAccordionList) => {
  const [expanded, setExpanded] = React.useState<number>(-1);

  const handleChange =
    (panelIdx: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panelIdx : -1);
    };

  return (
    <>
      {Object.entries(contentList).map((section, idx) => {
        const [title, content] = section;
        return (
          <Accordion expanded={expanded === idx} onChange={handleChange(idx)}>
            <AccordionSummary>
              <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {content.map((c, i) => (
                <Typography key={i}>- {c}</Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
};

type PropsAccordionList = {
  contentList: { [key: string]: string[] };
};

export type Content = { [key: string]: string[] };
