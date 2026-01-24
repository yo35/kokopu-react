/*!
 * -------------------------------------------------------------------------- *
 *                                                                            *
 *    Kokopu-React - A React-based library of chess-related components.       *
 *    <https://www.npmjs.com/package/kokopu-react>                            *
 *    Copyright (C) 2021-2026  Yoann Le Montagner <yo35 -at- melix.net>       *
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
const assert = require('node:assert/strict');


describe('Is piece symbol mapping', () => {

    function itIsPieceSymbolMapping(label, value, expected) {
        it(label, () => {
            assert.deepEqual(isPieceSymbolMapping(value), expected);
        });
    }

    itIsPieceSymbolMapping('French localization', { K: 'R', Q: 'D', R: 'T', B: 'F', N: 'C', P: 'P' }, true);
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
            assert.deepEqual(isAnnotationSymbol(value), expected);
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
            assert.deepEqual(isAnnotationColor(value), expected);
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

    it('Re4', () => { assert.deepEqual(flattenSquareMarkers({ e4: 'r' }), 'Re4'); });
    it('Gd3,Yh8', () => { assert.deepEqual(flattenSquareMarkers({ h8: 'y', d3: 'g' }), 'Gd3,Yh8'); });
    it('Ga1,Yc5,Rd2,Bh7,Yh8', () => { assert.deepEqual(flattenSquareMarkers({ c5: 'y', h8: 'y', a1: 'g', h7: 'b', d2: 'r' }), 'Ga1,Yc5,Rd2,Bh7,Yh8'); });
    it('<empty>', () => { assert.deepEqual(flattenSquareMarkers({}), ''); });

    it('Wrong square', () => { assert.deepEqual(flattenSquareMarkers({ e1: 'r', k9: 'g', whatever: 'y' }), 'Re1'); });
    it('Wrong color', () => { assert.deepEqual(flattenSquareMarkers({ a2: 'g', b5: 'R', c4: 42, h8: 'yellow' }), 'Ga2'); });

    it('Wrong type (not an object)', () => { assert.throws(() => flattenSquareMarkers('whatever'), exception.IllegalArgument); });
    it('Wrong type (null)', () => { assert.throws(() => flattenSquareMarkers(null), exception.IllegalArgument); });
    it('Wrong type (undefined)', () => { assert.throws(() => flattenSquareMarkers(undefined), exception.IllegalArgument); });
});


describe('Parse square markers', () => {

    it('Re4', () => { assert.deepEqual(parseSquareMarkers('Re4'), { e4: 'r' }); });
    it('Gd3,Yh8', () => { assert.deepEqual(parseSquareMarkers('Gd3,Yh8'), { h8: 'y', d3: 'g' }); });
    it('Ga1,Yc5,Rd2,Bh7,Yh8', () => { assert.deepEqual(parseSquareMarkers(' Ga1,  Yh8,Yc5 ,Rd2, Bh7 '), { c5: 'y', h8: 'y', a1: 'g', h7: 'b', d2: 'r' }); });
    it('<empty>', () => { assert.deepEqual(parseSquareMarkers(''), {}); });
    it('<blank>', () => { assert.deepEqual(parseSquareMarkers(' '), {}); });

    it('Wrong square', () => { assert.deepEqual(parseSquareMarkers('Rg9,Ye1'), { e1: 'y' }); });
    it('Duplicated square', () => { assert.deepEqual(parseSquareMarkers('Ra3,Ya3'), { a3: 'y' }); });
    it('Wrong color', () => { assert.deepEqual(parseSquareMarkers('Ga6,Cg5'), { a6: 'g' }); });
    it('Wrong format', () => { assert.deepEqual(parseSquareMarkers('Something Ra2 invalid, Ye4, G g3'), { e4: 'y' }); });

    it('Wrong type (not a string)', () => { assert.throws(() => parseSquareMarkers(42), exception.IllegalArgument); });
    it('Wrong type (null)', () => { assert.throws(() => parseSquareMarkers(null), exception.IllegalArgument); });
    it('Wrong type (undefined)', () => { assert.throws(() => parseSquareMarkers(undefined), exception.IllegalArgument); });
});


describe('Flatten text markers', () => {

    it('RAe4', () => { assert.deepEqual(flattenTextMarkers({ e4: { symbol: 'A', color: 'r' } }), 'RAe4'); });
    it('Gzd3,Y1h8', () => {
        assert.deepEqual(flattenTextMarkers({
            h8: { symbol: '1', color: 'y' },
            d3: { symbol: 'z', color: 'g' },
        }), 'Gzd3,Y1h8');
    });
    it('G2a1,YMc5,RLd2,Rxh7,Bwh8', () => {
        assert.deepEqual(flattenTextMarkers({
            c5: { symbol: 'M', color: 'y' },
            h8: { symbol: 'w', color: 'b' },
            a1: { symbol: '2', color: 'g' },
            h7: { symbol: 'x', color: 'r' },
            d2: { symbol: 'L', color: 'r' },
        }), 'G2a1,YMc5,RLd2,Rxh7,Bwh8');
    });
    it('Multi-character symbols', () => {
        assert.deepEqual(flattenTextMarkers({
            a1: { symbol: 'A', color: 'y' },
            a7: { symbol: 'plus', color: 'g' },
            b3: { symbol: 'times', color: 'r' },
            g5: { symbol: 'dot', color: 'y' },
            h3: { symbol: 'circle', color: 'g' },
        }), 'YAa1,G(plus)a7,R(times)b3,Y(dot)g5,G(circle)h3');
    });
    it('<empty>', () => { assert.deepEqual(flattenTextMarkers({}), ''); });

    it('Wrong square', () => {
        assert.deepEqual(flattenTextMarkers({
            e1: { symbol: 'H', color: 'r' },
            j5: { symbol: 'A', color: 'g' },
        }), 'RHe1');
    });
    it('Wrong color', () => {
        assert.deepEqual(flattenTextMarkers({
            a2: { symbol: '0', color: 'g' },
            b5: { symbol: 'A', color: 'R' },
            h8: { symbol: 'A' },
        }), 'G0a2');
    });
    it('Wrong symbol', () => {
        assert.deepEqual(flattenTextMarkers({
            a2: { symbol: '0', color: 'g' },
            b5: { symbol: '', color: 'r' },
            h8: { color: 'g' },
            d8: { symbol: '-', color: 'r' },
            c1: { symbol: 'abcd', color: 'r' },
        }), 'G0a2');
    });
    it('Wrong multi-character symbol', () => {
        assert.deepEqual(flattenTextMarkers({
            a2: { symbol: '0', color: 'g' },
            b5: { symbol: 'whatever', color: 'r' },
        }), 'G0a2');
    });

    it('Wrong type (not an object)', () => { assert.throws(() => flattenTextMarkers('whatever'), exception.IllegalArgument); });
    it('Wrong type (null)', () => { assert.throws(() => flattenTextMarkers(null), exception.IllegalArgument); });
    it('Wrong type (undefined)', () => { assert.throws(() => flattenTextMarkers(undefined), exception.IllegalArgument); });
});


describe('Parse text markers', () => {

    it('RAe4', () => { assert.deepEqual(parseTextMarkers('RAe4'), { e4: { symbol: 'A', color: 'r' } }); });
    it('Gzd3,Y1h8', () => {
        assert.deepEqual(parseTextMarkers('Gzd3,Y1h8'), {
            h8: { symbol: '1', color: 'y' },
            d3: { symbol: 'z', color: 'g' },
        });
    });
    it('G2a1,YMc5,RLd2,Rxh7,Bwh8', () => {
        assert.deepEqual(parseTextMarkers(' G2a1, Rxh7  ,YMc5 ,RLd2,Bwh8 '), {
            c5: { symbol: 'M', color: 'y' },
            h8: { symbol: 'w', color: 'b' },
            a1: { symbol: '2', color: 'g' },
            h7: { symbol: 'x', color: 'r' },
            d2: { symbol: 'L', color: 'r' },
        });
    });
    it('Multi-character symbols', () => {
        assert.deepEqual(parseTextMarkers('YAa1,G(plus)a7, R(times)b3  ,Y(dot)g5,G(circle)h3'), {
            a1: { symbol: 'A', color: 'y' },
            a7: { symbol: 'plus', color: 'g' },
            b3: { symbol: 'times', color: 'r' },
            g5: { symbol: 'dot', color: 'y' },
            h3: { symbol: 'circle', color: 'g' },
        });
    });
    it('<empty>', () => { assert.deepEqual(parseTextMarkers(''), {}); });
    it('<blank>', () => { assert.deepEqual(parseTextMarkers(' '), {}); });
    it('Wrong square', () => { assert.deepEqual(parseTextMarkers('RHg9,Yxe1'), { e1: { symbol: 'x', color: 'y' } }); });
    it('Duplicated square', () => { assert.deepEqual(parseTextMarkers('Rka3,Gba3'), { a3: { symbol: 'b', color: 'g' } }); });
    it('Wrong color', () => { assert.deepEqual(parseTextMarkers('G3a6,CAg5'), { a6: { symbol: '3', color: 'g' } }); });
    it('Wrong symbol', () => { assert.deepEqual(parseTextMarkers('Rb2,RAg5,G.d3,Yabcde7'), { g5: { symbol: 'A', color: 'r' } }); });
    it('Wrong multi-character symbol', () => { assert.deepEqual(parseTextMarkers('RZb2,Y(whatever)e4'), { b2: { symbol: 'Z', color: 'r' } }); });
    it('Wrong format', () => { assert.deepEqual(parseTextMarkers('Something RHa2 invalid, Yqe4, G g3'), { e4: { symbol: 'q', color: 'y' } }); });

    it('Wrong type (not a string)', () => { assert.throws(() => parseTextMarkers(42), exception.IllegalArgument); });
    it('Wrong type (null)', () => { assert.throws(() => parseTextMarkers(null), exception.IllegalArgument); });
    it('Wrong type (undefined)', () => { assert.throws(() => parseTextMarkers(undefined), exception.IllegalArgument); });
});


describe('Flatten arrow markers', () => {

    it('Re4d6', () => { assert.deepEqual(flattenArrowMarkers({ e4d6: 'r' }), 'Re4d6'); });
    it('Gd3b4,Yh8h7', () => { assert.deepEqual(flattenArrowMarkers({ h8h7: 'y', d3b4: 'g' }), 'Gd3b4,Yh8h7'); });
    it('Ga1h8,Yc5a1,Rd2d2,Rh7h8,Bh8c5', () => {
        assert.deepEqual(flattenArrowMarkers({ c5a1: 'y', h8c5: 'b', a1h8: 'g', h7h8: 'r', d2d2: 'r' }), 'Ga1h8,Yc5a1,Rd2d2,Rh7h8,Bh8c5');
    });
    it('<empty>', () => { assert.deepEqual(flattenArrowMarkers({}), ''); });

    it('Wrong vector', () => { assert.deepEqual(flattenArrowMarkers({ e1c2: 'r', a1b9: 'g', c0d2: 'r', i3d4: 'r', f2k3: 'g', whatever: 'y' }), 'Re1c2'); });
    it('Wrong color', () => { assert.deepEqual(flattenArrowMarkers({ a2b3: 'g', b5c1: 'R', c4d8: 42, h8g1: 'yellow' }), 'Ga2b3'); });

    it('Wrong type (not an object)', () => { assert.throws(() => flattenArrowMarkers('whatever'), exception.IllegalArgument); });
    it('Wrong type (null)', () => { assert.throws(() => flattenArrowMarkers(null), exception.IllegalArgument); });
    it('Wrong type (undefined)', () => { assert.throws(() => flattenArrowMarkers(undefined), exception.IllegalArgument); });
});


describe('Parse arrow markers', () => {

    it('Re4d6', () => { assert.deepEqual(parseArrowMarkers('Re4d6'), { e4d6: 'r' }); });
    it('Gd3b4,Yh8h7', () => { assert.deepEqual(parseArrowMarkers('Gd3b4,Yh8h7'), { h8h7: 'y', d3b4: 'g' }); });
    it('Ga1h8,Yc5a1,Rd2d2,Rh7h8,Bh8c5', () => {
        assert.deepEqual(parseArrowMarkers(' Bh8c5,Ga1h8  , Yc5a1 ,  Rd2d2,Rh7h8  '), { c5a1: 'y', h8c5: 'b', a1h8: 'g', h7h8: 'r', d2d2: 'r' });
    });
    it('<empty>', () => { assert.deepEqual(parseArrowMarkers(''), {}); });
    it('<blank>', () => { assert.deepEqual(parseArrowMarkers(' '), {}); });

    it('Wrong vector', () => { assert.deepEqual(parseArrowMarkers('Re1c2,Ga1b9,Rc0d2,Ri3d4,Gf2k3'), { e1c2: 'r' }); });
    it('Duplicated vector', () => { assert.deepEqual(parseArrowMarkers('Ya3b4,Ra3b4'), { a3b4: 'r' }); });
    it('Wrong color', () => { assert.deepEqual(parseArrowMarkers('Ga6c5,Cg5e2'), { a6c5: 'g' }); });
    it('Wrong format', () => { assert.deepEqual(parseArrowMarkers('Something Rb1a2 invalid, Ye4c7, G g3b1'), { e4c7: 'y' }); });

    it('Wrong type (not a string)', () => { assert.throws(() => parseArrowMarkers(42), exception.IllegalArgument); });
    it('Wrong type (null)', () => { assert.throws(() => parseArrowMarkers(null), exception.IllegalArgument); });
    it('Wrong type (undefined)', () => { assert.throws(() => parseArrowMarkers(undefined), exception.IllegalArgument); });
});
