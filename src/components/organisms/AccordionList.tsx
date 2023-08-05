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
import { ProposalSummaryObj, ResPostGenerateProposalSummary } from "../../apis/proposal";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import {
  ProposalSummaryList,
  ProposalSummaryProxy,
} from "../../pages/Upload/proxys/ProposalSummary.proxy";

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
const handleClickToCopy = (text: string) => {
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Could not copy text: ", err);
    }
  );
};

export const AccordionTextField = styled(TextField)(({ theme }) => ({ width: "100%" }));
export const AccordionTypography = styled(Typography)(({ theme }) => ({
  width: "100%",
  margin: "1rem",
}));

export const AccordionList = ({
  contentList,
  proposalSummary,
  setProposalSummaryList,
  update,
  summaryId,
  selected,
  setSelected,
  setProposalSummary,
}: PropsAccordionList) => {
  /**
   * @description 수정 모드인 index를 저장. 수정 모드가 없을 경우, -1
   */
  const [isEditMode, setIsEditMode] = React.useState<number>(-1);
  const [_contents, _setProposalSummaryList] = React.useState<ProposalSummaryList>(
    !!contentList ? contentList : []
  );
  const [_proposalSummary, _setProposalSummary] = React.useState(
    !!proposalSummary ? proposalSummary : {}
  );
  const [expanded, setExpanded] = React.useState<boolean[]>([]);

  React.useLayoutEffect(() => {
    if (selected) {
      setExpanded(Array(selected.length || 0).fill(true));
    } else if (contentList) {
      setExpanded(Array(Object.keys(contentList || {}).length).fill(true));
    }
  }, [contentList, selected]);

  const handleChange =
    (panelIdx: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded((prevExpanded) => {
        const copy = [...prevExpanded];
        copy[panelIdx] = newExpanded;
        return copy;
      });
      setIsEditMode(-1);
    };

  return (
    <>
      {!!_contents &&
        _contents.map((section, idx) => {
          const { title, content } = section;
          return (
            <Accordion key={title} expanded={expanded[idx] || false} onChange={handleChange(idx)}>
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
                    {setProposalSummaryList && expanded[idx] && (
                      <Button
                        color={isEditMode === idx ? "primary" : "inherit"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditMode((prev) => (prev === idx ? -1 : idx));
                        }}
                      >
                        {isEditMode === idx ? (
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
                    {setProposalSummaryList && expanded[idx] && isEditMode === idx && (
                      <Button
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProposalSummaryList?.((prev) => {
                            const copy = [...prev];
                            copy[idx].title = title;
                            copy[idx].content = content;
                            return copy;
                          });
                          setIsEditMode(-1);
                          update?.({
                            summaryId: summaryId!,
                            summaries: ProposalSummaryProxy.toBE(_contents),
                          });
                        }}
                      >
                        <Typography variant="caption">저장하기</Typography>
                        <ModeIcon />
                      </Button>
                    )}
                  </div>
                </div>
              </AccordionSummary>
              {isEditMode === idx ? (
                <AccordionTextField
                  defaultValue={content.join("\n")}
                  multiline
                  rows={3}
                  onChange={(e) => {
                    _setProposalSummaryList((prev) => {
                      const copy = [...prev];
                      copy[idx].content = e.target.value.split("\n");
                      return copy;
                    });
                  }}
                />
              ) : (
                <div
                  onClick={() => handleClickToCopy(content.map((c) => `- ${c}\n`).join(""))}
                  style={{ cursor: "pointer" }}
                >
                  {content.map((c) => (
                    <AccordionTypography>{`- ${c}`}</AccordionTypography>
                  ))}
                </div>
              )}
            </Accordion>
          );
        })}
      {/* proposalSummary UI */}
      {!!_proposalSummary &&
        Object.entries(_proposalSummary).map((section, idx) => {
          const { characterLimit, question, noteWhenWriting, contentsToInclude } = section[1];
          return (
            <Accordion expanded={expanded[idx] || false} onChange={handleChange(idx)}>
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
                    {setProposalSummary && expanded[idx] && (
                      <Button
                        color={isEditMode === idx ? "primary" : "inherit"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditMode(idx);
                        }}
                      >
                        {isEditMode === idx ? (
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
                    {setProposalSummary && expanded[idx] && isEditMode === idx && (
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
                          setIsEditMode(idx);
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
                      {isEditMode === idx ? (
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
                      {isEditMode === idx ? (
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
                      {isEditMode === idx ? (
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
  contentList?: ProposalSummaryList;
  proposalSummary?: ResPostGenerateProposalSummary;
  setProposalSummaryList?: React.Dispatch<React.SetStateAction<ProposalSummaryList>>;
  update?: UseMutateFunction<
    any,
    unknown,
    { summaryId: string; summaries: ProposalSummaryObj },
    unknown
  >;
  summaryId?: string;
  // checkbox용
  selected?: boolean[];
  setSelected?: React.Dispatch<React.SetStateAction<boolean[]>>;
  setProposalSummary?: React.Dispatch<React.SetStateAction<ResPostGenerateProposalSummary>>;
};
