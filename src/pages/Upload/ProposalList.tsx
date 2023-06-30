import React from "react";
import { List, ListItem, ListItemText, Checkbox } from "@mui/material";
import { appColor } from "../../constants/appColor";
import { Empty } from "../../components/atoms";

export const ProposalList = ({
  posts,
  onCheck,
  isSelectedProposalList,
}: {
  posts: { id: number; name: string }[];
  onCheck: ({ index, checked }: { index: number; checked: boolean }) => void;
  isSelectedProposalList: boolean[];
}) => {
  return (
    <List sx={{ width: "100%" }}>
      {posts.map((post, i) => (
        <>
          <ListItem
            key={post.id}
            sx={{
              borderBottom: `1px solid ${appColor.lightBlue1}`,
              width: "100%",
              backgroundColor: `${isSelectedProposalList[i] ? appColor.lightBlue1 : ""}`,
            }}
          >
            <ListItemText primary={post.name} />
            <Checkbox
              value={isSelectedProposalList[i]}
              onChange={(e) => {
                onCheck({ index: i, checked: e.target.checked });
              }}
              checked={isSelectedProposalList[i]}
            />
          </ListItem>
          <Empty height="1rem" />
        </>
      ))}
    </List>
  );
};
