################################################################################
#                                                                              #
#     This file is part of Kokopu-React, a JavaScript chess library.           #
#     Copyright (C) 2021  Yoann Le Montagner <yo35 -at- melix.net>             #
#                                                                              #
#     This program is free software: you can redistribute it and/or            #
#     modify it under the terms of the GNU Lesser General Public License       #
#     as published by the Free Software Foundation, either version 3 of        #
#     the License, or (at your option) any later version.                      #
#                                                                              #
#     This program is distributed in the hope that it will be useful,          #
#     but WITHOUT ANY WARRANTY; without even the implied warranty of           #
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the             #
#     GNU Lesser General Public License for more details.                      #
#                                                                              #
#     You should have received a copy of the GNU Lesser General                #
#     Public License along with this program. If not, see                      #
#     <http://www.gnu.org/licenses/>.                                          #
#                                                                              #
################################################################################


# Source files and folders
PACKAGE_JSON_FILE = package.json
SRC_DIR           = src
SRC_FILES         = $(shell find src -type f)
SRC_DOC_FILES     = $(shell find doc_src -type f)
DOC_CONFIG_FILE   = scripts/styleguide.config.js

# Generated files and folders
BUILD_DIR         = build
DIST_DIR          = dist
LIB_DIR           = $(DIST_DIR)/lib
DOCUMENTATION_DIR = $(DIST_DIR)/docs

# Commands
ECHO = echo


# Node's stuff & cleaning
# -----------------------

.PHONY: clean

all: $(LIB_DIR) $(DOCUMENTATION_DIR)

clean:
	@rm -rf npm-debug.log $(BUILD_DIR) $(DIST_DIR)


# Build targets
# -------------

$(LIB_DIR): $(SRC_FILES) $(PACKAGE_JSON_FILE)
	@$(ECHO) "Babelify files in $(SRC_DIR)..."
	@npx babel --delete-dir-on-start --copy-files -d $@ $(SRC_DIR)

$(DOCUMENTATION_DIR): $(DOC_CONFIG_FILE) $(SRC_FILES) $(SRC_DOC_FILES) $(PACKAGE_JSON_FILE)
	@$(ECHO) "Generate documentation..."
	@mkdir -p $(DIST_DIR)
	@rm -rf $@
	@npx styleguidist build --config $<
