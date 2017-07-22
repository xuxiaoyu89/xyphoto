create-db:
	node ./migrations/add-file-table.js

test-put:
	node ./dbtest/crud.js