ChangeLog
=========

3.3.2 (January 1, 2025)
-----------------------
* Add support for React 19.

3.3.1 (November 1, 2024)
------------------------
* Minor fixes.

3.3.0 (April 23, 2024)
----------------------
* Add methods `NavigationBoard.size()` and `NavigationBoard.adaptSquareSize()`.

3.2.0 (April 22, 2024)
----------------------
* Add support for additional buttons in the toolbar of `NavigationBoard`.
* Rework the toolbar look'n feel of `NavigationBoard`.
* Add auto-play feature in `NavigationBoard` (see [#7](https://github.com/yo35/kokopu-react/issues/7)).

3.1.0 (March 3, 2024)
---------------------
* Add support for null-moves in `Chessboard`.
* Add top/bottom auxilliary components in `Chessboard`.
* Add `NavigationBoard` (see [#6](https://github.com/yo35/kokopu-react/issues/6)).

3.0.2 (January 20, 2024)
------------------------
* Minor fixes in dependencies.

3.0.1 (July 14, 2023)
---------------------
* Add documentation regarding Webpack configuration.

3.0.0 (June 18, 2023)
---------------------
* Add attribute `turnVisible` on `Chessboard` to control whether the turn flag should be visible or not
(see [#3](https://github.com/yo35/kokopu-react/issues/3)).
* Add component `ChessPieceIcon`.
* Breaking changes affecting methods `Chessboard.size()` and `Chessboard.adaptSquareSize()`:
look at the [migration guide](https://kokopu-react.yo35.org/docs/current/#/Migrate%20to%203.x) for more details.

2.1.0 (May 26, 2023)
--------------------
* Listen to ESC key in Movetext to let the user unselect the currently selected move through keyboard.

2.0.1 (May 25, 2023)
--------------------
* Minor fixes.

2.0.0 (February 21, 2023)
-------------------------
* Migration to TypeScript.
* Breaking changes affecting `propTypes` properties and square size parameters:
look at the [migration guide](https://kokopu-react.yo35.org/docs/current/#/Migrate%20to%202.x) for more details.

1.11.1 (February 1, 2023)
-------------------------
* Fix drag-drop vs scroll conflict on mobile devices.

1.11.0 (February 1, 2023)
-------------------------
* Remove dependency on react-draggable.
* Add support for drag-drop on mobile devices.

1.10.1 (January 31, 2023)
-------------------------
* Continuous integration with GitHub Actions instead of Travis-CI.

1.10.0 (January 4, 2023)
------------------------
* Upgrade Kokopu to Kokopu 4.0.

1.9.2 (December 17, 2022)
-------------------------
* Fix use of findDOMNode (deprecated React feature) by react-draggable (see [#2](https://github.com/yo35/kokopu-react/issues/2)).

1.9.1 (November 17, 2022)
-------------------------
* Fix scroll issue on iOS (see [#1](https://github.com/yo35/kokopu-react/issues/1)).

1.9.0 (September 6, 2022)
-------------------------
* Remove dependency on react-motion (unmaintained package).

1.8.0 (August 26, 2022)
-----------------------
* Upgrade Kokopu to Kokopu 3.0.

1.7.2 (August 3, 2022)
----------------------
* Fix URLs in documentation.

1.7.1 (June 23, 2022)
---------------------
* `React` and `kokopu` declared as peer dependencies.
* Minor fixes.

1.7.0 (June 22, 2022)
---------------------
* Upgrade React to React 18.
* Add support for color blue for markers.
* Allow customization of the move arrow color in the `Chessboard` component.
* Change the property names used to define the marker colors in the objects returned by `Chessboard.colorsets()`:
`g`, `r`, `y` and `highlight` have become respectively `cg`, `cr`, `cy` and `cb`.

1.6.0 (June 1, 2022)
--------------------
* Allow block-formatting HTML tags in PGN comments.
* Provide `formatMove` and `moveFormatter`.

1.5.5 (May 18, 2022)
--------------------
* Upgrade dependencies.
* Remove dependency with security issue.

1.5.4 (May 1, 2022)
-------------------
* Provide method `Chessboard#size(..)` to retrieve the width/height of a `Chessboard` component instance.

1.5.3 (April 30, 2022)
----------------------
* Add method `Movetext#focus()`.
* Expose static methods `Movetext#firstNodeId(..)`, `Movetext#previousNodeId(..)`, `Movetext#nextNodeId(..)`
and `Movetext#lastNodeId(..)`.

1.5.2 (April 29, 2022)
----------------------
* Prevent default actions when handling key events in component `Movetext`.

1.5.1 (April 29, 2022)
----------------------
* Add argument `evtOrigin` in `onMoveSelected(..)` callback in component `Movetext`.

1.5.0 (April 27, 2022)
----------------------
* Add component `Movetext` to display chess games.

1.4.1 (January 1, 2022)
-----------------------
* Upgrade dependencies.

1.4.0 (October 21, 2021)
------------------------
* Add support for plus/times/dot/circle in text markers.

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
