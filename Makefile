.PHONY: zip build

build:
	mkdir -p build
	cat ga.js game.js > build/game.js
	cp index.html ./*.png build/
	cp build/game.js build/game.min.js

zip: build
	closure-compiler --language_in=ECMASCRIPT5 --js build/game.js --js_output_file build/game.min.js
	cd build && zip -9 -r js13k-2018-offline.zip index.html game.min.js ./*.png && advzip -z2 js13k-2018-offline.zip
