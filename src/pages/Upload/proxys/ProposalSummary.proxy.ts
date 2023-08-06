import { ProposalSummaryObj } from "../../../apis/proposal";

/**
 * @description 서버에서 받은 사업계획서 요약을 프론트에서 처리하기 위한 프록시로 바꿈
 * @extra 추가로 content가 빈 배열인 경우 제외시킴
 */
export class ProposalSummaryProxy {
  public static toFE(beData: ProposalSummaryObj): ProposalSummaryList {
    return Object.entries(beData)
      .map(([title, content]) => ({
        title,
        content,
      }))
      .filter(({ content }) => content.length !== 0);
  }

  public static toBE(feData: ProposalSummaryList): ProposalSummaryObj {
    return feData.reduce((acc, { title, content }) => {
      acc[title] = content;
      return acc;
    }, {} as ProposalSummaryObj);
  }
}

export type ProposalSummaryList = { title: string; content: string[] }[];
