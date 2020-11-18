import { fabric } from 'fabric'

const state = {
    canvas: ''
}

const getters = {}

const mutations = {
    setCanvas: (state, canvas)=>{
        state.canvas = canvas;
    },

    drawGrids: (state)=>{
        var grid = 50;
                var unitScale = 10;
                var canvasWidth =  100 * unitScale;
                var canvasHeight = 100 * unitScale;

                state.canvas.setWidth(canvasWidth);
                state.canvas.setHeight(canvasHeight);

                for (var i = 0; i < (canvasWidth / grid); i++) {
                state.canvas.add(new fabric.Line([ i * grid, 0, i * grid, canvasHeight], { type:'line', stroke: '#ccc', selectable: false }));
                state.canvas.add(new fabric.Line([ 0, i * grid, canvasWidth, i * grid], { type: 'line', stroke: '#ccc', selectable: false }))
                }
    },

    drawRectangle: (state,rectangle)=>{
        state.canvas.add(rectangle);
    }
}

const actions = {
    setCanvas:(context,canvas)=>{
       context.commit('setCanvas',canvas)
    },

    drawGrids: (context)=>{
        context.commit('drawGrids')
    },

    addRectangle: (context)=>{
        var rectangle = new fabric.Rect({
            width:100,
            height:70,
            fill: '#ccc',
            stroke: 'grey',
            left: 10,
            top:20,
            id: new Date().getUTCMilliseconds(),
        });

        context.commit('drawRectangle',rectangle);
    },
    
}

export default {
    state,
    getters,
    actions,
    mutations
}