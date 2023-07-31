import React from "react";
import { Typography } from "@mui/material";
import { PageLayout } from "../../components/layouts/PageLayout";
import { useAtomValue } from "jotai";
import { questionAtom, resProposalsAtom } from "../../store/atoms";
import { Empty } from "../../components/atoms";
import { appColor } from "../../constants/appColor";

export const Success = () => {
  const resProposal = useAtomValue(resProposalsAtom);
  const question = useAtomValue(questionAtom);
  console.log(resProposal);
  return (
    <PageLayout>
      <PageLayout.Title />
      <PageLayout.SubTitle>
        <Typography variant="h1">사업계획서 작성 완료!</Typography>
        <Typography variant="caption">
          (새롭게 작성하기 전까지는 이 페이지에서 내용을 확인할 수 있습니다.)
        </Typography>
      </PageLayout.SubTitle>
      <PageLayout.Body>
        {/* [Todo] 사업계획서처럼 꾸며주기 */}
        {resProposal.length === 0 || question.length === 0 ? (
          <Typography variant="h4">잠시만 기다려주세요!</Typography>
        ) : (
          <div style={{ border: `1px solid ${appColor.grey2}`, padding: "4rem 2rem" }}>
            {question.map((q, idx) => (
              <>
                <Typography key={idx} variant="h4">
                  {idx + 1}. {q}
                </Typography>
                <Empty height="1rem" />
                <div style={{ padding: "1rem 1rem" }}>
                  {typeof resProposal[idx] === "string" ? (
                    (resProposal[idx] as string)
                      .replace(/\n\n/g, "\n")
                      .split("\n")
                      .map((line) => (
                        <>
                          <Typography key={idx}>- {line}</Typography>
                          <Empty height="1rem" />
                        </>
                      ))
                  ) : (
                    <>
                      {(resProposal[idx] as { additional?: string[]; answer: string }[]).map(
                        (val) => (
                          <>
                            <Typography variant="h6">■ {val.answer}</Typography>
                            {val.additional?.map((x) => (
                              <>
                                <Empty height="1rem" />
                                <Typography key={idx}>- {x}</Typography>
                              </>
                            ))}
                            <Empty height="1rem" />
                          </>
                        )
                      )}
                    </>
                  )}
                </div>
                <Empty height="2rem" />
              </>
            ))}
          </div>
        )}
      </PageLayout.Body>
    </PageLayout>
  );
};
