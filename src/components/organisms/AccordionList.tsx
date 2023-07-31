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
import { ResPostGenerateProposalSummary } from "../../apis/proposal";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";

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
  proposalSummary,
  setContents,
  update,
  summaryId,
  selected,
  setSelected,
  setProposalSummary,
}: PropsAccordionList) => {
  const [expanded, setExpanded] = React.useState<number>(-1);
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
  const [_contents, _setContents] = React.useState<Content>(!!contentList ? contentList : {});
  const [_proposalSummary, _setProposalSummary] = React.useState(
    !!proposalSummary ? proposalSummary : {}
  );

  const handleChange =
    (panelIdx: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panelIdx : -1);
      setIsEditMode(false);
    };

  return (
    <>
      {!!_contents &&
        Object.entries(_contents).map((section, idx) => {
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
      {/* proposalSummary UI */}
      {!!_proposalSummary &&
        Object.entries(_proposalSummary).map((section, idx) => {
          const { characterLimit, question, noteWhenWriting, contentsToInclude } = section[1];
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
                  <Typography
                    sx={{
                      color: selected?.[idx] ? "text.primary" : "Gray",
                      textDecoration: selected?.[idx] ? "none" : "line-through",
                    }}
                  >{`${idx + 1}. ${question}`}</Typography>
                  <div>
                    {setProposalSummary && expanded === idx && (
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
                    {setProposalSummary && expanded === idx && isEditMode && (
                      <Button
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(_proposalSummary);
                          // [Todo] 변경 사항 수정 후 전달하는 로직 구현 필요
                          setProposalSummary?.((prev) => ({
                            ...prev,
                            [question as string]: { ..._proposalSummary },
                          }));
                          setIsEditMode(false);
                        }}
                      >
                        <Typography variant="caption">저장하기</Typography>
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
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableBody>
                    <TableRow>
                      <TableCell>작성시 주의사항</TableCell>
                      {isEditMode ? (
                        <TableCell align="right">
                          <AccordionTextField
                            onChange={(e) => {
                              _setProposalSummary((prev) => ({
                                ...prev,
                                [question as string]: {
                                  ...prev[question as any],
                                  noteWhenWriting: e.target.value,
                                },
                              }));
                            }}
                            defaultValue={noteWhenWriting}
                            multiline
                            rows={1}
                          />
                        </TableCell>
                      ) : (
                        <TableCell align="right">{noteWhenWriting}</TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell>포함되어야 할 내용</TableCell>
                      {isEditMode ? (
                        <TableCell align="right">
                          <AccordionTextField
                            onChange={(e) => {
                              console.log(question);
                              _setProposalSummary((prev) => ({
                                ...prev,
                                [question as string]: {
                                  ...prev[question as any],
                                  contentsToInclude: e.target.value,
                                },
                              }));
                            }}
                            defaultValue={contentsToInclude}
                            multiline
                            rows={1}
                          />
                        </TableCell>
                      ) : (
                        <TableCell align="right">{contentsToInclude}</TableCell>
                      )}
                    </TableRow>
                    <TableRow>
                      <TableCell>글자 수 제한</TableCell>
                      {isEditMode ? (
                        <TableCell align="right">
                          <AccordionTextField
                            type="number"
                            onChange={(e) => {
                              _setProposalSummary((prev) => ({
                                ...prev,
                                [question as string]: {
                                  ...prev[question as any],
                                  characterLimit: e.target.value,
                                },
                              }));
                            }}
                            defaultValue={characterLimit}
                            multiline
                            rows={1}
                          />
                        </TableCell>
                      ) : (
                        <TableCell align="right">{characterLimit}</TableCell>
                      )}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Accordion>
          );
        })}
    </>
  );
};

type PropsAccordionList = {
  contentList?: Content;
  proposalSummary?: ResPostGenerateProposalSummary;
  setContents?: React.Dispatch<React.SetStateAction<Content>>;
  update?: UseMutateFunction<any, unknown, { summaryId: string; summaries: object }, unknown>;
  summaryId?: string;
  // checkbox용
  selected?: boolean[];
  setSelected?: React.Dispatch<React.SetStateAction<boolean[]>>;
  setProposalSummary?: React.Dispatch<React.SetStateAction<ResPostGenerateProposalSummary>>;
};

export type Content = { [key: string]: string[] };
