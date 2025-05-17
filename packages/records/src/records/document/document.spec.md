# Document Tests
Tests are in ./document.test.ts

Useful utilities:
 - Create .md files in a sub-folder called `test-artifacts` and compare serialized versions of the files to the expected versions in the `test-artifacts` folder.

### Document Table 
 - we can get a document referance by id after we create a document
 - we can create a document by name and type
 - documents initially have no cells


### Document Record
 - we can get the last version of a document
   - if the document has no last version, getLast returns null
   - if the document has a last version, getLast returns the last version reference
 - we can get the next version of a document
   - if the document has no next version, getNext returns null
   - if the document has a next version, getNext returns the next version reference
 - we can replace a cell in a document
   - if the cell does not exist, replaceCell will throw an error
   - if the cell exists, replaceCell will replace the cell with the new data
 - we can add a cell at the start of a document
   - if the document has no cells, addCellAtStart will add the cell at the start of the document
   - if the document has cells, addCellAtStart will add the cell at the start of the document, shifting the existing cells down
 - we can add a cell at the end of a document
   - if the document has no cells, addCellAtEnd will add the cell at the end of the document
   - if the document has cells, addCellAtEnd will add the cell at the end of the document, shifting the existing cells up
 - we can add a cell after a given cell
   - if the cell does not exist, addCellAfter will throw an error
   - if the cell exists, addCellAfter will add the cell after the given cell, shifting the existing cells up
 - we can add a cell before a given cell
   - if the cell does not exist, addCellBefore will throw an error
   - if the cell exists, addCellBefore will add the cell before the given cell, shifting the existing cells down
 - we can delete a cell in a document
   - if the cell does not exist, deleteCell will throw an error
   - if the cell exists, deleteCell will delete the cell
 - we can save a version of a document
   - when we save a version, the document will have a new version id but the new version will have the same name and type as the previous version
   - the new version will have a previous version id that is the id of the previous version
   - the previous version will have a next version id that is the id of the new version
   - if wer call save version on a document with a next version already, saveVersion will throw an error