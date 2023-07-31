import React, { useState, ChangeEvent } from "react";
import { List, ListItem, TextField, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

interface InitialDataProps {
    question?:string;
    characterLimit?: string;
    contentsToInclude?: string[];
    noteWhenWriting?: string[];
}

interface BusinessItemBoxProps {
    initialData: InitialDataProps;
}

const BusinessItemBox: React.FC<BusinessItemBoxProps> = ({ initialData }) => {
    const [data, setData] = useState<InitialDataProps>(initialData);

    const updateList = (field: 'contentsToInclude' | 'noteWhenWriting', index: number, value: string) => {
        const updatedList = [...data[field]||[]];
        updatedList[index] = value;
        setData({ ...data, [field]: updatedList });
    };

    const handleChange = (field: 'characterLimit' | 'contentsToInclude' | 'noteWhenWriting', index: number) => (event: ChangeEvent<HTMLInputElement>) => {
        if (field === 'characterLimit') {
            setData({ ...data, characterLimit: event.target.value });
        } else {
            updateList(field, index, event.target.value);
        }
    };


    const handleAddItem = (field: 'contentsToInclude' | 'noteWhenWriting') => () => {
        const updatedList = [...data[field]||[], ''];
        setData({ ...data, [field]: updatedList });
    };

    const handleRemoveItem = (field: 'contentsToInclude' | 'noteWhenWriting', index: number) => () => {
        const updatedList = data[field]||[].filter((item, i) => i !== index);
        setData({ ...data, [field]: updatedList });
    };


    return (
        <div>
            <Accordion>
                <AccordionSummary>
                    {data.question}
                </AccordionSummary>
                <AccordionDetails>
                    <TextField label="Character Limit" value={data.characterLimit} onChange={handleChange('characterLimit', 0)} />
                    <List>
                        {data.contentsToInclude?.map((item, index) => (
                            <ListItem key={index}>
                                <TextField label="Content to Include" value={item} onChange={handleChange('contentsToInclude', index)} />
                                <Button onClick={handleRemoveItem('contentsToInclude', index)}>Remove</Button>
                            </ListItem>
                        ))}
                        <Button onClick={handleAddItem('contentsToInclude')}>Add Content</Button>
                    </List>
                    <List>
                        {data.noteWhenWriting?.map((item, index) => (
                            <ListItem key={index}>
                                <TextField label="Note when Writing" value={item} onChange={handleChange('noteWhenWriting', index)} />
                                <Button onClick={handleRemoveItem('noteWhenWriting', index)}>Remove</Button>
                            </ListItem>
                        ))}
                        <Button onClick={handleAddItem('noteWhenWriting')}>Add Note</Button>
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default BusinessItemBox;
