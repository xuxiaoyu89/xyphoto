force_init_db: 
	node ./migrations/force_init_db.js

apply_seeds:
	node ./seeds/index.js

test_db:
	node ./models/test.js
