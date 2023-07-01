import React from "react";
import { List, ListItem, Button, Checkbox, Typography, IconButton } from "@mui/material";
import { appColor } from "../../constants/appColor";
import { Empty } from "../../components/atoms";
import DeleteIcon from "@mui/icons-material/Delete";

export const ProposalList = ({
  posts,
  onCheck,
  onDelete,
  isSelectedProposalList,
}: {
  posts: { id: number; name: string }[];
  onCheck: ({ index, checked }: { index: number; checked: boolean }) => void;
  onDelete: (index: number) => void;
  isSelectedProposalList: boolean[];
}) => {
  return (
    <List sx={{ width: "100%" }}>
      {posts.map((post, i) => (
        <>
          <Button
            sx={{
              width: "100%",
              borderBottom: `1px solid ${appColor.lightBlue1}`,
              backgroundColor: `${isSelectedProposalList[i] ? appColor.lightBlue1 : ""}`,
              "&:hover": {
                backgroundColor: `${appColor.lightBlue1}`,
              },
            }}
            onClick={() => {
              // console.log("??");
            }}
          >
            <ListItem
              key={post.id}
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  width: "70%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "baseline",
                }}
              >
                {post.name.split("-")[1]}
              </Typography>
              <div
                style={{
                  display: "flex",
                }}
              >
                <Checkbox
                  value={isSelectedProposalList[i]}
                  onChange={(e) => {
                    onCheck({ index: i, checked: e.target.checked });
                  }}
                  checked={isSelectedProposalList[i]}
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(Number(post.id));
                  }}
                >
                  <DeleteIcon color={isSelectedProposalList[i] ? "primary" : undefined} />
                </IconButton>
              </div>
            </ListItem>
          </Button>
          <Empty height="1rem" />
        </>
      ))}
    </List>
  );
};
