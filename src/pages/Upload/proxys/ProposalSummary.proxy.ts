import { ProposalSummary } from "../../../apis/proposal";
import { ContentList } from "../../../components/organisms/AccordionList";

/**
 * @description 서버에서 받은 사업계획서 요약을 프론트에서 처리하기 위한 프록시로 바꿈
 */
export class ProposalSummaryProxy {
  public static toFE(beData: ProposalSummary): ContentList {
    return Object.entries(beData).map(([title, content]) => ({
      title,
      content,
    }));
  }

  public static toBE(feData: ContentList): ProposalSummary {
    return feData.reduce((acc, { title, content }) => {
      acc[title] = content;
      return acc;
    }, {} as ProposalSummary);
  }
}
