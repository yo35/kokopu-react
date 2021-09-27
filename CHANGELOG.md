ChangeLog
=========

1.3.1 (September 27, 2021)
--------------------------
* Fix missing export for `ErrorBox`.

1.3.0 (September 26, 2021)
--------------------------
* Expose component `ErrorBox`.
* Minor fixes in documentation.

1.2.0 (September 13, 2021)
--------------------------
* Fix ambiguous castling move issue at Chess960.

1.1.0 (August 15, 2021)
-----------------------
* Provide interaction mode `playMoves`.
* Add code coverage.

1.0.2 (August 10, 2021)
-----------------------
* No need for ReactDOM in dependencies (dev-dependencies only).

1.0.1 (July 30, 2021)
---------------------
* Wrong config in `package.json`.

1.0.0 (July 30, 2021)
---------------------
* Implement graphic tests (using Selenium).
* Provide documentation.
* Fewer exported symbols: `adaptSquareSize(..)`, `colorsets` and `piecesets` are now defined as static members of `Chessboard`.

0.99.11 (June 6, 2021)
----------------------
* Proper handling of small-screen limits in `adaptSquareSize(..)`.

0.99.10 (May 30, 2021)
----------------------
* Support limits for square-size and coordinate-visible on small-screen devices.

0.99.9 (May 24, 2021)
---------------------
* Utility functions to parse/flatten marker sets.
* SVG icons for markers.

0.99.8 (May 19, 2021)
---------------------
* Simplify arrow marker parameter definition.

0.99.6 (May 7, 2021)
--------------------
* Revert change brought by version 0.99.5.

0.99.5 (May 7, 2021)
--------------------
* Limit chessboard with to 90% of available space.

0.99.4 (May 5, 2021)
--------------------
* Provide function `adaptSquareSize(..)`.
* Minor fixes.

0.99.3 (May 3, 2021)
--------------------
* Change attribute 'isFlipped' into 'flipped'.
* Minor fixes.

0.99.2 (April 25, 2021)
-----------------------
* Improve chessboard attribute validation.
* Upgrade to Kokopu 1.8.0.

0.99.0 (April 3, 2021)
----------------------
* First public draft.
