import { beforeEach, describe, expect, test } from 'vitest';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';
import { setupDocumentWithCells, setupEmptyDocument } from './document.mocking';
import type { DocumentCellData, NewCellType } from './document.type';

let client: SQliteClient;

beforeEach(async () => {
    client = await buildCleanDB();
});

describe('Document Table', () => {
    test('we can get a document referance by id after we create a document', async () => {
        const { client, documentRecord } = await setupEmptyDocument();
        const ref = client.tables.document.ref(documentRecord.id);
        const retrievedDocument = await ref.get();
        expect(retrievedDocument).toBeDefined();
        expect(retrievedDocument.id).toEqual(documentRecord.id);
    });

    test('we can create a document by name and type', async () => {
        const document = await client.tables.document.create({ name: 'My Doc', type: 'text/plain', documentContentData: [] });
        expect(document).toBeDefined();
        expect(document.name).toBe('My Doc');
        expect(document.type).toBe('text/plain');
    });

    test('documents initially have no cells', async () => {
        const { documentRecord } = await setupEmptyDocument();
        expect(documentRecord.documentContentData).toEqual([]);
    });
});

describe('Document Record', () => {
    describe('we can get the last version of a document', () => {
        test('if the document has no last version, getLast returns null', async () => {
            const { documentRef } = await setupEmptyDocument();
            const lastVersion = await documentRef.getLast();
            expect(lastVersion).toBeNull();
        });

        test('if the document has a last version, getLast returns the last version reference', async () => {
            const { documentRef, documentRecord } = await setupEmptyDocument();
            const newVersionRef = await documentRef.saveVersion();
            const lastVersion = await newVersionRef.getLast();
            expect(lastVersion).toBeDefined();
            expect(lastVersion?.id).toEqual(documentRecord.id);
        });
    });

    describe('we can get the next version of a document', () => {
        test('if the document has no next version, getNext returns null', async () => {
            const { documentRef } = await setupEmptyDocument();
            const nextVersion = await documentRef.getNext();
            expect(nextVersion).toBeNull();
        });

        test('if the document has a next version, getNext returns the next version reference', async () => {
            const { documentRef } = await setupEmptyDocument();
            const newVersionRef = await documentRef.saveVersion();
            const nextVersion = await documentRef.getNext();
            expect(nextVersion).toBeDefined();
            expect(nextVersion?.id).toEqual(newVersionRef.id);
        });
    });

    describe('we can replace a cell in a document', () => {
        test('if the cell does not exist, replaceCell will throw an error', async () => {
            const { documentRef } = await setupEmptyDocument();
            const newCell: NewCellType = { type: 'text', content: 'new content', authorId: 'user1' };
            await expect(documentRef.replaceCell('non-existent-id', newCell)).rejects.toThrow();
        });

        test('if the cell exists, replaceCell will replace the cell with the new data', async () => {
            const initialCell: DocumentCellData = {
                id: 'cell1',
                type: 'text',
                content: 'old content',
                authorId: 'user1',
                editedAt: Date.now(),
            };
            const { documentRef } = await setupDocumentWithCells([initialCell]);
            const newCellData: NewCellType = { type: 'header', content: 'new header', authorId: 'user2' };
            await documentRef.replaceCell('cell1', newCellData);
            const updatedDocument = await documentRef.get();
            const replacedCell = updatedDocument.documentContentData.find(c => c.id === 'cell1');
            expect(replacedCell).toBeDefined();
            expect(replacedCell?.type).toBe('header');
            expect(replacedCell?.content).toBe('new header');
            expect(replacedCell?.authorId).toBe('user2');
        });
    });

    describe('we can add a cell at the start of a document', () => {
        test('if the document has no cells, addCellAtStart will add the cell at the start of the document', async () => {
            const { documentRef } = await setupEmptyDocument();
            const newCell: NewCellType = { type: 'text', content: 'first cell', authorId: 'user1' };
            await documentRef.addCellAtStart(newCell);
            const updatedDocument = await documentRef.get();
            expect(updatedDocument.documentContentData.length).toBe(1);
            expect(updatedDocument.documentContentData[0].type).toBe('text');
            expect(updatedDocument.documentContentData[0].content).toBe('first cell');
        });

        test('if the document has cells, addCellAtStart will add the cell at the start of the document, shifting the existing cells down', async () => {
            const existingCell: DocumentCellData = {
                id: 'cell1',
                type: 'text',
                content: 'existing',
                authorId: 'user1',
                editedAt: Date.now(),
            };
            const { documentRef } = await setupDocumentWithCells([existingCell]);
            const newCell: NewCellType = { type: 'header', content: 'new first cell', authorId: 'user2' };
            await documentRef.addCellAtStart(newCell);
            const updatedDocument = await documentRef.get();
            expect(updatedDocument.documentContentData.length).toBe(2);
            expect(updatedDocument.documentContentData[0].type).toBe('header');
            expect(updatedDocument.documentContentData[0].content).toBe('new first cell');
            expect(updatedDocument.documentContentData[1].id).toBe('cell1');
        });
    });

    describe('we can add a cell at the end of a document', () => {
        test('if the document has no cells, addCellAtEnd will add the cell at the end of the document', async () => {
            const { documentRef } = await setupEmptyDocument();
            const newCell: NewCellType = { type: 'text', content: 'first cell', authorId: 'user1' };
            await documentRef.addCellAtEnd(newCell);
            const updatedDocument = await documentRef.get();
            expect(updatedDocument.documentContentData.length).toBe(1);
            expect(updatedDocument.documentContentData[0].type).toBe('text');
            expect(updatedDocument.documentContentData[0].content).toBe('first cell');
        });

        test('if the document has cells, addCellAtEnd will add the cell at the end of the document, shifting the existing cells up', async () => {
            const existingCell: DocumentCellData = {
                id: 'cell1',
                type: 'text',
                content: 'existing',
                authorId: 'user1',
                editedAt: Date.now(),
            };
            const { documentRef } = await setupDocumentWithCells([existingCell]);
            const newCell: NewCellType = { type: 'header', content: 'new last cell', authorId: 'user2' };
            await documentRef.addCellAtEnd(newCell);
            const updatedDocument = await documentRef.get();
            expect(updatedDocument.documentContentData.length).toBe(2);
            expect(updatedDocument.documentContentData[1].type).toBe('header');
            expect(updatedDocument.documentContentData[1].content).toBe('new last cell');
            expect(updatedDocument.documentContentData[0].id).toBe('cell1');
        });
    });

    describe('we can add a cell after a given cell', () => {
        test('if the cell does not exist, addCellAfter will throw an error', async () => {
            const { documentRef } = await setupEmptyDocument();
            const newCell: NewCellType = { type: 'text', content: 'new cell', authorId: 'user1' };
            await expect(documentRef.addCellAfter('non-existent-id', newCell)).rejects.toThrow();
        });

        test('if the cell exists, addCellAfter will add the cell after the given cell, shifting the existing cells up', async () => {
            const cell1: DocumentCellData = { id: 'cell1', type: 'text', content: 'cell one', authorId: 'user1', editedAt: Date.now() };
            const cell2: DocumentCellData = { id: 'cell2', type: 'text', content: 'cell two', authorId: 'user1', editedAt: Date.now() };
            const { documentRef } = await setupDocumentWithCells([cell1, cell2]);
            const newCell: NewCellType = { type: 'header', content: 'inserted cell', authorId: 'user2' };
            await documentRef.addCellAfter('cell1', newCell);
            const updatedDocument = await documentRef.get();
            expect(updatedDocument.documentContentData.length).toBe(3);
            expect(updatedDocument.documentContentData[0].id).toBe('cell1');
            expect(updatedDocument.documentContentData[1].type).toBe('header');
            expect(updatedDocument.documentContentData[1].content).toBe('inserted cell');
            expect(updatedDocument.documentContentData[2].id).toBe('cell2');
        });
    });

    describe('we can add a cell before a given cell', () => {
        test('if the cell does not exist, addCellBefore will throw an error', async () => {
            const { documentRef } = await setupEmptyDocument();
            const newCell: NewCellType = { type: 'text', content: 'new cell', authorId: 'user1' };
            await expect(documentRef.addCellBefore('non-existent-id', newCell)).rejects.toThrow();
        });

        test('if the cell exists, addCellBefore will add the cell before the given cell, shifting the existing cells down', async () => {
            const cell1: DocumentCellData = { id: 'cell1', type: 'text', content: 'cell one', authorId: 'user1', editedAt: Date.now() };
            const cell2: DocumentCellData = { id: 'cell2', type: 'text', content: 'cell two', authorId: 'user1', editedAt: Date.now() };
            const { documentRef } = await setupDocumentWithCells([cell1, cell2]);
            const newCell: NewCellType = { type: 'header', content: 'inserted cell', authorId: 'user2' };
            await documentRef.addCellBefore('cell2', newCell);
            const updatedDocument = await documentRef.get();
            expect(updatedDocument.documentContentData.length).toBe(3);
            expect(updatedDocument.documentContentData[0].id).toBe('cell1');
            expect(updatedDocument.documentContentData[1].type).toBe('header');
            expect(updatedDocument.documentContentData[1].content).toBe('inserted cell');
            expect(updatedDocument.documentContentData[2].id).toBe('cell2');
        });
    });

    describe('we can delete a cell in a document', () => {
        test('if the cell does not exist, deleteCell will throw an error', async () => {
            const { documentRef } = await setupEmptyDocument();
            await expect(documentRef.deleteCell('non-existent-id')).rejects.toThrow();
        });

        test('if the cell exists, deleteCell will delete the cell', async () => {
            const cell1: DocumentCellData = { id: 'cell1', type: 'text', content: 'cell one', authorId: 'user1', editedAt: Date.now() };
            const cell2: DocumentCellData = { id: 'cell2', type: 'text', content: 'cell two', authorId: 'user1', editedAt: Date.now() };
            const { documentRef } = await setupDocumentWithCells([cell1, cell2]);
            await documentRef.deleteCell('cell1');
            const updatedDocument = await documentRef.get();
            expect(updatedDocument.documentContentData.length).toBe(1);
            expect(updatedDocument.documentContentData[0].id).toBe('cell2');
        });
    });

    describe('we can save a version of a document', () => {
        test('when we save a version, the document will have a new version id but the new version will have the same name and type as the previous version', async () => {
            const { documentRef, documentRecord } = await setupEmptyDocument();
            const newVersionRef = await documentRef.saveVersion();
            const newVersionRecord = await newVersionRef.get();
            expect(newVersionRecord.id).not.toEqual(documentRecord.id);
            expect(newVersionRecord.name).toEqual(documentRecord.name);
            expect(newVersionRecord.type).toEqual(documentRecord.type);
        });

        test('the new version will have a previous version id that is the id of the previous version', async () => {
            const { documentRef, documentRecord } = await setupEmptyDocument();
            const newVersionRef = await documentRef.saveVersion();
            const newVersionRecord = await newVersionRef.get();
            expect(newVersionRecord.lastVersionId).toEqual(documentRecord.id);
        });

        test('the previous version will have a next version id that is the id of the new version', async () => {
            const { documentRef } = await setupEmptyDocument();
            const newVersionRef = await documentRef.saveVersion();
            const originalDocument = await documentRef.get();
            expect(originalDocument.nextVersionId).toEqual(newVersionRef.id);
        });

        test('if wer call save version on a document with a next version already, saveVersion will throw an error', async () => {
            const { documentRef } = await setupEmptyDocument();
            await documentRef.saveVersion(); // Save first version
            await expect(documentRef.saveVersion()).rejects.toThrow(); // Try to save again from original ref
        });
    });
});
