/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2024  Yoann Le Montagner <yo35 -at- melix.net>       *
 *                                                                            *
 *    Kokopu-React is free software: you can redistribute it and/or           *
 *    modify it under the terms of the GNU Lesser General Public License      *
 *    as published by the Free Software Foundation, either version 3 of       *
 *    the License, or (at your option) any later version.                     *
 *                                                                            *
 *    Kokopu-React is distributed in the hope that it will be useful,         *
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of          *
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the            *
 *    GNU Lesser General Public License for more details.                     *
 *                                                                            *
 *    You should have received a copy of the GNU Lesser General               *
 *    Public License along with this program. If not, see                     *
 *    <http://www.gnu.org/licenses/>.                                         *
 *                                                                            *
 * -------------------------------------------------------------------------- */


const { exception, isPieceSymbolMapping, isAnnotationSymbol, isAnnotationColor, flattenSquareMarkers, parseSquareMarkers, flattenTextMarkers, parseTextMarkers,
    flattenArrowMarkers, parseArrowMarkers } = require('../build/test_headless/index');
const test = require('unit.js');


describe('Is piece symbol mapping', () => {

    function itIsPieceSymbolMapping(label, value, expected) {
        it(label, () => {
            test.value(isPieceSymbolMapping(value)).is(expected);
        });
    }

    itIsPieceSymbolMapping('French localization', { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C', P: 'P' } , true);
    itIsPieceSymbolMapping('Additional fields', { K: 'Ki_', Q: 'Qu_', R: 'Rk_', B: 'Bi_', N: 'Kn_', P: 'Pw_', Z: 'whatever', val: 42 }, true);
    itIsPieceSymbolMapping('Missing fields', { K: 'Ki_', Q: 'Qu_', R: 'Rk_', B: 'Bi_', N: 'Kn_' }, false);
    itIsPieceSymbolMapping('Non-string valued fields', { K: 42, Q: 'Qu_', R: 'Rk_', B: 'Bi_', N: 'Kn_', P: 'Pw_' }, false);

    itIsPieceSymbolMapping('String', 'whatever', false);
    itIsPieceSymbolMapping('null', null, false);
    itIsPieceSymbolMapping('undefined', undefined, false);
});


describe('Is Annotation symbol', () => {

    function itIsAnnotationSymbol(label, value, expected) {
        it(label, () => {
            test.value(isAnnotationSymbol(value)).is(expected);
        });
    }

    itIsAnnotationSymbol('Upper case letter', 'A', true);
    itIsAnnotationSymbol('Lower case letter', 'z', true);
    itIsAnnotationSymbol('Digit character', '0', true);
    itIsAnnotationSymbol('Special token 1', 'plus', true);
    itIsAnnotationSymbol('Special token 2', 'circle', true);

    itIsAnnotationSymbol('Non-special token', 'whatever', false);
    itIsAnnotationSymbol('Number', 0, false);
    itIsAnnotationSymbol('null', null, false);
    itIsAnnotationSymbol('undefined', undefined, false);
});


describe('Is Annotation color', () => {

    function itIsAnnotationColor(label, value, expected) {
        it(label, () => {
            test.value(isAnnotationColor(value)).is(expected);
        });
    }

    itIsAnnotationColor('b', 'b', true);
    itIsAnnotationColor('g', 'g', true);
    itIsAnnotationColor('r', 'r', true);
    itIsAnnotationColor('y', 'y', true);

    itIsAnnotationColor('Not a color', 'z', false);
    itIsAnnotationColor('Number', 42, false);
    itIsAnnotationColor('null', null, false);
    itIsAnnotationColor('undefined', undefined, false);
});


describe('Flatten square markers', () => {

    it('Re4', () => { test.value(flattenSquareMarkers({ e4: 'r' })).is('Re4'); });
    it('Gd3,Yh8', () => { test.value(flattenSquareMarkers({ h8: 'y', d3: 'g' })).is('Gd3,Yh8'); });
    it('Ga1,Yc5,Rd2,Bh7,Yh8', () => { test.value(flattenSquareMarkers({ c5: 'y', h8: 'y', a1: 'g', h7: 'b', d2: 'r' })).is('Ga1,Yc5,Rd2,Bh7,Yh8'); });
    it('<empty>', () => { test.value(flattenSquareMarkers({})).is(''); });

    it('Wrong square', () => { test.value(flattenSquareMarkers({ e1: 'r', k9: 'g', whatever: 'y' })).is('Re1'); });
    it('Wrong color', () => { test.value(flattenSquareMarkers({ a2: 'g', b5: 'R', c4: 42, h8: 'yellow' })).is('Ga2'); });

    it('Wrong type (not an object)', () => { test.exception(() => flattenSquareMarkers('whatever')).isInstanceOf(exception.IllegalArgument); });
    it('Wrong type (null)', () => { test.exception(() => flattenSquareMarkers(null)).isInstanceOf(exception.IllegalArgument); });
    it('Wrong type (undefined)', () => { test.exception(() => flattenSquareMarkers(undefined)).isInstanceOf(exception.IllegalArgument); });
});


describe('Parse square markers', () => {

    it('Re4', () => { test.value(parseSquareMarkers('Re4')).is({ e4: 'r' }); });
    it('Gd3,Yh8', () => { test.value(parseSquareMarkers('Gd3,Yh8')).is({ h8: 'y', d3: 'g' }); });
    it('Ga1,Yc5,Rd2,Bh7,Yh8', () => { test.value(parseSquareMarkers(' Ga1,  Yh8,Yc5 ,Rd2, Bh7 ')).is({ c5: 'y', h8: 'y', a1: 'g', h7: 'b', d2: 'r' }); });
    it('<empty>', () => { test.value(parseSquareMarkers('')).is({}); });
    it('<blank>', () => { test.value(parseSquareMarkers(' ')).is({}); });

    it('Wrong square', () => { test.value(parseSquareMarkers('Rg9,Ye1')).is({ e1: 'y' }); });
    it('Duplicated square', () => { test.value(parseSquareMarkers('Ra3,Ya3')).is({ a3: 'y' }); });
    it('Wrong color', () => { test.value(parseSquareMarkers('Ga6,Cg5')).is({ a6: 'g' }); });
    it('Wrong format', () => { test.value(parseSquareMarkers('Something Ra2 invalid, Ye4, G g3')).is({ e4: 'y' }); });

    it('Wrong type (not a string)', () => { test.exception(() => parseSquareMarkers(42)).isInstanceOf(exception.IllegalArgument); });
    it('Wrong type (null)', () => { test.exception(() => parseSquareMarkers(null)).isInstanceOf(exception.IllegalArgument); });
    it('Wrong type (undefined)', () => { test.exception(() => parseSquareMarkers(undefined)).isInstanceOf(exception.IllegalArgument); });
});


describe('Flatten text markers', () => {

    it('RAe4', () => { test.value(flattenTextMarkers({ e4: { symbol: 'A', color: 'r' } })).is('RAe4'); });
    it('Gzd3,Y1h8', () => { test.value(flattenTextMarkers({
        h8: { symbol: '1', color: 'y' },
        d3: { symbol: 'z', color: 'g' },
    })).is('Gzd3,Y1h8'); });
    it('G2a1,YMc5,RLd2,Rxh7,Bwh8', () => { test.value(flattenTextMarkers({
        c5: { symbol: 'M', color: 'y' },
        h8: { symbol: 'w', color: 'b' },
        a1: { symbol: '2', color: 'g' },
        h7: { symbol: 'x', color: 'r' },
        d2: { symbol: 'L', color: 'r' },
    })).is('G2a1,YMc5,RLd2,Rxh7,Bwh8'); });
    it('Multi-character symbols', () => { test.value(flattenTextMarkers({
        a1: { symbol: 'A', color: 'y' },
        a7: { symbol: 'plus', color: 'g' },
        b3: { symbol: 'times', color: 'r' },
        g5: { symbol: 'dot', color: 'y' },
        h3: { symbol: 'circle', color: 'g' },
    })).is('YAa1,G(plus)a7,R(times)b3,Y(dot)g5,G(circle)h3'); });
    it('<empty>', () => { test.value(flattenTextMarkers({})).is(''); });

    it('Wrong square', () => { test.value(flattenTextMarkers({
        e1: { symbol: 'H', color: 'r' },
        j5: { symbol: 'A', color: 'g' },
    })).is('RHe1'); });
    it('Wrong color', () => { test.value(flattenTextMarkers({
        a2: { symbol: '0', color: 'g' },
        b5: { symbol: 'A', color: 'R' },
        h8: { symbol: 'A' },
    })).is('G0a2'); });
    it('Wrong symbol', () => { test.value(flattenTextMarkers({
        a2: { symbol: '0', color: 'g' },
        b5: { symbol: '', color: 'r' },
        h8: { color: 'g' },
        d8: { symbol: '-', color: 'r' },
        c1: { symbol: 'abcd', color: 'r' },
    })).is('G0a2'); });
    it('Wrong multi-character symbol', () => { test.value(flattenTextMarkers({
        a2: { symbol: '0', color: 'g' },
        b5: { symbol: 'whatever', color: 'r' },
    })).is('G0a2'); });

    it('Wrong type (not an object)', () => { test.exception(() => flattenTextMarkers('whatever')).isInstanceOf(exception.IllegalArgument); });
    it('Wrong type (null)', () => { test.exception(() => flattenTextMarkers(null)).isInstanceOf(exception.IllegalArgument); });
    it('Wrong type (undefined)', () => { test.exception(() => flattenTextMarkers(undefined)).isInstanceOf(exception.IllegalArgument); });
});


describe('Parse text markers', () => {

    it('RAe4', () => { test.value(parseTextMarkers('RAe4')).is({ e4: { symbol: 'A', color: 'r' } }); });
    it('Gzd3,Y1h8', () => { test.value(parseTextMarkers('Gzd3,Y1h8')).is({
        h8: { symbol: '1', color: 'y' },
        d3: { symbol: 'z', color: 'g' },
    }); });
    it('G2a1,YMc5,RLd2,Rxh7,Bwh8', () => { test.value(parseTextMarkers(' G2a1, Rxh7  ,YMc5 ,RLd2,Bwh8 ')).is({
        c5: { symbol: 'M', color: 'y' },
        h8: { symbol: 'w', color: 'b' },
        a1: { symbol: '2', color: 'g' },
        h7: { symbol: 'x', color: 'r' },
        d2: { symbol: 'L', color: 'r' },
    }); });
    it('Multi-character symbols', () => { test.value(parseTextMarkers('YAa1,G(plus)a7, R(times)b3  ,Y(dot)g5,G(circle)h3')).is({
        a1: { symbol: 'A', color: 'y' },
        a7: { symbol: 'plus', color: 'g' },
        b3: { symbol: 'times', color: 'r' },
        g5: { symbol: 'dot', color: 'y' },
        h3: { symbol: 'circle', color: 'g' },
    }); });
    it('<empty>', () => { test.value(parseTextMarkers('')).is({}); });
    it('<blank>', () => { test.value(parseTextMarkers(' ')).is({}); });

    it('Wrong square', () => { test.value(parseTextMarkers('RHg9,Yxe1')).is({ e1: { symbol: 'x', color: 'y' } }); });
    it('Duplicated square', () => { test.value(parseTextMarkers('Rka3,Gba3')).is({ a3: { symbol: 'b', color: 'g' } }); });
    it('Wrong color', () => { test.value(parseTextMarkers('G3a6,CAg5')).is({ a6: { symbol: '3', color: 'g' } }); });
    it('Wrong symbol', () => { test.value(parseTextMarkers('Rb2,RAg5,G.d3,Yabcde7')).is({ g5: { symbol: 'A', color: 'r' } }); });
    it('Wrong multi-character symbol', () => { test.value(parseTextMarkers('RZb2,Y(whatever)e4')).is({ b2: { symbol: 'Z', color: 'r' } }); });
    it('Wrong format', () => { test.value(parseTextMarkers('Something RHa2 invalid, Yqe4, G g3')).is({ e4: { symbol: 'q', color: 'y' } }); });

    it('Wrong type (not a string)', () => { test.exception(() => parseTextMarkers(42)).isInstanceOf(exception.IllegalArgument); });
    it('Wrong type (null)', () => { test.exception(() => parseTextMarkers(null)).isInstanceOf(exception.IllegalArgument); });
    it('Wrong type (undefined)', () => { test.exception(() => parseTextMarkers(undefined)).isInstanceOf(exception.IllegalArgument); });
});


describe('Flatten arrow markers', () => {

    it('Re4d6', () => { test.value(flattenArrowMarkers({ e4d6: 'r' })).is('Re4d6'); });
    it('Gd3b4,Yh8h7', () => { test.value(flattenArrowMarkers({ h8h7: 'y', d3b4: 'g' })).is('Gd3b4,Yh8h7'); });
    it('Ga1h8,Yc5a1,Rd2d2,Rh7h8,Bh8c5', () => { test.value(flattenArrowMarkers({ c5a1: 'y', h8c5: 'b', a1h8: 'g', h7h8: 'r', d2d2: 'r' }))
        .is('Ga1h8,Yc5a1,Rd2d2,Rh7h8,Bh8c5'); });
    it('<empty>', () => { test.value(flattenArrowMarkers({})).is(''); });

    it('Wrong vector', () => { test.value(flattenArrowMarkers({ e1c2: 'r', a1b9: 'g', c0d2: 'r', i3d4: 'r', f2k3: 'g', whatever: 'y' })).is('Re1c2'); });
    it('Wrong color', () => { test.value(flattenArrowMarkers({ a2b3: 'g', b5c1: 'R', c4d8: 42, h8g1: 'yellow' })).is('Ga2b3'); });

    it('Wrong type (not an object)', () => { test.exception(() => flattenArrowMarkers('whatever')).isInstanceOf(exception.IllegalArgument); });
    it('Wrong type (null)', () => { test.exception(() => flattenArrowMarkers(null)).isInstanceOf(exception.IllegalArgument); });
    it('Wrong type (undefined)', () => { test.exception(() => flattenArrowMarkers(undefined)).isInstanceOf(exception.IllegalArgument); });
});


describe('Parse arrow markers', () => {

    it('Re4d6', () => { test.value(parseArrowMarkers('Re4d6')).is({ e4d6: 'r' }); });
    it('Gd3b4,Yh8h7', () => { test.value(parseArrowMarkers('Gd3b4,Yh8h7')).is({ h8h7: 'y', d3b4: 'g' }); });
    it('Ga1h8,Yc5a1,Rd2d2,Rh7h8,Bh8c5', () => { test.value(parseArrowMarkers(' Bh8c5,Ga1h8  , Yc5a1 ,  Rd2d2,Rh7h8  '))
        .is({ c5a1: 'y', h8c5: 'b', a1h8: 'g', h7h8: 'r', d2d2: 'r' }); });
    it('<empty>', () => { test.value(parseArrowMarkers('')).is({}); });
    it('<blank>', () => { test.value(parseArrowMarkers(' ')).is({}); });

    it('Wrong vector', () => { test.value(parseArrowMarkers('Re1c2,Ga1b9,Rc0d2,Ri3d4,Gf2k3')).is({ e1c2: 'r' }); });
    it('Duplicated vector', () => { test.value(parseArrowMarkers('Ya3b4,Ra3b4')).is({ a3b4: 'r' }); });
    it('Wrong color', () => { test.value(parseArrowMarkers('Ga6c5,Cg5e2')).is({ a6c5: 'g' }); });
    it('Wrong format', () => { test.value(parseArrowMarkers('Something Rb1a2 invalid, Ye4c7, G g3b1')).is({ e4c7: 'y' }); });

    it('Wrong type (not a string)', () => { test.exception(() => parseArrowMarkers(42)).isInstanceOf(exception.IllegalArgument); });
    it('Wrong type (null)', () => { test.exception(() => parseArrowMarkers(null)).isInstanceOf(exception.IllegalArgument); });
    it('Wrong type (undefined)', () => { test.exception(() => parseArrowMarkers(undefined)).isInstanceOf(exception.IllegalArgument); });
});
