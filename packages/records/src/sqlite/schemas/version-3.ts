export const AddShortNameToToolDefinition = `
    ALTER TABLE ToolDefinition
    ADD COLUMN shortName TEXT
`;

export const UpdateToolDefinitionShortName = `
    UPDATE ToolDefinition
    SET shortName = name
    WHERE shortName IS NULL
`;
